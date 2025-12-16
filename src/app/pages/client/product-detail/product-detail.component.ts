import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { ProductService } from '../../../core/services/product.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, VndCurrencyPipe, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: []
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  productId: string | null = null;
  product: any = null;

  // review form state kept as internal vars
  reviewRating = 5;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // read product id from route param
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct();
  }

  loadProduct(): void {
    if (!this.productId) return;
    const id = Number(this.productId);
    if (isNaN(id)) return;
    this.productService.getById(id).subscribe((p: any) => {
      // normalize product shape for template
      this.product = p ?? {
        id,
        name: 'Sản phẩm mẫu',
        price: 587900,
        description: 'Mô tả sản phẩm mẫu',
        shortDescription: 'Mô tả ngắn',
        images: ['/assets/coza/images/product-detail-01.jpg'],
        thumbnailUrl: '/assets/coza/images/product-detail-01.jpg',
        shop: { name: 'Coza Shop', location: 'Hà Nội', phone: '' },
        reviews: [],
        customSelection: { eyeColor: '', hairColor: '', hairStyle: '' }
      };
      // ensure arrays exist
      this.product.reviews = this.product.reviews || [];
      this.product.images = this.product.images || [];
      this.product.customSelection = this.product.customSelection || { eyeColor: '', hairColor: '', hairStyle: '' };
    });
  }

  // helpers to avoid template type errors
  getDescription(): string {
    return this.product?.shortDescription || this.product?.description || '';
  }

  getReviews(): any[] {
    return this.product?.reviews || [];
  }

  getShop(): any {
    return this.product?.shop || { name: 'Coza Shop', location: 'Địa chỉ cửa hàng', phone: '' };
  }

  getWeight(): string {
    return this.product?.weight ?? '0.0';
  }

  getDimensions(): string {
    return this.product?.dimensions ?? 'N/A';
  }

  getMaterials(): string {
    return this.product?.materials ?? 'N/A';
  }

  getColors(): string {
    try { return (this.product?.colors && this.product.colors.join(', ')) || 'N/A'; } catch { return 'N/A'; }
  }

  getStars(n: number): number[] {
    return new Array(Math.max(0, Math.floor(n || 0)));
  }

  onCustomSelect(field: string, value: string): void {
    if (!this.product) return;
    this.product.customSelection = this.product.customSelection || {};
    (this.product.customSelection as any)[field] = value;
  }

  addToCart(p?: any): void {
    const prod = p || this.product;
    if (!prod) return;
    // product.price may be string in model; parse to number first
    const priceNum = parseFloat(prod.price as unknown as string) || 0;
    const vndPrice = Math.round((isNaN(priceNum) ? 0 : priceNum) * 1); // assume price already in VND in template usage
    const thumb = prod.thumbnailUrl ?? (prod.images && prod.images.length ? prod.images[0] : undefined);
    this.cartService.addItem({ productId: (prod as any).id ?? 0, name: prod.name ?? 'Product', price: vndPrice, thumbnailUrl: thumb }, 1);
    // navigate to cart to show user feedback
    this.router.navigate(['/client/cart']);
  }

  buyNow(p?: any): void {
    const prod = p || this.product;
    if (!prod) return;
    // add to cart and go to checkout
    this.addToCart(prod);
    this.router.navigate(['/client/checkout']);
  }

  setRating(n: number): void {
    this.reviewRating = n;
  }

  submitReview(ev?: Event): void {
    ev?.preventDefault();
    const form = ev?.target as HTMLFormElement | null;
    let name = '';
    let email = '';
    let comment = '';
    if (form) {
      const fd = new FormData(form);
      name = (fd.get('name') as string) || '';
      email = (fd.get('email') as string) || '';
      comment = (fd.get('review') as string) || '';
    }
    if (!name || !email || !comment) return;
    const newReview = { name, avatar: '/assets/coza/images/avatar-01.jpg', rating: this.reviewRating, comment, email, createdAt: new Date() };
    this.product.reviews = this.product.reviews || [];
    this.product.reviews.unshift(newReview);
    // clear form inputs via resetting the form element
    if (form) form.reset();
    this.reviewRating = 5;
  }

  ngAfterViewInit(): void {
    // ensure third-party plugins (slick, select2, magnificPopup...) are initialized
    try {
      (window as any).initCozaPlugins && (window as any).initCozaPlugins();
    } catch (e) {
      // ignore
    }
  }
}
