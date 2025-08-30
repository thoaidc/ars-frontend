import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export function LoginGuardFn() {
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    authService.navigateToPreviousPage();
    return false;
  }

  return true;
}
