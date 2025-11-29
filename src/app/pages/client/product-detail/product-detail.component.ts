import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';

interface ProductImage {
  id: number;
  url: string;
  thumbUrl: string;
}

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductOptionApi {
  id: number;
  name: string;
  values: { id: number; image: string }[];
}

interface ProductApi {
  id: number;
  name: string;
  code: string;
  price: number;
  description?: string;
  customizable?: boolean;
  status?: string;
  thumbnailUrl?: string;
  images?: string[];
  productOptions?: ProductOptionApi[];
}

interface DesignOption {
  id: number;
  imageUrl: string;
}

interface DesignGroup {
  name: string;
  options: DesignOption[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  /** Prefix cho đường dẫn file backend: /uploads/... */
  private readonly fileBaseUrl = 'http://localhost:8080';

  productId!: number;

  // --- GALLERY HÌNH CHÍNH ---
  // cho 1 phần tử rỗng để tránh lỗi runtime trước khi load API
  images: ProductImage[] = [{ id: 0, url: '', thumbUrl: '' }];
  activeImage: ProductImage = this.images[0];

  // --- THÔNG TIN SẢN PHẨM ---
  productTitle = '';
  rating = 4.8; // mock tạm
  ratingCount = 1264;
  price = 0;
  oldPrice = 0;
  discountText = '';

  // --- NHÓM TÙY CHỈNH THIẾT KẾ (từ productOptions) ---
  designGroups: DesignGroup[] = [];
  /** Lưu option đang chọn theo tên group: { 'Size': 1, 'Color': 4 } */
  selectedDesignByGroup: Record<string, number> = {};

  quantity = 1;

  // --- SẢN PHẨM GỢI Ý (mock) ---
  recommended: RecommendedProduct[] = [
    {
      id: 1,
      name: 'Custom Nurse Hoodie',
      price: 399000,
      imageUrl: 'assets/images/product/reco-1.png',
    },
    {
      id: 2,
      name: 'Personalized Mug',
      price: 159000,
      imageUrl: 'assets/images/product/reco-2.png',
    },
    {
      id: 3,
      name: 'Nurse Life Pillow',
      price: 289000,
      imageUrl: 'assets/images/product/reco-3.png',
    },
    {
      id: 4,
      name: 'Medical Student Tee',
      price: 219000,
      imageUrl: 'assets/images/product/reco-4.png',
    },
  ];

  loading = false;
  errorMsg = '';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  // ----------------------------------------------------
  // LIFECYCLE
  // ----------------------------------------------------
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.productId = idParam ? Number(idParam) : 0;

    if (!this.productId) {
      this.errorMsg = 'Product not found';
      return;
    }

    this.loadProduct();
  }

  // ----------------------------------------------------
  // LOAD DATA TỪ API
  // ----------------------------------------------------
  private loadProduct(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productService.getById(this.productId).subscribe({
      next: (res: any) => {
        /**
         * Tùy ProductService:
         *  - Nếu trả thẳng ProductApi   -> product = res
         *  - Nếu trả { code, result }   -> product = res.result
         */
        const product: ProductApi = (res && res.result) ? res.result : res;
        this.mapProduct(product);
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load product';
        this.loading = false;
      },
    });
  }

  /** Map dữ liệu từ API sang model cho UI */
  private mapProduct(p: ProductApi): void {
    // Thông tin cơ bản
    this.productTitle = p.name;
    this.price = Math.round(p.price ?? 0); // 299.99 -> 300
    this.oldPrice = this.price * 2;
    this.discountText = 'SALE';

    // ---------------- GALLERY ----------------
    const imgs: ProductImage[] = [];
    let id = 1;

    if (p.thumbnailUrl) {
      const full = this.buildFileUrl(p.thumbnailUrl);
      imgs.push({ id: id++, url: full, thumbUrl: full });
    }

    (p.images || []).forEach((raw) => {
      const full = this.buildFileUrl(raw);
      imgs.push({ id: id++, url: full, thumbUrl: full });
    });

    if (!imgs.length) {
      imgs.push({
        id: 1,
        url: 'assets/images/product/default.png',
        thumbUrl: 'assets/images/product/default.png',
      });
    }

    this.images = imgs;
    this.activeImage = this.images[0];

    // ------------- NHÓM THIẾT KẾ (designGroups) -------------
    const groups: DesignGroup[] = [];
    this.selectedDesignByGroup = {};

    (p.productOptions || []).forEach((opt) => {
      const options: DesignOption[] =
        opt.values?.map((v) => ({
          id: v.id,
          imageUrl: this.buildFileUrl(v.image),
        })) || [];

      if (options.length) {
        groups.push({
          name: opt.name, // VD: "Size", "Color" (nhưng mình coi như Design group)
          options,
        });

        // Chọn mặc định option đầu tiên của mỗi group
        this.selectedDesignByGroup[opt.name] = options[0].id;
      }
    });

    this.designGroups = groups;
  }

  /** Build URL đầy đủ cho file backend */
  private buildFileUrl(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.fileBaseUrl}${path}`;
  }

  // ----------------------------------------------------
  // HANDLERS CHO UI
  // ----------------------------------------------------
  setActiveImage(img: ProductImage): void {
    this.activeImage = img;
  }

  selectDesign(groupName: string, opt: DesignOption): void {
    this.selectedDesignByGroup[groupName] = opt.id;

    // Khi chọn 1 thiết kế thì cho ảnh chính = ảnh của option đó
    this.activeImage = {
      id: opt.id,
      url: opt.imageUrl,
      thumbUrl: opt.imageUrl,
    };
  }

  isDesignSelected(groupName: string, opt: DesignOption): boolean {
    return this.selectedDesignByGroup[groupName] === opt.id;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty(): void {
    this.quantity++;
  }

  addToCart(): void {
    const quantity = this.quantity || 1;

    this.cartService.addItem(
      {
        productId: this.productId,
        name: this.productTitle,
        price: this.price,
        thumbnailUrl: this.activeImage?.url || '',
      },
      quantity
    );
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}
