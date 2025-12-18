import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {CountUpDirective} from '../../../shared/directives/count-up-number.directive';
import {ToastrService} from 'ngx-toastr';
import {ICON_SEARCH} from '../../../shared/utils/icon';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {BaseFilterRequest} from '../../../core/models/request.model';
import {PaymentHistory} from '../../../core/models/payment.model';
import {PaymentService} from '../../../core/services/payment.service';
import {BalanceService} from '../../../core/services/balance.service';
import {ReportService} from '../../../core/services/report.service';
import {PaymentHistoryDetailComponent} from './payment-history-detail/payment-history-detail.component';
import {AuthService} from '../../../core/services/auth.service';
import {BalanceType} from '../../../core/models/report.model';

@Component({
  selector: 'app-shop-finance',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    NgSelectComponent,
    NgbPagination,
    SafeHtmlPipe,
    TranslatePipe,
    CountUpDirective,
    NgForOf,
    NgClass
  ],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss'
})
export class FinanceComponent implements OnInit {
  balance: number = 0;
  revenue: number = 0;
  profit: number = 0;
  platformFee: number = 0;
  paymentHistories: PaymentHistory[] = [];
  shopId: number = 0;

  financesFilter: BaseFilterRequest = {
    page: 1,
    size: 10
  };
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;

  constructor(
    private translateService: TranslateService,
    private reportService: ReportService,
    private paymentService: PaymentService,
    private balanceService: BalanceService,
    private authService: AuthService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.onSearch();
    this.authService.subscribeAuthenticationState().subscribe(authentication => {
      if (authentication) {
        this.shopId = authentication.shopId || 0;
      }
    });

    this.getBalance();
  }

  getBalance() {
    this.balanceService.getBalance(BalanceType.SHOP).subscribe(response => {
      this.balance = response || 0;
    });
  }

  onSearch() {
    this.financesFilter.page = 1;
    this.getFinanceData();
    this.getPaymentHistoriesWithPaging();
  }

  onChangedPage(event: any): void {
    this.financesFilter.page = event;
    this.getFinanceData();
    this.getPaymentHistoriesWithPaging();
  }

  getFinanceData() {
    this.reportService.getFinanceStatisticForShop(this.financesFilter).subscribe(response => {
      if (response) {
        this.revenue = response.revenue;
        this.profit = response.profit;
        this.platformFee = response.platformFee;
      }
    });
  }

  getPaymentHistoriesWithPaging() {
    this.paymentService.getPaymentHistoriesWithPaging(this.financesFilter).subscribe(response => {
      if (response && response.result) {
        this.paymentHistories = response.result;
        this.totalItems = response.total || response.result.length;
      }
    });
  }

  view(paymentHistoryId: number) {
    this.modalRef = this.modalService.open(PaymentHistoryDetailComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.paymentHistoryId = paymentHistoryId;
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
}
