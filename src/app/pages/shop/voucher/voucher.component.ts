import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ShopsFilter} from '../../../core/models/shop.model';
import {UtilsService} from '../../../shared/utils/utils.service';
import {ToastrService} from 'ngx-toastr';
import {VoucherService} from '../../../core/services/voucher.service';
import {Voucher} from '../../../core/models/voucher.model';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../shared/utils/icon';
import {ModalConfirmDialogComponent} from '../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {BaseResponse} from '../../../core/models/response.model';
import {SaveVoucherComponent} from './save-voucher/save-voucher.component';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgSelectComponent,
    NgbPagination,
    ReactiveFormsModule,
    SafeHtmlPipe,
    TranslatePipe,
    NgbTooltip,
    NgClass,
    FormsModule
  ],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.scss'
})
export class VoucherComponent implements OnInit {
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

  openModalSaveVoucher(voucher?: Voucher) {
    this.modalRef = this.modalService.open(SaveVoucherComponent, { size: 'xl', backdrop: 'static' });

    if (voucher) {
      this.modalRef.componentInstance.voucher = voucher;
    }

    this.modalRef.componentInstance.isUpdatable = true;
    this.modalRef.closed.subscribe(response => {
      if (response) {
        this.onSearch();
      }
    });
  }

  delete(voucherId: number) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {size: 'lg', backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắn chắn muốn xóa mục này không?';
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.voucherService.deleteVoucherById(voucherId).subscribe(response => {
          this.notify(response, 'Xóa mã giảm giá thành công', 'Xóa mã giảm giá thất bại');
        });

        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  private notify(response: BaseResponse<any>, successMessage: string, errorMessage: string) {
    if (response.status) {
      this.toast.success(this.translateService.instant(successMessage));
      this.onSearch();
    } else {
      this.toast.error(
        response.message
          ? response.message
          : this.translateService.instant(errorMessage)
      );
    }
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly ICON_PLUS = ICON_PLUS;
}
