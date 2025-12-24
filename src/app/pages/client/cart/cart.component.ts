import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import {CartProduct} from '../../../core/models/cart.model';
import {map, Observable, window} from 'rxjs';
import {CartService} from '../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, FormsModule, VndCurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit {
  total = 0;
  cartProducts$!: Observable<CartProduct[]>;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartProducts$ = this.cartService.getCart().pipe(map(cart => cart?.products ?? []));
    this.updateTotals();
  }

  updateTotals(){
    this.cartProducts$.subscribe(value => {
      this.total = value.reduce((total, p) => {
        return total + Number(p.price);
      }, 0);
    });
  }

  removeItem(cartProduct: CartProduct){
    this.cartService.removeFromCart(cartProduct.productId);
    this.updateTotals();
  }

  proceedToCheckout() {

  }

  ngAfterViewInit(): void {
    try { setTimeout(()=>{ (window as any).initCozaPlugins && (window as any).initCozaPlugins(); }, 50); } catch(e){}
  }
}
