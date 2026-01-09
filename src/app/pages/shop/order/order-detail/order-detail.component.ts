import {Component, Input, Renderer2} from '@angular/core';
import {AlphanumericOnlyDirective} from '../../../../shared/directives/alphanumeric-only.directive';
import {FormsModule} from '@angular/forms';
import {Location, NgClass, NgForOf, NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgbActiveModal, NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {LoadingOption} from '../../../../shared/utils/loading-option';
import {OrderDetail, OrderProduct, OrderViewType, SubOrderDetail} from '../../../../core/models/order.model';
import {OrderService} from '../../../../core/services/order.service';
import {ICON_UPLOAD} from "../../../../shared/utils/icon";
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {UploadDesignComponent} from '../upload-design-file/upload-design-file.component';
import {
  OrderProductReviewComponent
} from '../../../client/order-history/order-product-review/order-product-review.component';
import {ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS} from "../../../../constants/order.constants";
import {CartProductOption} from '../../../../core/models/cart.model';
import {CartDetailComponent} from '../../../client/cart/cart-detail/cart-detail.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    AlphanumericOnlyDirective,
    FormsModule,
    NgForOf,
    NgIf,
    TranslatePipe,
    NgClass,
    SafeHtmlPipe,
    NgbTooltip
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  currentTab: number = 0;
  orderDetail?: OrderDetail;
  subOrderDetail?: SubOrderDetail;
  @Input() orderId: number = 0;
  @Input() type: string = OrderViewType.SUB_ORDER;
  private modalRef?: NgbModalRef;

  constructor(
    public toastr: ToastrService,
    public location: Location,
    public translateService: TranslateService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public renderer: Renderer2,
    public utilService: UtilsService,
    public loading: LoadingOption,
    private orderService: OrderService
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss();
    });
  }

  ngOnInit(): void {
    if (this.type === OrderViewType.ORDER) {
      this.loadOrderDetail();
    } else if (this.type === OrderViewType.SUB_ORDER) {
      this.loadSubOrderDetail();
    }
  }

  loadSubOrderDetail() {
    this.orderService.getByIdForShop(this.orderId).subscribe(response => {
      if (response) {
        this.subOrderDetail = response;
      } else {
        this.toastr.error('Không tìm thấy thông tin đơn hàng');
      }
    })
  }

  loadOrderDetail() {
    this.orderService.getById(this.orderId).subscribe(response => {
      if (response) {
        this.orderDetail = response;
      } else {
        this.toastr.error('Không tìm thấy thông tin đơn hàng');
      }
    })
  }

  view(product: OrderProduct) {
    let options: CartProductOption[] = [];

    if (product.data) {
      const dataProduct = JSON.parse(product.data);
      options = dataProduct.selectedOptions;
    }

    if (options && options.length > 0) {
      const modalRef = this.modalService.open(CartDetailComponent, {size: 'lg', backdrop: 'static'});
      modalRef.componentInstance.cartProductOptions = options;
    } else {
      const modalRef = this.modalService.open(CartDetailComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.thumbnail = product.productThumbnail;
    }
  }

  checkCustomizable(productData: string): boolean {
    if (productData) {
      const dataProduct = JSON.parse(productData);
      return dataProduct.customizable;
    }

    return false;
  }

  openUploadModal(orderProductId: number) {
    const modalRef = this.modalService.open(UploadDesignComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderProductId = orderProductId;
    modalRef.result.then().finally(() => this.ngOnInit());
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }

  protected readonly ICON_UPLOAD = ICON_UPLOAD;
    protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
  protected readonly PAYMENT_STATUS = PAYMENT_STATUS;
}
