import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import {RouterLink, RouterOutlet} from '@angular/router';
import { CategoryService } from '../../core/services/category.service';

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
export class ClientComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  cartCount = 0;
  categories: { id: number; name: string; description?: string; }[] = [];

  constructor(private cartService: CartService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    // lắng nghe tổng số item trong giỏ
    // this.sub = this.cartService.cartCount$.subscribe((count: number) => {
    //   this.cartCount = count;
    // });
    // load footer categories
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

  ngOnDestroy(): void {
    // this.sub?.unsubscribe();
  }
}
