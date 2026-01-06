import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Product, SelectedOptions} from '../../../../core/models/product.model';
import {CartProductOption} from '../../../../core/models/cart.model';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.scss'
})
export class CartDetailComponent implements AfterViewInit {
  product!: Product;
  imagePreview: string = '';
  @Input() thumbnail: string = '';
  type: number = 1;
  private _cartProductOptions: CartProductOption[] = [];
  @ViewChild('imageContainer') imageContainer!: ElementRef;
  selectedOptions: SelectedOptions = {};

  constructor(public activeModal: NgbActiveModal) {}

  ngAfterViewInit(): void {
    this.initSelectedOptions();
  }

  @Input() set cartProductOptions(value: CartProductOption[]) {
    this._cartProductOptions = value;
    this.type = 2;
  }

  get cartProductOptions() {
    return this._cartProductOptions;
  }

  initSelectedOptions() {
    this.cartProductOptions.forEach((option) => {
      if (option) {
        this.selectedOptions[option.id] = {
          id: option.selectedOptionValueId,
          image: option.selectedOptionValueImage
        };
      }
    });

    const hasAnySelection = Object.keys(this.selectedOptions).length > 0;

    if (hasAnySelection) {
      this.mergeAndScaleImages().then(imageCanvas => this.imagePreview = imageCanvas);
    }
  }

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

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
