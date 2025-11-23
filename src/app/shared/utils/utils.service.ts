import { Injectable } from '@angular/core';
import dayjs from 'dayjs/esm';
import { ToastrService } from 'ngx-toastr';
import {LOCAL_USER_AUTHORITIES_KEY} from '../../constants/local-storage.constants';
import {SidebarNavItem} from '../../core/models/sidebar.model';
import {ADMIN_SIDEBAR_ROUTES} from '../../constants/sidebar.constants';
import {TranslateService} from '@ngx-translate/core';
import {BaseFilterRequest} from '../../core/models/request.model';
import {DATETIME_FORMAT} from '../../constants/common.constants';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  constructor(private toast: ToastrService, private translateService: TranslateService) {}

  convertToDateString(dateString: string, toFormat: string): string {
    const dateFormats = ['MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'];
    const timeFormat = 'HH:mm:ss';
    let date;

    // Check if dateString matches time format
    if (dayjs(dateString, timeFormat, true).isValid()) {
      date = dayjs(dateString, timeFormat, true);
    } else {
      // Check if dateString matches date formats
      date = dayjs(dateString, dateFormats, true);
    }

    return date.isValid() ? date.format(toFormat) : '';
  }

  getFromToMoment(date?: dayjs.Dayjs, isMaxDate?: boolean): any {
    if (date && Object.keys(date).length !== 0) {
      const date1 = dayjs(date);

      return {
        year: date1.year(),
        month: date1.month() + 1,
        day: date1.date(),
      };
    }

    const _date = isMaxDate ? null : dayjs();
    return _date ? { year: _date.year(), month: _date.month() + 1, day: _date.date() } : null;
  }

  getCurrentDate() {
    const _date = dayjs();
    return { year: _date.year(), month: _date.month() + 1, day: _date.date() };
  }

  validatePassword(password: string): boolean {
    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const isValidPassword = password.length >= minLength && hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar;

    if (!isValidPassword) {
      let errorMessage = this.translateService.instant('notification.invalidPassword');

      if (password.length < minLength) {
        errorMessage += this.translateService.instant('notification.minCharacter');
      }

      if (!hasLowerCase) {
        errorMessage += this.translateService.instant('notification.requiredLowerCase');
      }

      if (!hasUpperCase) {
        errorMessage += this.translateService.instant('notification.requiredUpperCase');
      }

      if (!hasDigit) {
        errorMessage += this.translateService.instant('notification.requiredNumber');
      }

      if (!hasSpecialChar) {
        errorMessage += this.translateService.instant('notification.requiredSpecialCharacter');
      }

      this.toast.error(errorMessage);
    }

    return isValidPassword;
  }

  buildFilterRequest<T extends BaseFilterRequest>(filter: T): T {
    const req: T = { ...filter };

    req.page = (filter.page ?? 1) - 1;
    req.size = filter.size ?? 20;

    if (!filter.keyword) {
      delete req.keyword;
    }

    if (!filter.status) {
      delete req.status;
    }

    if (filter.fromDate) {
      req.fromDate = this.convertToDateString(filter.fromDate.toString(), DATETIME_FORMAT);
    } else {
      delete req.fromDate;
    }

    if (filter.toDate) {
      req.toDate = this.convertToDateString(filter.toDate.toString(), DATETIME_FORMAT);
    } else {
      delete req.toDate;
    }

    return req;
  }

  findFirstAccessibleRoute(userPermissions?: string[]): string {
    if (!userPermissions) {
      userPermissions = this.getUserPermissions();
    }

    for (const route of ADMIN_SIDEBAR_ROUTES) {
      const accessiblePath = this.findAccessiblePath(route, userPermissions);

      if (accessiblePath || accessiblePath === '') {
        return accessiblePath;
      }
    }

    return '';
  }

  private findAccessiblePath(route: SidebarNavItem, userPermissions: string[]): string | null {
    // Check if the route has permissions and the user has at least one valid permission
    if (route.permission) {
      const hasAccess = Array.isArray(route.permission)
        ? route.permission.some(permission => userPermissions.includes(permission))
        : userPermissions.includes(route.permission);

      if (hasAccess) {
        if (route.submenu && route.submenu.length > 0) {
          const firstAccessibleSubPath = this.findAccessiblePath(route.submenu[0], userPermissions);
          return firstAccessibleSubPath ? route.path + firstAccessibleSubPath : route.path;
        }

        return route.path;
      }
    }

    // Check in submenu
    if (route.submenu && route.submenu.length > 0) {
      for (const subRoute of route.submenu) {
        const accessiblePath = this.findAccessiblePath(subRoute, userPermissions);

        if (accessiblePath) {
          return route.path + accessiblePath;
        }
      }
    }

    return null;
  }

  getUserPermissions() {
    const jsonString = localStorage.getItem(LOCAL_USER_AUTHORITIES_KEY) || '';

    try {
      return JSON.parse(jsonString) as string[];
    } catch (error) {
      return [];
    }
  }

  checkUserPermission(permission: string) {
    const userRoles = this.getUserPermissions();
    return userRoles.includes(permission);
  }

  translateList(list: Array<{id: number, name: string}>): Array<{id: number, name: string}> {
    return list.map(item => ({
      ...item,
      name: this.translateService.instant(item.name)
    }));
  }
}
