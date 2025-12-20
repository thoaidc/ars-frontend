import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, FormsModule, VndCurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  total = 0;

  // mapping tên sản phẩm sang tiếng Việt
  private nameMap: { [key: string]: string } = {
    'Fresh Strawberries': 'Mẫu Thiết Kế - Dâu Tươi',
    'Lightweight Jacket': 'Mẫu Thiết Kế - Áo Khoác Nhẹ'
  };

  ngOnInit(): void {
    // mock cart items (replace with service later)
    this.cartItems = [
      { id: 'p1', name: 'Fresh Strawberries', image: '/assets/coza/images/item-cart-04.jpg', price: 36.0, qty: 1 },
      { id: 'p2', name: 'Lightweight Jacket', image: '/assets/coza/images/item-cart-05.jpg', price: 16.0, qty: 1 }
    ];
    this.updateTotals();
  }

  // helper trả về tên hiển thị (nếu có mapping -> tên tiếng Việt, không thì giữ nguyên)
  getDisplayName(orig: string): string {
    return this.nameMap[orig] || orig;
  }

  increment(i: number){
    this.cartItems[i].qty = this.cartItems[i].qty + 1;
    this.updateTotals();
  }

  decrement(i: number){
    if (this.cartItems[i].qty > 1) {
      this.cartItems[i].qty = this.cartItems[i].qty - 1;
      this.updateTotals();
    }
  }

  updateTotals(){
    this.subtotal = this.cartItems.reduce((s, it) => s + it.price * it.qty, 0);
    // placeholder: shipping 0, tax 0
    this.total = this.subtotal;
  }

  removeItem(i: number){
    this.cartItems.splice(i, 1);
    this.updateTotals();
  }

  proceedToCheckout(){
    // navigates to checkout route when implemented
    window.location.href = '/client/checkout';
  }

  ngAfterViewInit(): void {
    try { setTimeout(()=>{ (window as any).initCozaPlugins && (window as any).initCozaPlugins(); }, 50); } catch(e){}
  }
}
