import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  private async fetchOrders(page = 0, size = 10) {
    this.loading = true;
    // Force a relative API path so the browser requests go to the dev server (localhost)
    // and will be forwarded by the proxy to the ngrok/backend. This prevents the browser
    // from calling the ngrok host directly (which can return an HTML interstitial page).
    // Make sure you run the dev server with the proxy: `npm run start` (uses proxy.conf.json).
    const apiEndpoint = '/api/v1/orders/by-user';

    // get current authenticated user from AuthService
    let auth: any;
    try {
      auth = await firstValueFrom(this.authService.subscribeAuthenticationState());
    } catch (e) {
      auth = null;
    }
    console.log('OrderHistory: auth from AuthService =', auth);
    const userId = auth?.id || auth?.userId || auth?.userID || null;

    // build URL with userId param; global interceptor will add Authorization header
    const url = `${apiEndpoint}?page=${page}&size=${size}${userId ? `&userId=${userId}` : ''}`;
    this.lastUrl = url;
    console.log('OrderHistory: GET', url);

    try {
      // Use relative URL (proxy) to get JSON directly. This avoids fetching ngrok host directly which may return HTML.
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

  openReview(order: any) {
    this.selectedOrder = order;
    // open modal via simple DOM toggle
    const el = document.getElementById('modal-review');
    if (el) el.style.display = 'block';
  }

  closeReview(){
    const el = document.getElementById('modal-review');
    if (el) el.style.display = 'none';
    this.selectedOrder = null;
  }

  submitReview(){
    // mock
    alert('Đã gửi đánh giá cho đơn ' + (this.selectedOrder?.id||''));
    this.closeReview();
  }
}
