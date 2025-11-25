import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingOption {
  isLoading = false;
  isLoadPage = false;
}
