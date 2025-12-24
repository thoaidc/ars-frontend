import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
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
