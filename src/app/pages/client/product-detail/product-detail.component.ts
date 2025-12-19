import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VndCurrencyPipe } from '../../../shared/pipes/vnd-currency.pipe';
import { ProductService } from '../../../core/services/product.service';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import {Product} from '../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, VndCurrencyPipe, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  productId: number = 0;
  product!: Product;
  reviewRating = 5;
  editingOptions: boolean = true;
  imagePreview: any;
  @ViewChild('imageContainer') imageContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getById(this.productId).subscribe(response => {
      if (response) {
        this.product = response;
      }
    });
  }

  ngAfterViewInit(): void {
    // ensure third-party plugins (slick, select2, magnificPopup...) are initialized
    try {
      (window as any).initCozaPlugins && (window as any).initCozaPlugins();
    } catch (e) {}

    this.test();
  }

  productImages: string[] = [
    'assets/images/product/main-1.png',
    'assets/images/product/main-1.png',
    'assets/images/product/main-1.png',
    'assets/images/product/main-1.png',
    'assets/images/product/main-1.png',
    'assets/images/product/main-1.png',
    'assets/images/product/main-1.png'
  ];

  selectedImage: string = this.productImages[0];
  eyeColors: string[] = this.productImages;
  selectedEye: string = this.eyeColors[0];
  hairStyles: string[] = this.productImages;
  selectedHair: number = 0;

  changeImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  // Thêm vào trong class ProductComponent
  reviews = [
    {
      rating: 5,
      title: 'Fast & Smooth!',
      comment: 'Order arrived quick and the shirt feels quality. Nice print, looks just like the pics. ?',
      initial: 'M',
      date: 'Mon Dec 15 2025'
    },
    {
      rating: 4,
      title: 'Super Cute And Comfy!',
      comment: 'Love this shirt! Fits perfectly and the design is adorable. Got compliments already!',
      initial: 'E',
      date: 'Mon Dec 15 2025'
    },
    {
      rating: 4,
      title: 'Fast Shipping!',
      comment: 'Got my order quick and it looks exactly like the pics. Good quality for the price, will buy again.',
      initial: 'JM',
      date: 'Sat Dec 13 2025'
    }
  ];


  async mergeAndScaleImages(urls: string[]): Promise<string> {
    const loadImages = urls.map(url => {
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

  test() {
    const urls = ['assets/images/blouses/blouse1.webp', 'assets/images/body/female-body.png'];
    this.mergeAndScaleImages(urls).then(base64 => {
      this.imagePreview = base64;
    });
  }
}
