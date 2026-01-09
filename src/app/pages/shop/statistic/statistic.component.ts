import {Component, OnInit} from '@angular/core';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_EXCEL, ICON_SEARCH} from '../../../shared/utils/icon';
import {DecimalPipe, NgClass, NgForOf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {TranslatePipe} from '@ngx-translate/core';
import {StatisticService} from '../../../core/services/statistic.service';
import {ReportDTO, StatisticFilter} from '../../../core/models/statistic.model';
import {Authentication} from '../../../core/models/auth.model';
import {AuthService} from '../../../core/services/auth.service';
import {DateFilterComponent} from '../../../shared/components/date-filter/date-filter.component';
import {VndCurrencyPipe} from '../../../shared/pipes/vnd-currency.pipe';

@Component({
  selector: 'app-shop-statistic',
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
    DateFilterComponent,
    VndCurrencyPipe
  ],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent implements OnInit {
  statisticFilter: StatisticFilter = {
    page: 1,
    size: 10
  };
  reports: ReportDTO[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  authentication!: Authentication;
  periods = 1;

  constructor(
    private statisticService: StatisticService,
    private authService: AuthService
  ) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
        this.statisticFilter.shopId = response.shopId
      }
    });
  }

  onTimeChange(even: any) {
    this.statisticFilter.fromDate = even.fromDate;
    this.statisticFilter.toDate = even.toDate;
    this.periods = even.periods;
    this.onSearch();
  }

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.statisticFilter.page = 1;
    this.getReportWithPaging();
  }

  onChangedPage(event: any): void {
    this.statisticFilter.page = event;
    this.getReportWithPaging();
  }

  getReportWithPaging() {
    this.statisticService.getAllWithPaging(this.statisticFilter).subscribe(response => {
      this.reports = response.result || [];
      this.totalItems = response.total || this.reports.length;
    });
  }

  exportExcel() {
    this.statisticService.exportExcel(this.statisticFilter).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bao_cao_doanh_thu.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
      },
      error: (err) => {
        console.error('Lỗi khi xuất file:', err);
      }
    });
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_EXCEL = ICON_EXCEL;
}
