import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { AuthService } from '../../../core/services/auth.service';
import {ORDER_STATUS} from '../../../constants/order.constants';
import {Order} from '../../../core/models/order.model';
import {OrderService} from '../../../core/services/order.service';
import {Authentication} from '../../../core/models/auth.model';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

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
  private modalRef?: NgbModalRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
        this.fetchOrders();
      }
    });
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
    this.modalRef = this.modalService.open(OrderDetailComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.orderId = orderId;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/client/home']).then();
  }

  protected readonly ORDER_STATUS = ORDER_STATUS;
}
