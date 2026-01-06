import {Component, Input, OnDestroy} from '@angular/core';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {QrPaymentComponent} from '../qr-payment/qr-payment.component';
import {CreateOrderRequest, OrderProductRequest} from '../../../../core/models/order.model';
import {AuthService} from '../../../../core/services/auth.service';
import {Authentication} from '../../../../core/models/auth.model';
import {OrderService} from '../../../../core/services/order.service';
import {ToastrService} from 'ngx-toastr';
import {WebSocketService} from '../../../../core/services/websocket.service';
import {PaymentInfo} from '../../../../core/models/payment.model';
import {CartProduct, CartProductOption} from '../../../../core/models/cart.model';
import {CartService} from '../../../../core/services/cart.service';
import {VoucherService} from '../../../../core/services/voucher.service';
import {Voucher} from '../../../../core/models/voucher.model';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {CartDetailComponent} from '../../cart/cart-detail/cart-detail.component';

@Component({
  selector: 'app-order-preview',
  standalone: true,
  imports: [
    VndCurrencyPipe,
    NgIf,
    NgForOf,
    DecimalPipe
  ],
  templateUrl: './order-preview.component.html',
  styleUrl: './order-preview.component.scss'
})
export class OrderPreviewComponent implements OnDestroy {
  private _products: CartProduct[] = [];
  private modalRef?: NgbModalRef;
  orderRequest: CreateOrderRequest = {
    customerId: 0,
    customerName: '',
    paymentMethod: 'pay_os',
    voucherIds: [],
    products: []
  };
  authentication!: Authentication;
  paymentTopicName: string = '/topics/payment_notification_';
  isPendingPayment: boolean = false;
  amount: number = 0;
  discount: number = 0;
  totalAmount: number = 0;
  vouchers: Voucher[] = [];
  rawAmount: number = 0;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private orderService: OrderService,
    private toast: ToastrService,
    private webSocketService: WebSocketService,
    private cartService: CartService,
    private voucherService: VoucherService,
    private untilService: UtilsService
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

  @Input() set products(value: CartProduct[]) {
    this._products = value;
    console.log(this.products);

    if (value && value.length > 0) {
      this.getVouchers();
    }
  }

  get products(): CartProduct[] {
    return this._products;
  }

  getVouchers() {
    if (this.products && this.products.length > 0) {
      const shopIds = this.products.map(product => product.shopId);
      this.voucherService.getAllForUser(shopIds).subscribe(response => {
        this.vouchers = response.result || [];
        this.calculateAmount();
      });
    }
  }

  onVoucherChange(voucher: Voucher, event: any): void {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.removeVoucherByShopId(voucher.shopId);
      this.orderRequest.voucherIds.push(voucher.id);
    } else {
      this.orderRequest.voucherIds = this.orderRequest.voucherIds.filter(id => id !== voucher.id);
    }

    this.calculateAmount();
  }

  removeVoucherByShopId(shopId: number): void {
    this.orderRequest.voucherIds = this.orderRequest.voucherIds.filter(vId => {
      const v = this.vouchers.find(x => x.id === vId);
      return v ? v.shopId !== shopId : true;
    });
  }

  calculateAmount(): void {
    this.rawAmount = 0;
    let totalDiscount = 0;
    const productsByShop = new Map<number, number>();

    this.amount = this.products.reduce((total, cartProduct) => {
      return total + Number(cartProduct.price);
    }, 0);

    this.products.forEach(p => {
      const price = parseFloat(p.price) || 0;
      const shopTotal = productsByShop.get(p.shopId) || 0;
      productsByShop.set(p.shopId, shopTotal + price);
      this.rawAmount += price;
    });

    this.orderRequest.voucherIds.forEach(vId => {
      const voucher = this.vouchers.find(v => v.id === vId);
      if (!voucher) return;

      const shopTotal = productsByShop.get(voucher.shopId) || 0;
      if (shopTotal === 0) return;

      let discountValue = 0;

      if (voucher.type === 1) {
        discountValue = voucher.value;
      } else if (voucher.type === 2) {
        discountValue = (shopTotal * voucher.value) / 100;
      }

      totalDiscount += Math.min(discountValue, shopTotal);
    });

    this.totalAmount = Math.max(0, this.rawAmount - totalDiscount);
  }

  previewOrderProduct(product: CartProduct) {
    let options: CartProductOption[] = [];

    if (product.data) {
      options = JSON.parse(product.data) as CartProductOption[];
    }

    if (options && options.length > 0) {
      this.modalRef = this.modalService.open(CartDetailComponent, {size: 'lg', backdrop: 'static'});
      this.modalRef.componentInstance.cartProductOptions = options;
    } else {
      this.modalRef = this.modalService.open(CartDetailComponent, { size: 'lg', backdrop: 'static' });
      this.modalRef.componentInstance.thumbnail = product.thumbnail;
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
      ...this.orderRequest,
      customerId: this.authentication.id,
      customerName: this.authentication.fullname
    }

    this.orderRequest.products = this.products.map(product => {
      const orderProduct: OrderProductRequest = {
        productId: product.productId,
        shopId: product.shopId
      }

      if (product.data && product.data !== '') {
        orderProduct.data = product.data;
      }

      return orderProduct;
    });

    this.orderService.createOrder(this.orderRequest).subscribe(response => {
      if (response && response.status) {
        this.isPendingPayment = true;
        this.toast.success('Tạo đơn hành thành công');
        const productOrderedIds = this.orderRequest.products.map(product => product.productId);
        this.cartService.removeMultipleFromCart(productOrderedIds);
      }
    });
  }

  formatDateNumber(date: number) {
    return this.untilService.formatDateNumber(date);
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
