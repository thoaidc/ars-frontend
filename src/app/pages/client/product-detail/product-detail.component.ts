import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

interface ProductImage {
  id: number;
  url: string;
  thumbUrl: string;
}

interface VariantOption {
  label: string;
  value: string;
}

interface RecommendedProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  // gallery hình
  images: ProductImage[] = [
    {
      id: 1,
      url: 'assets/images/product/main-1.png',
      thumbUrl: 'assets/images/product/thumb-1.png',
    },
    {
      id: 2,
      url: 'assets/images/product/main-2.png',
      thumbUrl: 'assets/images/product/thumb-2.png',
    },
    {
      id: 3,
      url: 'assets/images/product/main-3.png',
      thumbUrl: 'assets/images/product/thumb-3.png',
    },
    {
      id: 4,
      url: 'assets/images/product/main-4.png',
      thumbUrl: 'assets/images/product/thumb-4.png',
    },
  ];

  activeImage: ProductImage = this.images[0];

  // thông tin sản phẩm
  productTitle =
    'Nurse Life Personalized T-Shirt – Custom Portrait Doctor / Nurse';
  rating = 4.8;
  ratingCount = 1264;
  price = 219500;
  oldPrice = 439000;
  discountText = '50% OFF';

  sizes: VariantOption[] = [
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
    { label: '2XL', value: '2XL' },
  ];
  colors: VariantOption[] = [
    { label: 'Teal', value: 'teal' },
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
    { label: 'Pink', value: 'pink' },
  ];

  selectedSize = 'M';
  selectedColor = 'teal';
  quantity = 1;

  // sản phẩm gợi ý bên dưới
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

  constructor(private cartService: CartService) {}

  setActiveImage(img: ProductImage) {
    this.activeImage = img;
  }

  selectSize(size: VariantOption) {
    this.selectedSize = size.value;
  }

  selectColor(color: VariantOption) {
    this.selectedColor = color.value;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty() {
    this.quantity++;
  }

  addToCart(): void {
    const quantity = this.quantity || 1;

    this.cartService.addItem(
      {
        productId: 1, // sau này đổi thành this.productId lấy từ route
        name: this.productTitle,
        price: this.price,
        thumbnailUrl: this.activeImage.url,
      },
      quantity
    );
  }

  trackById(_: number, item: { id: number }) {
    return item.id;
  }
}
