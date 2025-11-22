import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {HasAuthorityDirective} from "../../../shared/directives/has-authority.directive";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe} from "@ngx-translate/core";
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../shared/utils/icon';
import {Authorities} from '../../../constants/authorities.constants';
import {Product, ProductsFilter} from '../../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    DecimalPipe,
    HasAuthorityDirective,
    NgForOf,
    NgSelectComponent,
    NgbPagination,
    ReactiveFormsModule,
    SafeHtmlPipe,
    TranslatePipe,
    FormsModule,
    NgClass,
    NgbTooltip
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

  }

  view(productId: number) {

  }

  openModalCreateProduct(productId?: number) {

  }

  delete(product: Product) {

  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
}
