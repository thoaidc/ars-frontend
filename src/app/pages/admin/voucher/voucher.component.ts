import { Component } from '@angular/core';
import {DatePipe, DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ShopsFilter} from '../../../core/models/shop.model';
import {Voucher} from '../../../core/models/voucher.model';
import {VoucherService} from '../../../core/services/voucher.service';
import {UtilsService} from '../../../shared/utils/utils.service';
import {ToastrService} from 'ngx-toastr';
import {SaveVoucherComponent} from '../../shop/voucher/save-voucher/save-voucher.component';
import {PAGINATION_PAGE_SIZE} from 'app/constants/common.constants';
import {ICON_SEARCH} from '../../../shared/utils/icon';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgForOf,
    NgSelectComponent,
    NgbPagination,
    SafeHtmlPipe,
    TranslatePipe,
    NgClass,
    DatePipe
  ],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.scss'
})
export class VoucherComponent {
  vouchersFilter: ShopsFilter = {
    page: 1,
    size: 10
  };
  vouchers: Voucher[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;

  constructor(
    private translateService: TranslateService,
    private voucherService: VoucherService,
    private utilService: UtilsService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.vouchersFilter.page = 1;
    this.getShopsWithPaging();
  }

  onChangedPage(event: any): void {
    this.vouchersFilter.page = event;
    this.getShopsWithPaging();
  }

  getShopsWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.vouchersFilter);
    this.voucherService.getAllWithPaging(searchRequest).subscribe(response => {
      this.vouchers = response.result || [];
      this.totalItems = response.total || this.vouchers.length;
    });
  }

  view(voucherId: number) {
    this.modalRef = this.modalService.open(SaveVoucherComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.voucherId = voucherId;
    this.modalRef.componentInstance.isUpdatable = false;
  }

  formatDateString(date?: number): string {
    if (date) {
      const dateStr = String(date);
      if (!dateStr || dateStr.length !== 8) return dateStr;
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${year}-${month}-${day}`;
    }

    return '';
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
}
