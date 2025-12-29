import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SafeHtmlPipe} from "../../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Product, ProductsFilter} from '../../../../core/models/product.model';
import {PAGINATION_PAGE_SIZE} from '../../../../constants/common.constants';
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../../shared/utils/icon';
import {Authorities} from '../../../../constants/authorities.constants';
import {ProductService} from '../../../../core/services/product.service';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {
  ModalConfirmDialogComponent
} from '../../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {ModalCreateProductComponent} from './modal-create-product/modal-create-product.component';
import {ModalUpdateProductComponent} from './modal-update-product/modal-update-product.component';
import {PRODUCT_STATUS} from '../../../../constants/order.constants';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-shop-product-design',
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
    NgClass,
    VndCurrencyPipe
  ],
  templateUrl: './product-design.component.html',
  styleUrl: './product-design.component.scss'
})
export class ProductDesignComponent implements OnInit {
  productsFilter: ProductsFilter = {
    page: 1,
    size: 10,
    keyword: ''
  };
  shopId: number = 0;
  products: Product[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;

  constructor(
    private translateService: TranslateService,
    private productService: ProductService,
    private utilService: UtilsService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.shopId = response.shopId || 0;

        if (this.shopId > 0) {
          this.productsFilter.shopId = this.shopId;
          this.onSearch();
        }
      }
    });
  }

  onSearch() {
    this.productsFilter.page = 1;
    this.getProductWithPaging();
  }

  onChangedPage(event: any): void {
    this.productsFilter.page = event;
    this.getProductWithPaging();
  }

  getProductWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.productsFilter);
    this.productService.getAllWithPaging(searchRequest).subscribe(response => {
      this.products = response.result || [];
      this.totalItems = response.total || this.products.length;
    });
  }

  view(productId: number) {
    this.modalRef = this.modalService.open(ModalUpdateProductComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.productId = productId;
    this.modalRef.componentInstance.isUpdatable = false;
  }

  openModalCreateProduct() {
    this.modalRef = this.modalService.open(ModalCreateProductComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.closed.subscribe(response => {
      if (response) {
        this.onSearch();
      }
    });
  }

  openModalUpdateProduct(productId: number) {
    this.modalRef = this.modalService.open(ModalUpdateProductComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.productId = productId;
    this.modalRef.componentInstance.isUpdatable = true;
    this.modalRef.closed.subscribe(response => {
      if (response) {
        this.onSearch();
      }
    });
  }

  delete(product: Product) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {size: 'lg', backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắn chắn muốn xóa mục này không?';
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.productService.deleteProductById(product.id).subscribe(response => {
          if (response.status) {
            this.toast.success('Xóa thành công');
            this.onSearch();
          } else {
            this.toast.error(
              response.message
                ? response.message
                : this.translateService.instant('notification.deleteCategoryFailed')
            );
          }
        });

        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly PRODUCT_STATUS = PRODUCT_STATUS;
}
