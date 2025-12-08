import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import {RouterLink, RouterOutlet} from '@angular/router';
import { VndCurrencyPipe } from '../../shared/pipes/vnd-currency.pipe';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    VndCurrencyPipe
  ],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  cartCount = 0;

  private sub?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // lắng nghe tổng số item trong giỏ
    // this.sub = this.cartService.cartCount$.subscribe((count: number) => {
    //   this.cartCount = count;
    // });
  }

  ngOnDestroy(): void {
    // this.sub?.unsubscribe();
  }
}
