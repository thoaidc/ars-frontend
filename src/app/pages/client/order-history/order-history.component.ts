import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { AuthService } from '../../../core/services/auth.service';
import {ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS} from '../../../constants/order.constants';
import {Order, OrderDetail} from '../../../core/models/order.model';
import {OrderService} from '../../../core/services/order.service';
import {Authentication} from '../../../core/models/auth.model';

@Component({
  standalone: true,
  selector: 'app-order-history',
  imports: [CommonModule, VndCurrencyPipe, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  authentication!: Authentication;
  selectedOrder?: OrderDetail;
  showDetailModal: boolean = false;

  constructor(private authService: AuthService, private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
        this.fetchOrders();
      }
    })
  }

  private fetchOrders() {
    this.loading = true;
    const searchRequest = {
      page: 0,
      size: 100
    };
    this.orderService.getAllWithPaging(searchRequest).subscribe(response => {
      this.orders = response.result || [];
      this.loading = false;
    });
  }

  viewOrderDetail(orderId: number) {
    this.loading = true;
    this.orderService.getByIdForUser(orderId).subscribe({
      next: (data) => {
        this.selectedOrder = data;
        this.showDetailModal = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi tải chi tiết đơn hàng', err);
        this.loading = false;
      }
    });
  }

  closeModal() {
    this.showDetailModal = false;
    this.selectedOrder = undefined;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/client/home']).then();
  }

  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
  protected readonly PAYMENT_STATUS = PAYMENT_STATUS;
}
