import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../shared/utils/icon';
import {Authorities} from '../../../constants/authorities.constants';
import {BaseFilterRequest} from '../../../core/models/request.model';
import {CategoryDTO} from '../../../core/models/product.model';
import {CategoryService} from '../../../core/services/category.service';
import {UtilsService} from '../../../shared/utils/utils.service';

@Component({
  selector: 'app-category',
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
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categoriesFilter: BaseFilterRequest = {
    page: 1,
    size: 10,
    keyword: ''
  };
  categories: CategoryDTO[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;

  constructor(
    private translateService: TranslateService,
    private categoryService: CategoryService,
    private utilService: UtilsService
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.categoriesFilter.page = 1;
    this.getCategoriesWithPaging();
  }

  onChangedPage(event: any): void {
    this.categoriesFilter.page = event;
    this.getCategoriesWithPaging();
  }

  getCategoriesWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.categoriesFilter);
    this.categoryService.getAllWithPaging(searchRequest).subscribe(response => {
      this.categories = response.result || [];
      this.totalItems = response.total || this.categories.length;
    });
  }

  view(categoryId: number) {

  }

  openModalCreateCategory(categoryId?: number) {

  }

  delete(categoryId: number) {
    this.categoryService.deleteCategoryById(categoryId).subscribe(response => {
      this.onSearch();
    });
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
}
