import {Component, OnInit} from '@angular/core';
import {CountUpDirective} from "../../../shared/directives/count-up-number.directive";
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html.pipe";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {PaymentHistory} from '../../../core/models/payment.model';
import {BaseFilterRequest} from '../../../core/models/request.model';
import {ReportService} from '../../../core/services/report.service';
import {PaymentService} from '../../../core/services/payment.service';
import {BalanceService} from '../../../core/services/balance.service';
import {AuthService} from '../../../core/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {BalanceType} from '../../../core/models/report.model';
import {
  PaymentHistoryDetailComponent
} from '../../shop/finance/payment-history-detail/payment-history-detail.component';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {ICON_SEARCH} from '../../../shared/utils/icon';

@Component({
  selector: 'app-admin-finance',
  standalone: true,
  imports: [
    CountUpDirective,
    DecimalPipe,
    FormsModule,
    NgForOf,
    NgSelectComponent,
    NgbPagination,
    SafeHtmlPipe,
    TranslatePipe,
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
    this.authService.subscribeAuthenticationState().subscribe(authentication => {
      if (authentication) {
        this.shopId = authentication.shopId || 0;
        this.onSearch();
      }
    });
  }

  getBalance() {
    this.balanceService.getBalance(BalanceType.ADMIN).subscribe(response => {
      this.balance = response || 0;
    });
  }

  onSearch() {
    this.financesFilter.page = 1;
    this.getBalance();
    this.getFinanceData();
    this.getPaymentHistoriesWithPaging();
  }

  onChangedPage(event: any): void {
    this.financesFilter.page = event;
    this.getFinanceData();
    this.getPaymentHistoriesWithPaging();
  }

  getFinanceData() {
    this.reportService.getFinanceStatisticForShopAdmin(this.financesFilter).subscribe(response => {
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
