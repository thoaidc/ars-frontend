import { Component } from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {UtilsService} from '../../../shared/utils/utils.service';
import {ToastrService} from 'ngx-toastr';
import {Shop, ShopsFilter} from '../../../core/models/shop.model';
import {ShopService} from '../../../core/services/shop.service';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_SEARCH, ICON_STOP} from '../../../shared/utils/icon';

@Component({
  selector: 'app-admin-shop',
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
    NgClass,
    NgbTooltip
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
  shopsFilter: ShopsFilter = {
    page: 1,
    size: 10
  };
  shops: Shop[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;

  constructor(
    private translateService: TranslateService,
    private shopService: ShopService,
    private utilService: UtilsService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.shopsFilter.page = 1;
    this.getShopsWithPaging();
  }

  onChangedPage(event: any): void {
    this.shopsFilter.page = event;
    this.getShopsWithPaging();
  }

  getShopsWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.shopsFilter);
    this.shopService.getAllWithPaging(searchRequest).subscribe(response => {
      this.shops = response.result || [];
      this.totalItems = response.total || this.shops.length;
    });
  }

  changeShopStatus(shop: Shop) {

  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_STOP = ICON_STOP;
}
