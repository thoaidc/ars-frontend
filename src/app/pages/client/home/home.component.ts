import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import {ProductService} from '../../../core/services/product.service';
import {BaseFilterRequest} from '../../../core/models/request.model';
import {CategoryDTO, Product} from '../../../core/models/product.model';
import {ToastrService} from 'ngx-toastr';
import {CategoryService} from '../../../core/services/category.service';

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
  justArrivedProducts: Product[] = [];
  categories: CategoryDTO[] = [];
  productGroupsFilter: BaseFilterRequest = {
    page: 0,
    size: 10,
    keyword: ''
  };

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getAllWithPaging(this.productGroupsFilter).subscribe(response => {
      if (response && response.result) {
        this.categories = response.result;
      }
    })
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getAllWithPaging(this.productGroupsFilter).subscribe(response => {
      if (response && response.result) {
        this.trendyProducts = response.result;
        this.justArrivedProducts = response.result;
      } else {
        this.toast.error('Không tải được danh sách sản phẩm')
      }

      this.loading = false;
    });
  }

  getDisplayPrice(price: number | null | undefined): string {
    if (price == null) return '';

    let value = price;
    // nếu BE đang lưu 299.99 thì bỏ nhân 1000; nếu 299.99 = 299.990đ thì mở dòng dưới:
    if (value < 1000) {
      value = Math.round(value * 1000);
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  }

  addToCart(p: Product): void {
    this.cartService.addItem(
      {
        productId: p.id,
        name: p.name,
        price: this.normalizePrice(Number(p.price)),
        thumbnailUrl: p.thumbnailUrl,
      },
      1
    );
  }

  private normalizePrice(price: number | null | undefined): number {
    if (price == null) return 0;
    if (price < 1000) return Math.round(price * 1000);
    return price;
  }

  trackByProductId(_: number, item: Product): number {
    return item.id;
  }

  protected readonly Number = Number;
}
