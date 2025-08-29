import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import dayjs from 'dayjs/esm';
import { UtilsService } from '../../utils/utils.service';
import {LIST_TIME_SELECT} from '../../../constants/common.constants';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {NgIf} from '@angular/common';
import {DateFormatDirective} from '../../directives/date-format.directive';
import {ICON_CALENDER} from '../../utils/icon';
import {SafeHtmlPipe} from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [
    NgSelectModule,
    FormsModule,
    NgbDatepickerModule,
    NgIf,
    DateFormatDirective,
    SafeHtmlPipe
  ],
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnChanges {
  @Input() periods: any;
  @Input() clearable: boolean = true;
  @Output() timeChange = new EventEmitter<any>();
  minDate: dayjs.Dayjs | any;
  fromDate: dayjs.Dayjs | any;
  toDate: dayjs.Dayjs | any;

  constructor(public utilsService: UtilsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['periods']) {
      this.periods = changes['periods'].currentValue;
    }
  }

  changeDate() {
    const time = {
      fromDate: this.fromDate,
      toDate: this.toDate ? dayjs(this.toDate).endOf('day') : null,
      periods: this.periods,
    };
    this.timeChange.emit(time);
  }

  changePeriods() {
    const time = this.getTime(this.periods);
    this.timeChange.emit(time);
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
          fromDate: dayjs().startOf('week').day(1), // Set day to 1 (Monday)
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 4: // THIS_MONTH
        return {
          fromDate: dayjs().startOf('month'),
          toDate: dayjs().endOf('day'),
          periods: periods,
        };
      case 5: // THIS_YEAR
        return {
          fromDate: dayjs().startOf('year'),
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

  protected readonly LIST_TIME_SELECT = LIST_TIME_SELECT;
  protected readonly ICON_CALENDER = ICON_CALENDER;
}
