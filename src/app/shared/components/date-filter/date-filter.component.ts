import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import dayjs from 'dayjs/esm';
import { UtilsService } from '../../utils/utils.service';
import {DATETIME_FORMAT, LIST_TIME_SELECT} from '../../../constants/common.constants';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {NgIf} from '@angular/common';
import {DateFormatDirective} from '../../directives/date-format.directive';
import {ICON_CALENDER} from '../../utils/icon';
import {SafeHtmlPipe} from '../../pipes/safe-html.pipe';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    NgbDatepickerModule,
    NgIf,
    DateFormatDirective,
    SafeHtmlPipe,
    TranslatePipe
  ],
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnChanges, OnInit {
  @Input() periods: any;
  @Input() clearable: boolean = true;
  @Output() timeChange = new EventEmitter<any>();
  minDate: dayjs.Dayjs | any;
  fromDate: dayjs.Dayjs | any;
  toDate: dayjs.Dayjs | any;
  listTimeSelect: any = LIST_TIME_SELECT;

  constructor(public utilsService: UtilsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['periods']) {
      this.periods = changes['periods'].currentValue;
    }

    this.listTimeSelect = this.utilsService.translateList(this.listTimeSelect);
  }

  ngOnInit() {
    this.listTimeSelect = this.utilsService.translateList(this.listTimeSelect);
  }

  changeDate() {
    const time = {
      fromDate: this.fromDate ? this.getFromDateStr(this.fromDate) : null,
      toDate: this.toDate ? this.getToDateStr(this.toDate) : null,
      periods: this.periods
    };

    this.timeChange.emit(time);
  }

  getFromDateStr(datetime: any) {
    if (datetime) {
      return this.utilsService.convertToDateString(dayjs(datetime).startOf('day').toString(), DATETIME_FORMAT);
    }

    return null;
  }

  getToDateStr(datetime: any) {
    if (datetime) {
      return this.utilsService.convertToDateString(dayjs(datetime).endOf('day').toString(), DATETIME_FORMAT);
    }

    return null;
  }

  changePeriods() {
    const time = this.getTime(this.periods);
    const timeStr = {
      fromDate: time.fromDate ? this.utilsService.convertToDateString(time.fromDate.toString(), DATETIME_FORMAT) : null,
      toDate: time.toDate ? this.utilsService.convertToDateString(time.toDate.toString(), DATETIME_FORMAT) : null,
      periods: time.periods
    }

    this.timeChange.emit(timeStr);
  }

  getTime(periods: any) {
    switch (periods) {
      case 1: // TODAY
        return {
          fromDate: dayjs().startOf('day'),
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 2: // LAST_DAY
        return {
          fromDate: dayjs().subtract(1, 'day').startOf('day'),
          toDate: dayjs().subtract(1, 'day').endOf('day'),
          periods: periods,
        };
      case 3: // THIS_WEEK
        return {
          fromDate: dayjs().startOf('week').day(1).startOf('day'), // Set day to 1 (Monday)
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 4: // THIS_MONTH
        return {
          fromDate: dayjs().startOf('month').startOf('day'),
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 5: // THIS_YEAR
        return {
          fromDate: dayjs().startOf('year').startOf('day'),
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 6: // LAST_7_DAYS
        return {
          fromDate: dayjs().subtract(7, 'day').startOf('day'),
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 7: // LAST_30_DAYS
        return {
          fromDate: dayjs().subtract(30, 'day').startOf('day'),
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 8: // OTHER
        this.fromDate = null;
        this.toDate = null;

        return {
          fromDate: null,
          toDate: null,
          periods: periods,
        };
      default:
        return {
          fromDate: dayjs().startOf('day'),
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
    }
  }

  protected readonly ICON_CALENDER = ICON_CALENDER;
}
