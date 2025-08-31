import {Component, OnInit} from '@angular/core';
import {DateFilterComponent} from '../../shared/components/date-filter/date-filter.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import dayjs from 'dayjs/esm';
import {ToastrService} from 'ngx-toastr';
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
import {Authorities} from '../../constants/authorities.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DateFilterComponent,
    NgSelectModule,
    FormsModule
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

  constructor(private toastr: ToastrService) {}

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

  protected readonly Authorities = Authorities;
}
