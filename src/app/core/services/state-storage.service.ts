import { Injectable } from '@angular/core';
import {LOCAL_PREVIOUS_PAGE_URL_KEY} from '../../constants/local-storage.constants';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private previousPageKey = LOCAL_PREVIOUS_PAGE_URL_KEY;

  savePreviousPage(url: string): void {
    localStorage.setItem(this.previousPageKey, url);
  }

  getPreviousPage(): string | null {
    return localStorage.getItem(this.previousPageKey) as string | null;
  }

  clearPreviousPage(): void {
    localStorage.removeItem(this.previousPageKey);
  }
}
