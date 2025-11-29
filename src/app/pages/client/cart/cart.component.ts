import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  imageUrl: string;
}

interface SimpleProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Nurse Life Pretty Doll Nurse Personalized Shirt',
      variant: 'Size: S, Kids, Classic 3D T-shirt',
      price: 21.95,
      qty: 2,
      imageUrl: 'assets/images/cart/cart-main.png',
    },
  ];

  youMayAlsoLike: SimpleProduct[] = [
    {
      id: 2,
      name: 'Whiskey Advent Calendar Blanket',
      price: 25.95,
      imageUrl: 'assets/images/cart/like-1.png',
    },
    {
      id: 3,
      name: 'Womens Vintage Celtic Knot Coat',
      price: 43.99,
      imageUrl: 'assets/images/cart/like-2.png',
    },
    {
      id: 4,
      name: 'Personalized Name Delivery Sweatshirt',
      price: 27.95,
      imageUrl: 'assets/images/cart/like-3.png',
    },
    {
      id: 5,
      name: 'Christmas Dr Pepper Can Ornament',
      price: 28.95,
      imageUrl: 'assets/images/cart/like-4.png',
    },
  ];

  recentlyViewed: SimpleProduct[] = [
    {
      id: 6,
      name: 'Nurse Life Pretty Doll Nurse Personalized Shirt',
      price: 21.95,
      imageUrl: 'assets/images/cart/recent-1.png',
    },
    {
      id: 7,
      name: 'When You Enter This Office Poster',
      price: 18.95,
      imageUrl: 'assets/images/cart/recent-2.png',
    },
  ];

  shippingFee = 8.99; // tạm mock, sau này lấy từ API

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  get total(): number {
    return this.subtotal + this.shippingFee;
  }

  // ví dụ logic bonus point giống banner vàng trên
  get amountToNextBonus(): number {
    const target = 50; // ví dụ mua 50$ được bonus
    return Math.max(0, target - this.subtotal);
  }

  increaseQty(item: CartItem) {
    item.qty++;
  }

  decreaseQty(item: CartItem) {
    if (item.qty > 1) {
      item.qty--;
    }
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
  }

  trackById(_: number, item: { id: number }) {
    return item.id;
  }
}
