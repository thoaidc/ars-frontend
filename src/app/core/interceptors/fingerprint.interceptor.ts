import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import {FingerPrintService} from '../utils/fingerprint.service';
import {X_DEVICE_ID_HEADER} from '../../constants/common.constants';

export const FingerprintInterceptorFn: HttpInterceptorFn = (req, next) => {
  const fingerprintService = inject(FingerPrintService);

  return from(fingerprintService.getDeviceId()).pipe(
    switchMap(deviceId => {
      const authReq = req.clone({
        setHeaders: {
          [X_DEVICE_ID_HEADER]: deviceId,
        },
      });
      return next(authReq);
    })
  );
};
