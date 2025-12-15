import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number; // price in USD-like base (will be converted by pipe)
  qty: number;
}

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, VndCurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: []
})
export class CheckoutComponent implements OnInit {
  billingForm!: FormGroup;

  shippingSame = true;

  paymentMethod: 'card' | 'cod' = 'cod';
  cardForm!: FormGroup;

  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  total = 0;
  orderId: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.billingForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postcode: ['']
    });

    this.cardForm = this.fb.group({
      cardName: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: ['']
    });
  }

  ngOnInit(): void {
    // mock cart - replace with CartService
    this.cartItems = [
      { id: 'p1', name: 'Fresh Strawberries', image: '/assets/coza/images/item-cart-04.jpg', price: 36.0, qty: 1 },
      { id: 'p2', name: 'Lightweight Jacket', image: '/assets/coza/images/item-cart-05.jpg', price: 16.0, qty: 1 }
    ];
    this.recalc();
    // generate a simple order id for display
    this.orderId = 'ORD' + Date.now().toString().slice(-6);
  }

  recalc(){
    this.subtotal = this.cartItems.reduce((s, it) => s + it.price * it.qty, 0);
    this.shipping = 0; // could be calculated
    this.total = this.subtotal + this.shipping;
  }

  onShippingSameChange(e: Event){
    const target = e.target as HTMLInputElement | null;
    this.shippingSame = !!(target && target.checked);
  }

  placeOrder(){
    if (this.billingForm.invalid) {
      this.billingForm.markAllAsTouched();
      return;
    }

    // handle payment action here (call backend...) - currently mock
    // navigate to home or order-success page
    window.alert('Order placed successfully!');
    this.router.navigate(['/client/home']);
  }

  confirmPayment(): void {
    // in real app we'd verify payment with backend; here just navigate to success or home
    window.alert('Payment confirmed (demo)');
    this.router.navigate(['/client/home']);
  }
}
