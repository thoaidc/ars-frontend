import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CheckoutItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  imageUrl: string;
}

interface RecentlyViewed {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  // mock đơn hàng (giống cart)
  items: CheckoutItem[] = [
    {
      id: 1,
      name: 'Nurse Life Pretty Doll Nurse Personalized Shirt',
      variant: 'Size: S, Kids, Classic 3D T-shirt',
      price: 21.95,
      qty: 2,
      imageUrl: 'assets/images/cart/cart-main.png',
    },
  ];

  shippingFee = 8.99;
  tips = 0;

  recentlyViewed: RecentlyViewed[] = [
    {
      id: 1,
      name: 'Nurse Life Pretty Doll Nurse Personalized Shirt',
      price: 21.95,
      imageUrl: 'assets/images/cart/recent-1.png',
    },
    {
      id: 2,
      name: 'When You Enter This Office Poster',
      price: 18.95,
      imageUrl: 'assets/images/cart/recent-2.png',
    },
  ];

  faqs: FaqItem[] = [
    {
      question: 'How secure is my personal and payment information?',
      answer:
        'All payments are processed using encrypted connections and PCI-compliant providers.',
      open: true,
    },
    {
      question: 'Can I cancel, refund or exchange my order?',
      answer:
        'Yes, you can submit a support ticket within 24 hours after placing the order.',
      open: false,
    },
    {
      question: 'Where do orders ship from, and how long does shipping take?',
      answer:
        'Orders are fulfilled from our nearest facility and typically arrive within 6–11 business days.',
      open: false,
    },
  ];

  get subtotal(): number {
    return this.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  }

  get total(): number {
    return this.subtotal + this.shippingFee + this.tips;
  }

  setTip(amount: number) {
    this.tips = amount;
  }

  toggleFaq(item: FaqItem) {
    item.open = !item.open;
  }

  trackById(_: number, item: { id: number }) {
    return item.id;
  }

// dùng cho FAQ (không có id)
  trackByIndex(index: number, _item: any) {
    return index;
  }

}
