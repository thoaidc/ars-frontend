import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {QrPaymentComponent} from '../qr-payment/qr-payment.component';
import {CreateOrderRequest, OrderProductRequest} from '../../../../core/models/order.model';
import {AuthService} from '../../../../core/services/auth.service';
import {Authentication} from '../../../../core/models/auth.model';
import {OrderService} from '../../../../core/services/order.service';
import {ToastrService} from 'ngx-toastr';
import {WebSocketService} from '../../../../core/services/websocket.service';
import {PaymentInfo} from '../../../../core/models/payment.model';
import {CartProduct} from '../../../../core/models/cart.model';

@Component({
  selector: 'app-order-preview',
  standalone: true,
  imports: [
    VndCurrencyPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './order-preview.component.html',
  styleUrl: './order-preview.component.scss'
})
export class OrderPreviewComponent implements OnInit, OnDestroy {
  @Input() products!: CartProduct[];
  private modalRef?: NgbModalRef;
  orderRequest!: CreateOrderRequest;
  authentication!: Authentication;
  paymentTopicName: string = '/topics/payment_notification_';
  isPendingPayment: boolean = false;
  amount: number = 0;
  discount: number = 0;
  totalAmount: number = 0;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private orderService: OrderService,
    private toast: ToastrService,
    private webSocketService: WebSocketService
  ) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
        this.paymentTopicName = this.paymentTopicName + this.authentication.id;
        this.webSocketService.subscribeToTopic(this.paymentTopicName).subscribe(message => {
          if (message.body) {
            try {
              const paymentInfo = JSON.parse(message.body) as PaymentInfo;
              this.dismiss();
              this.payOrder(paymentInfo);
            } catch (e) {
              console.error('Lỗi parse JSON:', e);
            }
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.calculateAmount();
  }

  calculateAmount() {
    if (this.products && this.products.length > 0) {
      this.amount = this.products.reduce((total, cartProduct) => {
        return total + Number(cartProduct.price);
      }, 0);
      this.totalAmount = this.amount;
    }
  }

  payOrder(paymentInfo: PaymentInfo) {
    this.modalRef = this.modalService.open(QrPaymentComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.paymentInfo = paymentInfo;
  }

  createOrderRequest() {
    if (!this.authentication) {
      this.toast.error('Vui lòng đăng nhập để thực hiện đặt hàng');
      return;
    }

    this.orderRequest = {
      customerId: this.authentication.id,
      customerName: this.authentication.fullname,
      paymentMethod: 'pay_os',
      voucherIds: [],
      products: []
    }
    const orderProduct: OrderProductRequest = {
      productId: this.products[0].productId,
      shopId: this.products[0].shopId
    }
    this.orderRequest.products = [orderProduct];

    this.orderService.createOrder(this.orderRequest).subscribe(response => {
      if (response && response.status) {
        this.isPendingPayment = true;
        this.toast.success('Tạo đơn hành thành công');
      }
    });
  }

  dismiss() {
    this.webSocketService.unsubscribeFromTopic(this.paymentTopicName);
    this.activeModal.dismiss(false);
  }

  ngOnDestroy(): void {
    this.webSocketService.unsubscribeFromTopic(this.paymentTopicName);
  }

  protected readonly Number = Number;
}
