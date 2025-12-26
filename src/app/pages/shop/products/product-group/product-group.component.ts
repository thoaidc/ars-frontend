import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../../shared/utils/icon';
import {Authorities} from '../../../../constants/authorities.constants';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {PAGINATION_PAGE_SIZE} from '../../../../constants/common.constants';
import {BaseFilterRequest} from '../../../../core/models/request.model';
import {ProductGroupDTO} from '../../../../core/models/product.model';
import {ProductGroupService} from '../../../../core/services/product-group.service';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {
  ModalConfirmDialogComponent
} from '../../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {BaseResponse} from '../../../../core/models/response.model';
import {SaveProductGroupComponent} from './save-group/save-group.component';
import {Authentication} from '../../../../core/models/auth.model';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-shop-product-group',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgSelectComponent,
    NgbPagination,
    ReactiveFormsModule,
    SafeHtmlPipe,
    TranslatePipe,
    FormsModule,
    NgbTooltip,
    NgClass
  ],
  templateUrl: './product-group.component.html',
  styleUrl: './product-group.component.scss'
})
export class ProductGroupComponent implements OnInit {
  productGroupsFilter: BaseFilterRequest = {
    page: 1,
    size: 10,
    keyword: ''
  };
  productGroups: ProductGroupDTO[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;
  authentication!: Authentication;

  constructor(
    private translateService: TranslateService,
    private productGroupService: ProductGroupService,
    private utilService: UtilsService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private authService: AuthService
  ) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
      }
    });
  }

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.productGroupsFilter.page = 1;
    this.getProductGroupWithPaging();
  }

  onChangedPage(event: any): void {
    this.productGroupsFilter.page = event;
    this.getProductGroupWithPaging();
  }

  getProductGroupWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.productGroupsFilter);
    this.productGroupService.getAllWithPaging(searchRequest).subscribe(response => {
      this.productGroups = response.result || [];
      this.totalItems = response.total || this.productGroups.length;
    });
  }

  openModalSaveProductGroup(productGroup?: ProductGroupDTO) {
    this.modalRef = this.modalService.open(SaveProductGroupComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.productGroup = productGroup ? productGroup : {
      id: 0,
      shopId: this.authentication.shopId,
      code: '',
      name: ''
    };

    this.modalRef.closed.subscribe((productGroup: any) => {
      if (productGroup) {
        this.productGroupService.saveProductGroup(productGroup).subscribe(response => {
          this.notify(response, 'Lưu nhóm sản phẩm thành công', 'Lưu nhóm sản phẩm thất bại');
        });

        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  delete(productGroupId: number) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {size: 'lg', backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắn chắn muốn xóa mục này không?';
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.productGroupService.deleteProductGroupById(productGroupId).subscribe(response => {
          this.notify(response, 'Xóa nhóm sản phẩm thành công', 'Xóa nhóm sản phẩm thất bại');
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
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
}
