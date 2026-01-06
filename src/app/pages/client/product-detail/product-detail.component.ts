import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { ProductService } from '../../../core/services/product.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import {Product, ProductOptionValueDTO, SelectedOptions} from '../../../core/models/product.model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OrderPreviewComponent} from '../checkout/order-preview/order-preview.component';
import {CartProduct, CartProductOption} from '../../../core/models/cart.model';
import {Review, ReviewsFilter} from '../../../core/models/review.model';
import {ReviewService} from '../../../core/services/review.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, VndCurrencyPipe, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId: number = 0;
  product!: Product;
  reviewRating = 5;
  editingOptions: boolean = false;
  imagePreview: string = '';
  selectedImage: string = '';
  selectedOptions: SelectedOptions = {};
  @ViewChild('imageContainer') imageContainer!: ElementRef;
  private modalRef?: NgbModalRef;
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private modalService: NgbModal,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getById(this.productId).subscribe(response => {
      if (response) {
        this.product = response;
        this.selectedImage = response.thumbnailUrl;
        this.initSelectedOptions();
        this.loadProductReviews();
      }
    });
  }

  loadProductReviews() {
    const request: ReviewsFilter = {
      page: 0,
      size: 100,
      shopId: this.product.shopId,
      productId: this.product.id
    }
    this.reviewService.getAllWithPaging(request).subscribe(response => {
      this.reviews = response.result || [];
    })
  }

  addCart(product: Product) {
    const options = this.convertSelectedOptionsToCartOptions(this.selectedOptions);
    this.cartService.addToCart(product, options);
  }

  convertSelectedOptionsToCartOptions(selectedOptions: SelectedOptions): CartProductOption[] {
    return Object.entries(selectedOptions).map(([optionId, optionValue]) => ({
      id: Number(optionId),
      selectedOptionValueId: optionValue.id,
      selectedOptionValueImage: optionValue.image
    }));
  }

  buyNow(product: Product) {
    this.modalRef = this.modalService.open(OrderPreviewComponent, { size: 'xl', backdrop: 'static' });
    const options = this.convertSelectedOptionsToCartOptions(this.selectedOptions);
    const productCheckout: CartProduct = {
      shopId: product.shopId,
      productId: product.id,
      productName: product.name,
      thumbnail: product.thumbnailUrl,
      price: product.price
    };

    if (options && Array.isArray(options)) {
      productCheckout.data = JSON.stringify([...options].sort((a, b) => a.id - b.id));
    }

    this.modalRef.componentInstance.products = [productCheckout];
  }

  changeImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  initSelectedOptions() {
    const initialSelectedOptions: Record<number, ProductOptionValueDTO> = {};

    if (this.product.productOptions && this.product.productOptions.length > 0) {
      this.product.productOptions.forEach((option) => {
        if (option.values && option.values.length > 0) {
          initialSelectedOptions[option.id] = option.values[0];
        }
      });
    }

    this.selectedOptions = initialSelectedOptions;
    const hasAnySelection = Object.keys(this.selectedOptions).length > 0;

    if (hasAnySelection) {
      this.mergeAndScaleImages().then(imageCanvas => this.imagePreview = imageCanvas);
    }
  }

  selectOptionValue = (optionId: number, value: ProductOptionValueDTO) => {
    this.editingOptions = true;

    this.selectedOptions = {
      ...this.selectedOptions,
      [optionId]: value
    };

    this.mergeAndScaleImages().then(imageCanvas => this.imagePreview = imageCanvas);
  };

  async mergeAndScaleImages(): Promise<string> {
    const selectedImages = Object.values(this.selectedOptions)
      .map(value => value.image)
      .filter(img => !!img);

    const loadImages = selectedImages.map(url => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    });

    const container = this.imageContainer.nativeElement;
    const targetWidth = container.clientWidth;
    const targetHeight = targetWidth + 1;
    const images = await Promise.all(loadImages);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    images.forEach(img => {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    });

    return canvas.toDataURL("image/png");
  }
}
