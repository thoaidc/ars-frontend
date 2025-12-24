import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import {RouterLink, RouterOutlet} from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import {Observable} from 'rxjs';
import {Cart} from '../../core/models/cart.model';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  currentYear = new Date().getFullYear();
  cartCount = 0;
  categories: { id: number; name: string; description?: string; }[] = [];
  cart$!: Observable<Cart | undefined>;

  constructor(private cartService: CartService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.getCart();
    this.loadCategories();
  }

  private loadCategories(): void {
    const filter = { page: 0, size: 20, keyword: '' } as any;
    this.categoryService.getAllWithPaging(filter).subscribe(res => {
      if (res && res.result) {
        this.categories = res.result;
      }
    }, err => {
      console.error('Error loading categories for footer', err);
    });
  }
}
