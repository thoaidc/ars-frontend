import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import {CartProduct} from '../../../core/models/cart.model';
import {map, Observable} from 'rxjs';
import {CartService} from '../../../core/services/cart.service';
import {ICON_DELETE} from "../../../shared/utils/icon";
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, FormsModule, VndCurrencyPipe, SafeHtmlPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  total = 0;
  cartProducts$!: Observable<CartProduct[]>;

  constructor(private cartService: CartService, private router: Router) {}

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
    this.router.navigate(['/client/checkout']).then();
  }

  protected readonly ICON_DELETE = ICON_DELETE;
}
