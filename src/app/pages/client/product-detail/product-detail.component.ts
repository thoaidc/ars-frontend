import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, VndCurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: []
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  productId: string | null = null;
  product: Product | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

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

  ngAfterViewInit(): void {
    // ensure third-party plugins (slick, select2, magnificPopup...) are initialized
    try {
      (window as any).initCozaPlugins && (window as any).initCozaPlugins();
    } catch (e) {
      // ignore
    }
  }
}
