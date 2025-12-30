import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import {CartProduct} from '../../../core/models/cart.model';
import {map, Observable, take} from 'rxjs';
import {CartService} from '../../../core/services/cart.service';
import {ICON_DELETE} from '../../../shared/utils/icon';
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
  selectedProductIds = new Set<number>();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartProducts$ = this.cartService.getCart().pipe(map(cart => cart?.products ?? []));
    this.updateTotal();
  }

  isSelected(cartProduct: CartProduct): boolean {
    return this.selectedProductIds.has(cartProduct.productId);
  }

  onItemSelect(cartProduct: CartProduct) {
    if (this.selectedProductIds.has(cartProduct.productId)) {
      this.selectedProductIds.delete(cartProduct.productId);
    } else {
      this.selectedProductIds.add(cartProduct.productId);
    }

    this.updateTotal();
  }

  toggleAll(isChecked: boolean) {
    this.cartProducts$.pipe(take(1)).subscribe(products => {
      if (isChecked) {
        products.forEach(cartProduct => {
          this.selectedProductIds.add(cartProduct.productId);
        });
      } else {
        this.selectedProductIds.clear();
      }
      this.updateTotal();
    });
  }

  updateTotal() {
    this.cartProducts$.subscribe(value => {
      this.total = value
        .filter(cartProduct => {
          return this.selectedProductIds.has(cartProduct.productId);
        })
        .reduce((total, cartProduct) => {
          return total + Number(cartProduct.price);
        }, 0);
    });
  }

  removeItem(cartProduct: CartProduct){
    this.cartService.removeFromCart(cartProduct.productId);
    this.updateTotal();
  }

  proceedToCheckout() {

  }

  protected readonly ICON_DELETE = ICON_DELETE;
}
