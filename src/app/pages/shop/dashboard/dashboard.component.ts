import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {ReportService} from '../../../core/services/report.service';
import {CountUpDirective} from '../../../shared/directives/count-up-number.directive';
import {ICON_FINANCE} from '../../../shared/utils/icon';
import {AuthService} from '../../../core/services/auth.service';
import {StatisticType} from '../../../core/models/report.model';
import {OrderService} from '../../../core/services/order.service';
import {delay} from 'rxjs';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CountUpDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild('revenueCanvas') revenueCanvas!: ElementRef;
  @ViewChild('salesCanvas') salesCanvas!: ElementRef;
  labels7Days: any;
  revenueLast7DayData: number[] = [];
  salesLast7DayData: number[] = [];
  revenueToday: number = 0;
  ordersToday: number = 0;
  shopId: number = 0;

  constructor(private reportService: ReportService, private authService: AuthService, private orderService: OrderService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.labels7Days = this.getRecentDates();
    this.authService.subscribeAuthenticationState()
      .pipe(delay(1000))
      .subscribe(authentication => {
      if (authentication) {
        this.shopId = authentication.shopId || 0;
        this.getRevenueDashboardReport();
        this.getSalesDashboardReport();
        this.getTotalOrdersToDay();
        this.getRevenueToday();
      }
    });
  }

  getRevenueToday() {
    this.reportService.getRevenueToday(StatisticType.REVENUE, this.shopId).subscribe(response => this.revenueToday = response);
  }

  getTotalOrdersToDay() {
    this.orderService.getOrderTodayForShop().subscribe(response => {
      this.ordersToday = response;
    });
  }

  getRevenueDashboardReport() {
    this.reportService.getRevenueDashboardReport(StatisticType.REVENUE, this.shopId).subscribe(response => {
      if (response && response.result) {
        this.revenueLast7DayData = response.result.map(item => item.amount);
        this.createRevenueChart();
      }
    });
  }

  getSalesDashboardReport() {
    this.reportService.getSalesDashboardReportForShop().subscribe(response => {
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
}
