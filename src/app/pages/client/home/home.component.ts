import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { BaseFilterRequest } from '../../../core/models/request.model';
import {CategoryDTO, Product, ProductsFilter} from '../../../core/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = false;
  trendyProducts: Product[] = [];
  categories: CategoryDTO[] = [];
  categoryFilter: BaseFilterRequest = {
    page: 0,
    size: 5
  };

  productFilter: ProductsFilter = {
    page: 0,
    size: 12
  }

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  private loadCategories() {
    this.categoryService.getAllWithPaging(this.categoryFilter).subscribe(response => {
      if (response && response.result) {
        this.categories = response.result;
      }
    })
  }

  updateFilter(categoryId?: number) {
    if (categoryId) {
      this.productFilter.categoryId = categoryId;
    } else {
      this.productFilter.categoryId = undefined;
    }

    this.productFilter.page = 0;
    this.trendyProducts = [];
    this.loadProducts();
  }

  loadProducts(loadMore?: boolean): void {
    this.loading = true;

    if (loadMore) {
      this.productFilter.page = this.productFilter.page + 1;
    }

    this.productService.getAllWithPaging(this.productFilter).subscribe(response => {
      if (response && response.result) {
        this.trendyProducts.push(...response.result);
      } else {
        this.toast.error('Đã tải hết sản phẩm');
      }

      this.loading = false;
    });
  }

  getDisplayPrice(price: number | string | null | undefined): string {
    if (price == null) return '';

    let value = typeof price === 'string' ? Number(price) : price;
    if (Number.isNaN(value)) return '';

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  }

  trackByProductId(_: number, item: Product): number {
    return item.id;
  }

  protected readonly Number = Number;
}
