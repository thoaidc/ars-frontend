import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../shared/utils/icon';
import {Authorities} from '../../../constants/authorities.constants';
import {Product, ProductsFilter} from '../../../core/models/product.model';
import {ProductService} from '../../../core/services/product.service';
import {UtilsService} from '../../../shared/utils/utils.service';
import {ToastrService} from 'ngx-toastr';
import {
  ModalUpdateProductComponent
} from '../../shop/products/product-design/modal-update-product/modal-update-product.component';

@Component({
  selector: 'app-admin-products',
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
    NgClass
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  productsFilter: ProductsFilter = {
    page: 1,
    size: 10,
    keyword: ''
  };
  products: Product[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;

  constructor(
    private translateService: TranslateService,
    private productService: ProductService,
    private utilService: UtilsService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.onSearch();
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

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
}
