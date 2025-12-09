import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationConfigService {
  // store endpoint prefix from env
  private endpointPrefix = environment.SERVER_API_URL;

  // Normalize and join endpoint safely to avoid missing or double slashes
  getEndpointFor(api: string): string {
    const prefix = (this.endpointPrefix || '').replace(/\/+$/, ''); // remove trailing slashes
    const path = (api || '').replace(/^\/+/, ''); // remove leading slashes
    if (!prefix) {
      return `/${path}`; // fallback to relative absolute path if no prefix configured
    }
    return `${prefix}/${path}`;
  }
}
