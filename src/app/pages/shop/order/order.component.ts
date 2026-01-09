import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {UtilsService} from '../../../shared/utils/utils.service';
import {ToastrService} from 'ngx-toastr';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {Order, OrdersFilter, OrderViewType} from '../../../core/models/order.model';
import {OrderService} from '../../../core/services/order.service';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_SEARCH} from '../../../shared/utils/icon';
import {ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS} from "../../../constants/order.constants";

@Component({
  selector: 'app-shop-order',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgForOf,
    NgSelectComponent,
    NgbPagination,
    SafeHtmlPipe,
    TranslatePipe,
    NgClass
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  ordersFilter: OrdersFilter = {
    page: 1,
    size: 10
  };
  orders: Order[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;

  constructor(
    private translateService: TranslateService,
    private orderService: OrderService,
    private utilService: UtilsService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.ordersFilter.page = 1;
    this.getOrderWithPaging();
  }

  onChangedPage(event: any): void {
    this.ordersFilter.page = event;
    this.getOrderWithPaging();
  }

  getOrderWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.ordersFilter);
    this.orderService.getAllWithPagingForShop(searchRequest).subscribe(response => {
      this.orders = response.result || [];
      this.totalItems = response.total || this.orders.length;
    });
  }

  view(orderId: number) {
    this.modalRef = this.modalService.open(OrderDetailComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.orderId = orderId;
    this.modalRef.componentInstance.type = OrderViewType.SUB_ORDER;
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
  protected readonly PAYMENT_STATUS = PAYMENT_STATUS;
}
