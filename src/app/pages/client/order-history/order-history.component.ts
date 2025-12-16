import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';

@Component({
  standalone: true,
  selector: 'app-order-history',
  imports: [CommonModule, RouterModule, VndCurrencyPipe],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;

  ngOnInit(): void {
    // mock data
    this.orders = [
      { id: 'ORD001', total: 235000, status: 'completed', items: [{ name: 'Sản phẩm A', price: 120000, qty: 1 }] },
      { id: 'ORD002', total: 120000, status: 'pending', items: [{ name: 'Sản phẩm B', price: 120000, qty: 1 }] }
    ];
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

