import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-order-history',
  imports: [CommonModule, RouterModule, HttpClientModule, VndCurrencyPipe],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  loading = false;
  lastUrl: string | null = null;
  lastResponse: any = null;
  lastError: any = null;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  private async fetchOrders(page = 0, size = 10) {
    this.loading = true;
    const apiEndpoint = '/api/v1/orders/by-user';
    let auth: any;
    try {
      auth = await firstValueFrom(this.authService.subscribeAuthenticationState());
    } catch (e) {
      auth = null;
    }
    const userId = auth?.id || auth?.userId || auth?.userID || null;
    const url = `${apiEndpoint}?page=${page}&size=${size}${userId ? `&userId=${userId}` : ''}`;
    this.lastUrl = url;

    try {
      const relativeUrl = apiEndpoint + `?page=${page}&size=${size}${userId ? `&userId=${userId}` : ''}`;
      this.lastUrl = relativeUrl;
      console.log('OrderHistory: GET via relative URL', relativeUrl);

      // If running locally, ensure we forward the Authorization header (read from localStorage)
      const token = localStorage.getItem('ars_token_k') || localStorage.getItem('auth_token') || null;
      const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
      const res: any = await firstValueFrom(this.http.get<any>(relativeUrl, headers ? { headers } : {}));
      this.lastResponse = res;
      const results = Array.isArray(res) ? res : (res && Array.isArray(res.result) ? res.result : null);
      if (results && results.length > 0) {
        this.orders = results.map((o: any) => ({
          id: o.id,
          code: o.code,
          status: o.status,
          paymentStatus: o.paymentStatus,
          totalAmount: o.totalAmount || o.amount || 0,
          orderDate: o.orderDate
        }));
      } else {
        this.orders = [];
      }
    } catch (err) {
      console.error('Failed to load orders (proxy attempt)', err);
      this.lastError = err;
      this.orders = [];
    } finally {
      this.loading = false;
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/client/home']).then();
  }
}
