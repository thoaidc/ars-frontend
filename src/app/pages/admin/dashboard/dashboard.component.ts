import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DateFilterComponent} from '../../../shared/components/date-filter/date-filter.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import dayjs from 'dayjs/esm';
import {ToastrService} from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';
import {Dayjs} from 'dayjs';
import {Authorities} from '../../../constants/authorities.constants';
import {CountUpDirective} from "../../../shared/directives/count-up-number.directive";
import {ReportService} from '../../../core/services/report.service';
import {ICON_FINANCE} from '../../../shared/utils/icon';
import {OrderService} from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
    imports: [
      DateFilterComponent,
      NgSelectModule,
      FormsModule,
      CountUpDirective
    ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public chart: any;
  periods: any = 1;
  groupByType: string = 'DAY';

  listType: { value: string, name: string, disabled: boolean }[] = [
    {
      value: 'MONTH',
      name: 'Theo tháng',
      disabled: false
    },
    {
      value: 'DAY',
      name: 'Theo ngày',
      disabled: false
    },
    {
      value: 'HOURS',
      name: 'Theo giờ',
      disabled: false
    },
  ];

  fromDate: Dayjs = dayjs().startOf('day');
  toDate: Dayjs = dayjs().endOf('day');
  @ViewChild('revenueCanvas') revenueCanvas!: ElementRef;
  @ViewChild('salesCanvas') salesCanvas!: ElementRef;
  labels7Days: any;
  revenueLast7DayData: number[] = [];
  salesLast7DayData: number[] = [];
  revenueToday: number = 0;
  ordersToday: number = 0;

  constructor(private reportService: ReportService, private toastr: ToastrService, private orderService: OrderService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.labels7Days = this.getRecentDates();
    this.getRevenueToday();
    this.getTotalOrdersToDay();
    this.getSalesDashboardReport();
    this.getRevenueDashboardReport();
  }

  onTimeChange(even: any) {
    this.fromDate = even.fromDate;
    this.toDate = even.toDate;
    this.periods = even.periods;
    this.onChangeValue();
  }

  onChangeValue() {
    if (!this.fromDate) {
      this.toastr.error('Thời gian tìm kiếm không được để trống', 'Thông báo');
      return;
    }

    if (!this.toDate) {
      if (this.periods === 8) {
        this.toDate = dayjs(dayjs(), 'DD/MM/YYYY');
      } else {
        this.toastr.error('Thời gian tìm kiếm không được để trống', 'Thông báo');
        return;
      }
    }

    if (this.toDate.diff(this.fromDate, 'day') > 31) {
      if (this.groupByType != 'HOURS') {
        this.groupByType = 'MONTH';
        this.disabledType(true);
      }
    } else {
      this.disabledType(false);
    }
  }

  disabledType(isDisabledMonth: boolean) {
    this.listType.forEach(type => {
      if (type.value === 'DAY') {
        type.disabled = isDisabledMonth;
      }
    });

    this.listType = JSON.parse(JSON.stringify(this.listType));
  }

  getRevenueToday() {
    this.reportService.getRevenueTodayForAdmin().subscribe(response => this.revenueToday = response);
  }

  getTotalOrdersToDay() {
    this.orderService.getOrderTodayForAdmin().subscribe(response => {
      this.ordersToday = response;
    });
  }

  getRevenueDashboardReport() {
    this.reportService.getRevenueDashboardReportAdmin().subscribe(response => {
      if (response && response.result) {
        this.revenueLast7DayData = response.result.map(item => item.amount);
        this.createRevenueChart();
      }
    });
  }

  getSalesDashboardReport() {
    this.reportService.getSalesDashboardReportAdmin().subscribe(response => {
      if (response && response.result) {
        this.salesLast7DayData = response.result.map(item => item.amount);
        this.createSalesChart();
      }
    });
  }

  createSalesChart() {
    const ctx = this.salesCanvas.nativeElement.getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels7Days,
          datasets: [{
            data: this.revenueLast7DayData,
            borderColor: '#00bcd4',
            backgroundColor: 'rgba(0, 188, 212, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#00bcd4'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {display: false}
          },
          scales: {
            y: {beginAtZero: true}
          }
        }
      });
    }
  }

  createRevenueChart() {
    const ctx = this.revenueCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels7Days,
          datasets: [{
            data: this.revenueLast7DayData,
            backgroundColor: '#4e73df',
            hoverBackgroundColor: '#2e59d9',
            borderColor: '#4e73df',
            borderWidth: 1,
            borderRadius: 5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {display: false}
          },
          scales: {
            x: {
              grid: {display: false}
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value
              }
            }
          }
        }
      });
    }
  }

  getRecentDates(): string[] {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const formattedDate = `${d.getDate()}/${d.getMonth() + 1}`;
      dates.push(formattedDate);
    }
    return dates;
  }

  protected readonly ICON_FINANCE = ICON_FINANCE;
  protected readonly Authorities = Authorities;
}
