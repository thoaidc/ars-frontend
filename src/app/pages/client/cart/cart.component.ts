import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import {CartProduct} from '../../../core/models/cart.model';
import {map, Observable, take} from 'rxjs';
import {CartService} from '../../../core/services/cart.service';
import {ICON_DELETE} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OrderPreviewComponent} from '../checkout/order-preview/order-preview.component';
import {ToastrService} from 'ngx-toastr';

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
  private modalRef?: NgbModalRef;

  constructor(private cartService: CartService, private modalService: NgbModal, private toast: ToastrService) {}

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
    this.cartProducts$.pipe(take(1)).subscribe(allProducts => {
      const selectedItems = allProducts.filter(cartProduct => {
        return this.selectedProductIds.has(cartProduct.productId);
      });

      if (selectedItems.length > 0) {
        this.modalRef = this.modalService.open(OrderPreviewComponent, { size: 'xl', backdrop: 'static' });
        this.modalRef.componentInstance.products = selectedItems;
      } else {
        this.toast.warning('Vui lòng chọn tối thiểu một sản phẩm để tiếp tục');
      }
    });
  }

  protected readonly ICON_DELETE = ICON_DELETE;
}
