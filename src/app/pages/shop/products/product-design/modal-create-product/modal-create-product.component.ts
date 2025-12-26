import {
  Component,
  ElementRef,
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
  CategoryDTO, CreateOption,
  CreateProductRequest,
  ProductGroupDTO
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

@Component({
  selector: 'app-shop-product-create',
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
  templateUrl: './modal-create-product.component.html',
  styleUrls: ['./modal-create-product.component.scss'],
})
export class ModalCreateProductComponent implements OnInit {
  currentTab: number = 0;
  categories: CategoryDTO[] = [];
  productGroups: ProductGroupDTO[] = [];
  product: CreateProductRequest = {
    shopId: 1,
    name: '',
    code: '',
    price: '',
    customizable: false,
    thumbnail: null
  };
  selectedThumbnail: any;
  options: CreateOption[] = [];
  galleryImages: { file: File, previewUrl: string }[] = [];
  optionPreviews: { file: File, previewUrl: string }[][] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('galleryInput') galleryInput!: ElementRef;
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
      this.activeModal.dismiss(false);
    });

    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
      }
    });
  }

  ngOnInit(): void {
    this.initData();
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
    this.product.productImages = this.galleryImages.map(img => img.file);
    this.product.options = this.options.map((option, index) => ({
      name: option.name,
      images: this.optionPreviews[index].map(preview => preview.file)
    }));
    this.product.shopId = this.authentication?.shopId || 0;

    this.productService.createProduct(this.product).subscribe(response => {
      if (response.status) {
        this.toastr.success("Tạo sản phẩm thành công");
        this.activeModal.close(true);
      } else {
        this.toastr.error(response.message || '', "Tạo sản phẩm thất bại");
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
