import {
  Component,
  ElementRef, Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {Location, NgForOf, NgIf} from '@angular/common';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../../../shared/utils/utils.service';
import {ToastrService} from 'ngx-toastr';
import {LoadingOption} from '../../../../../shared/utils/loading-option';
import {
  CategoryDTO, Product, ProductGroupDTO, UpdateOption, UpdateOptionImage, UpdateProductImage, UpdateProductRequest
} from '../../../../../core/models/product.model';
import {CategoryService} from '../../../../../core/services/category.service';
import {ProductGroupService} from '../../../../../core/services/product-group.service';
import {AlphanumericOnlyDirective} from '../../../../../shared/directives/alphanumeric-only.directive';
import {SafeHtmlPipe} from '../../../../../shared/pipes/safe-html.pipe';
import {ICON_DELETE, ICON_PLUS, ICON_X_WHITE} from '../../../../../shared/utils/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ProductService} from '../../../../../core/services/product.service';
import {Authentication} from '../../../../../core/models/auth.model';
import {AuthService} from '../../../../../core/services/auth.service';

interface ImagePreview {
  id?: number;
  file: File | null;
  previewUrl: string;
}

interface OptionPreview {
  id?: number;
  name: string;
  images: ImagePreview[];
}

@Component({
  selector: 'app-shop-product-update',
  standalone: true,
  imports: [
    NgSelectComponent,
    ReactiveFormsModule,
    FormsModule,
    AlphanumericOnlyDirective,
    SafeHtmlPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './modal-update-product.component.html',
  styleUrls: ['./modal-update-product.component.scss'],
})
export class ModalUpdateProductComponent implements OnInit {
  currentTab: number = 0;
  categories: CategoryDTO[] = [];
  productGroups: ProductGroupDTO[] = [];
  product: UpdateProductRequest = {
    id: 0,
    shopId: 1,
    name: '',
    code: '',
    price: '',
    customizable: false
  };
  selectedThumbnail: string | any;
  galleryImages: ImagePreview[] = [];
  options: OptionPreview[] = [];
  optionPreviews: ImagePreview[][] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('galleryInput') galleryInput!: ElementRef;
  @Input() productId!: number;
  @Input() isUpdatable: boolean = false;
  authentication!: Authentication;

  constructor(
    public toastr: ToastrService,
    public location: Location,
    public translateService: TranslateService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public renderer: Renderer2,
    public utilService: UtilsService,
    public loading: LoadingOption,
    private categoryService: CategoryService,
    private productGroupService: ProductGroupService,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss();
    });

    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
      }
    });
  }

  ngOnInit(): void {
    this.initData();
    this.product.id = this.productId;
    this.loadProduct(this.productId);
  }

  loadProduct(id: number): void {
    this.productService.getById(id).subscribe(response => {
      if (response) {
        const data: Product = response;

        this.product = {
          ...this.product,
          id: data.id,
          name: data.name,
          code: data.code,
          price: data.price,
          customizable: data.customizable,
          description: data.description,
          categoryIds: data.categories?.map(c => c.id as number),
          productGroupIds: data.productGroups?.map(g => g.id as number),
          thumbnail: data.thumbnailUrl
        } as UpdateProductRequest;

        if (data.thumbnailUrl) {
          this.selectedThumbnail = data.thumbnailUrl;
        }

        this.galleryImages = (data.images || []).map(productImage => ({
          id: productImage.id,
          file: null,
          previewUrl: productImage.image
        }));

        this.options = [];
        this.optionPreviews = [];

        (data.productOptions || []).forEach(optionDTO => {
          const optionImages: ImagePreview[] = [];

          (optionDTO.values || []).forEach(valueDTO => {
            optionImages.push({
              id: valueDTO.id,
              file: null,
              previewUrl: valueDTO.image,
            });
          });

          this.options.push({
            id: optionDTO.id,
            name: optionDTO.name,
            images: [],
          });
          this.optionPreviews.push(optionImages);
        });
      }
    });
  }

  initData() {
    this.categoryService.getAllWithPaging({
      page: 0,
      size: 1000
    }).subscribe(response => {
      this.categories = response.result || [];
    });

    this.productGroupService.getAllWithPaging({
      page: 0,
      size: 1000
    }).subscribe(response => {
      this.productGroups = response.result || [];
    });
  }

  onDesignFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.product.originalImage = file;
    } else {
      this.product.originalImage = null;
    }
  }

  onSingleFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.product.thumbnail = files[0];
      this.processFile(files[0]);
    }

    this.fileInput.nativeElement.value = '';
  }

  processFile(file: File): void {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedThumbnail = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Vui lòng chọn một file ảnh.');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onGalleryFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.galleryImages.push({
            file: file,
            previewUrl: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }

    event.target.value = '';
  }

  removeGalleryImage(index: number): void {
    this.galleryImages.splice(index, 1);
  }

  addOption(): void {
    this.options.push({ name: '', images: [] });
    this.optionPreviews.push([]);
  }

  removeOption(index: number): void {
    this.options.splice(index, 1);
    this.optionPreviews.splice(index, 1);
  }

  onOptionImageSelected(event: any, optionIndex: number): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.optionPreviews[optionIndex].push({
            file: file,
            previewUrl: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
    event.target.value = '';
  }

  removeOptionImage(optionIndex: number, imageIndex: number): void {
    this.optionPreviews[optionIndex].splice(imageIndex, 1);
  }

  confirmSave() {
    this.product.thumbnail = this.product.thumbnail instanceof File ? this.product.thumbnail : null;
    this.product.productImages = this.galleryImages.map(img => {
      return {
        id: img.id,
        image: img.file || null
      } as UpdateProductImage;
    });

    this.product.options = this.options.map((opt, optionIndex) => {
      const optionImages = this.optionPreviews[optionIndex];

      const updatedOptionImages: UpdateOptionImage[] = optionImages.map(img => {
        return {
          id: img.id,
          image: img.file || null
        } as UpdateOptionImage;
      });

      return {
        id: opt.id,
        name: opt.name,
        images: updatedOptionImages,
      } as UpdateOption;
    });

    this.product.shopId = this.authentication?.shopId || 0;

    this.productService.updateProduct(this.product).subscribe(response => {
      if (response.status) {
        this.toastr.success("Cập nhật sản phẩm thành công");
        this.activeModal.close(true);
      } else {
        this.toastr.error(response.message || '', "Cập nhật sản phẩm thất bại");
      }
    });
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }

  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly ICON_X_WHITE = ICON_X_WHITE;
}
