import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, VndCurrencyPipe, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: []
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  productId: string | null = null;
  product: Product | null = null;

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
    this.productService.getById(id).subscribe((p: Product | undefined) => this.product = p ?? null);
  }

  addToCart(p?: Product): void {
    const prod = p || this.product;
    if (!prod) return;
    // product.price may be string in model; parse to number first
    const priceNum = parseFloat(prod.price as unknown as string) || 0;
    const vndPrice = Math.round((isNaN(priceNum) ? 0 : priceNum) * 23000);
    const thumb = prod.thumbnailUrl ?? (prod.images && prod.images.length ? prod.images[0] : undefined);
    this.cartService.addItem({ productId: (prod as any).id ?? 0, name: prod.name ?? 'Product', price: vndPrice, thumbnailUrl: thumb }, 1);
    // navigate to cart to show user feedback
    this.router.navigate(['/client/cart']);
  }

  buyNow(p?: Product): void {
    const prod = p || this.product;
    if (!prod) return;
    // add to cart and go to checkout
    this.addToCart(prod);
    this.router.navigate(['/client/checkout']);
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
