import {Component, Input} from '@angular/core';
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
export class OrderPreviewComponent {
  @Input() product!: Product;
  private modalRef?: NgbModalRef;
  orderRequest!: CreateOrderRequest;
  authentication!: Authentication;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private orderService: OrderService,
    private toast: ToastrService
  ) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
      }
    });
  }

  payOrder(orderId: number) {
    this.modalRef = this.modalService.open(QrPaymentComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.orderId = orderId;
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
        this.toast.success('Tạo đơn hành thành công');
        this.payOrder(response.result);
        this.dismiss();
      }
    });
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
