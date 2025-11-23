import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
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

  constructor(
    private translateService: TranslateService,
    private productGroupService: ProductGroupService,
    private utilService: UtilsService
  ) {}

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

  view(productGroupId: number) {

  }

  openModalCreateProductGroup(productGroupId?: number) {

  }

  delete(productGroupId: number) {

  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
}
