import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet,RouterLinkActive, RouterLink],
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
    this.sub = this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
