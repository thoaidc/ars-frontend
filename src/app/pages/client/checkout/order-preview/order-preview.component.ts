import {Component, Input, OnDestroy} from '@angular/core';
import {Product} from '../../../../core/models/product.model';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import {NgIf} from '@angular/common';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {QrPaymentComponent} from '../qr-payment/qr-payment.component';
import {CreateOrderRequest, OrderProductRequest} from '../../../../core/models/order.model';
import {AuthService} from '../../../../core/services/auth.service';
import {Authentication} from '../../../../core/models/auth.model';
import {OrderService} from '../../../../core/services/order.service';
import {ToastrService} from 'ngx-toastr';
import {WebSocketService} from '../../../../core/services/websocket.service';
import {PaymentInfo} from '../../../../core/models/payment.model';

@Component({
  selector: 'app-order-preview',
  standalone: true,
  imports: [
    VndCurrencyPipe,
    NgIf
  ],
  templateUrl: './order-preview.component.html',
  styleUrl: './order-preview.component.scss'
})
export class OrderPreviewComponent implements OnDestroy {
  @Input() product!: Product;
  private modalRef?: NgbModalRef;
  orderRequest!: CreateOrderRequest;
  authentication!: Authentication;
  paymentTopicName: string = '/topics/payment_notification_';
  isPendingPayment: boolean = false;

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

  payOrder(paymentInfo: PaymentInfo) {
    this.modalRef = this.modalService.open(QrPaymentComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.paymentInfo = paymentInfo;
  }

  createOrderRequest() {
    this.orderRequest = {
      customerId: this.authentication.id,
      customerName: this.authentication.fullname,
      paymentMethod: 'pay_os',
      voucherIds: [],
      products: []
    }
    const orderProduct: OrderProductRequest = {
      productId: this.product.id,
      shopId: this.product.shopId
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
}
