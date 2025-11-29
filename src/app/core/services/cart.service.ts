import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  name: string;
  price: number;          // VND
  quantity: number;
  thumbnailUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // danh sách item trong giỏ
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  // tổng số lượng item (count) – dùng cho header
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  /** Lấy snapshot hiện tại */
  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  /** Thêm sản phẩm vào giỏ */
  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    const items = [...this.itemsSubject.value];
    const existingIndex = items.findIndex(i => i.productId === item.productId);

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + quantity,
      };
    } else {
      items.push({
        ...item,
        quantity,
      });
    }

    this.updateCart(items);
  }

  /** Cập nhật số lượng một item */
  updateQuantity(productId: number, quantity: number): void {
    const items = this.itemsSubject.value.map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    this.updateCart(items);
  }

  /** Xoá 1 item */
  removeItem(productId: number): void {
    const items = this.itemsSubject.value.filter(i => i.productId !== productId);
    this.updateCart(items);
  }

  /** Xoá toàn bộ */
  clear(): void {
    this.updateCart([]);
  }

  /** Tổng tiền VND */
  getTotal(): number {
    return this.itemsSubject.value.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
  }

  /** Cập nhật subject + count mỗi khi giỏ thay đổi */
  private updateCart(items: CartItem[]): void {
    this.itemsSubject.next(items);

    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
    this.cartCountSubject.next(totalCount);
  }
}
