import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {StateStorageService} from '../services/state-storage.service';

export const AuthGuardFn: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const stateService = inject(StateStorageService);

  stateService.savePreviousPage(state.url);

  if (authService.hasToken()) {
    return true;
  }

  router.navigate(['login']).then();
  return false;
}
