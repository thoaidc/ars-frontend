import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { CartService } from '../../../core/services/cart.service';

interface ApiResponse<T> {
  code: number;
  status: boolean;
  message: string;
  result: T;
  total: number;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  description?: string;
  customizable?: boolean;
  status: string;
  thumbnailUrl?: string;
}

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = false;
  errorMessage = '';

  trendyProducts: Product[] = [];
  justArrivedProducts: Product[] = [];

  readonly shopId = 1;
  private apiUrl = 'http://localhost:8080/api/p/v1/products';
  private backendBaseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('shopId', this.shopId.toString())
      .set('page', '0')
      .set('size', '20')
      .set('sort', 'created_date,desc');

    this.http
      .get<ApiResponse<Product[]>>(this.apiUrl, { params })
      .subscribe({
        next: (res) => {
          const list = res.result || [];

          this.trendyProducts = list.slice(0, 8);
          this.justArrivedProducts = list.slice(8, 16);

          if (this.justArrivedProducts.length === 0) {
            this.justArrivedProducts = this.trendyProducts;
          }
        },
        error: (err) => {
          console.error('Load products failed', err);
          this.errorMessage = 'Không tải được danh sách sản phẩm.';
          this.trendyProducts = [];
          this.justArrivedProducts = [];
        },
        complete: () => (this.loading = false),
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

  getProductImage(p: Product): string {
    if (!p.thumbnailUrl) {
      return 'assets/eshopper/img/product-1.jpg';
    }
    if (p.thumbnailUrl.startsWith('http')) {
      return p.thumbnailUrl;
    }
    return `${this.backendBaseUrl}${p.thumbnailUrl}`;
  }

  addToCart(p: Product): void {
    this.cartService.addItem(
      {
        productId: p.id,
        name: p.name,
        price: this.normalizePrice(p.price),
        thumbnailUrl: this.getProductImage(p),
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
}
