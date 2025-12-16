import {Component, Input, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Location, NgClass, NgForOf, NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {LoadingOption} from '../../../../shared/utils/loading-option';
import {OrderDetail, OrderViewType, SubOrderDetail} from '../../../../core/models/order.model';
import {OrderService} from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TranslatePipe,
    NgClass
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

  view(productId: number) {

  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
