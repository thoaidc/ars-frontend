import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { BaseFilterRequest } from '../../../core/models/request.model';
import { CategoryDTO, Product } from '../../../core/models/product.model';
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
    // sử dụng ProductsFilter interface (productGroupsFilter phù hợp)
    this.productService.getAllWithPaging(this.productGroupsFilter).subscribe(response => {
      if (response && response.result) {
        this.trendyProducts = response.result;
        this.justArrivedProducts = response.result;
      } else {
        this.toast.error('Không tải được danh sách sản phẩm')
      }

      this.loading = false;
    }, err => {
      this.loading = false;
      console.error('Error loading products', err);
      this.toast.error('Lỗi khi tải sản phẩm');
    });
  }

  getDisplayPrice(price: number | string | null | undefined): string {
    if (price == null) return '';

    let value = typeof price === 'string' ? Number(price) : price;
    if (Number.isNaN(value)) return '';

    // nếu BE đang lưu 299.99 thì nhân 1000; nếu BE lưu thẳng VND (>=1000) thì giữ nguyên
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

  getImageUrl(thumbnail: string | undefined | null): string {
    if (!thumbnail) return '/assets/coza/images/no-image.png';
    // nếu đã là đường dẫn tuyệt đối hoặc bắt đầu bằng http(s), trả về thẳng
    if (thumbnail.startsWith('http') || thumbnail.startsWith('//')) return thumbnail;
    // nếu bắt đầu bằng '/', giữ nguyên (dev server proxy sẽ điều hướng tới backend)
    if (thumbnail.startsWith('/')) return thumbnail;
    // mặc định: coi như relative path
    return '/uploads/' + thumbnail;
  }

  protected readonly Number = Number;
}
