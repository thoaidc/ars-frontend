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
import {AttributeDTO} from '../../../../core/models/product.model';
import {CategoryService} from '../../../../core/services/category.service';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {AttributeService} from '../../../../core/services/attribute.service';

@Component({
  selector: 'app-shop-product-attribute',
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
  templateUrl: './product-attribute.component.html',
  styleUrl: './product-attribute.component.scss'
})
export class ProductAttributeComponent implements OnInit {
  attributesFilter: BaseFilterRequest = {
    page: 1,
    size: 10,
    keyword: ''
  };
  attributes: AttributeDTO[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;

  constructor(
    private translateService: TranslateService,
    private attributeService: AttributeService,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.attributesFilter.page = 1;
    this.getAttributesWithPaging();
  }

  onChangedPage(event: any): void {
    this.attributesFilter.page = event;
    this.getAttributesWithPaging();
  }

  getAttributesWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.attributesFilter);
    this.attributeService.getAllWithPaging(searchRequest).subscribe(response => {
      this.attributes = response.result || [];
      this.totalItems = response.total || this.attributes.length;
    });
  }

  view(attributeId: number) {

  }

  openModalCreateAttribute(attributeId?: number) {

  }

  delete(attributeId: number) {

  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
}
