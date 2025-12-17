import { Injectable } from '@angular/core';
import { X_DEVICE_ID_KEY } from '../../constants/common.constants';
import CryptoUtils from './crypto.utils';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({ providedIn: 'root' })
export class FingerPrintService {
  private visitorId?: string;

  async getDeviceId(): Promise<string> {
    if (this.visitorId) {
      return this.visitorId;
    }

    const stored = localStorage.getItem(X_DEVICE_ID_KEY);

    if (stored) {
      this.visitorId = stored;
      return this.visitorId;
    }

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.visitorId = CryptoUtils.encrypt(result.visitorId);
    localStorage.setItem(X_DEVICE_ID_KEY, this.visitorId);
    return this.visitorId;
  }
}
