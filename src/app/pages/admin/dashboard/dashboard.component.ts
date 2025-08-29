import {Component, OnInit} from '@angular/core';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {DateFilterComponent} from '../../../shared/components/date-filter/date-filter.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import dayjs from 'dayjs/esm';
import {ToastrService} from 'ngx-toastr';
import {UtilsService} from '../../../shared/utils/utils.service';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import {Dayjs} from 'dayjs';
import {HasAuthorityDirective} from '../../../shared/directives/has-authority.directive';
import {Authorities} from '../../../constants/authorities.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SafeHtmlPipe,
    DateFilterComponent,
    NgSelectModule,
    FormsModule,
    HasAuthorityDirective
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

  constructor(
    protected utilService: UtilsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    Chart.register(
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
      Title
    );
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

  rewriteChart(label: string[], totalLogSuccess: number[], totalLogError: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: 'Hợp lệ',
            data: totalLogSuccess,
            backgroundColor: '#a22600',
            borderColor: '#a22600',
            borderWidth: 1,
            maxBarThickness: 70
          },
          {
            label: 'Không hợp lệ',
            data: totalLogError,
            backgroundColor: '#003d60',
            borderColor: '#003d60',
            borderWidth: 1,
            maxBarThickness: 70
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              autoSkip: true
            }
          },
          x: {
            ticks: {
              autoSkip: false
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: false
          }
        }
      }
    });
  }

  getRotationAngle(data: any[], threshold: number = 20) {
    if (data.length >= threshold) {
      return 45;
    }

    return 0;
  }

  protected readonly Authorities = Authorities;
}
