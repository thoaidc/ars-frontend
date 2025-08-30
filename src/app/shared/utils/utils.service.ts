import { Injectable } from '@angular/core';
import dayjs from 'dayjs/esm';
import { ToastrService } from 'ngx-toastr';
import {LOCAL_USER_AUTHORITIES_KEY} from '../../constants/local-storage.constants';
import {SIDEBAR_ROUTES} from '../../pages/admin/layouts/sidebar/sidebar.route';
import {SidebarNavItem} from '../../core/models/sidebar.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  constructor(private toast: ToastrService) {}

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
      let errorMessage = 'Mật khẩu không hợp lệ.';

      if (password.length < minLength) {
        errorMessage += ' Cần ít nhất 8 ký tự.';
      }

      if (!hasLowerCase) {
        errorMessage += ' Cần ít nhất một chữ cái thường.';
      }

      if (!hasUpperCase) {
        errorMessage += ' Cần ít nhất một chữ cái hoa.';
      }

      if (!hasDigit) {
        errorMessage += ' Cần ít nhất một số.';
      }

      if (!hasSpecialChar) {
        errorMessage += ' Cần ít nhất một ký tự đặc biệt.';
      }

      this.toast.error(errorMessage);
    }

    return isValidPassword;
  }

  findFirstAccessibleRoute(userPermissions?: string[]): string {
    if (!userPermissions) {
      userPermissions = this.getAccountPermissions();
    }

    for (const route of SIDEBAR_ROUTES) {
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

  getAccountPermissions() {
    const jsonString = localStorage.getItem(LOCAL_USER_AUTHORITIES_KEY) || '';

    try {
      return JSON.parse(jsonString) as string[];
    } catch (error) {
      return [];
    }
  }

  checkAccountPermission(permission: string) {
    const userRoles = this.getAccountPermissions();
    return userRoles.includes(permission);
  }
}
