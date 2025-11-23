import {Component, OnInit} from '@angular/core';
import {DecimalPipe, NgClass, NgForOf} from "@angular/common";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ICON_COPY, ICON_DELETE, ICON_PLUS, ICON_SEARCH, ICON_UPDATE} from '../../../../shared/utils/icon';
import {Authorities} from '../../../../constants/authorities.constants';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {PAGINATION_PAGE_SIZE} from '../../../../constants/common.constants';
import {BaseFilterRequest} from '../../../../core/models/request.model';
import {AttributeDTO} from '../../../../core/models/product.model';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {AttributeService} from '../../../../core/services/attribute.service';
import {
  ModalConfirmDialogComponent
} from '../../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {BaseResponse} from '../../../../core/models/response.model';
import {SaveAttributeComponent} from './save-attribute/save-attribute.component';

@Component({
  selector: 'app-shop-product-attribute',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgSelectComponent,
    NgbPagination,
    ReactiveFormsModule,
    SafeHtmlPipe,
    TranslatePipe,
    FormsModule,
    NgbTooltip,
    NgClass
  ],
  templateUrl: './product-attribute.component.html',
  styleUrl: './product-attribute.component.scss'
})
export class ProductAttributeComponent implements OnInit {
  attributesFilter: BaseFilterRequest = {
    page: 1,
    size: 10,
    keyword: ''
  };
  attributes: AttributeDTO[] = [];
  totalItems: number = 0;
  isLoading: boolean = false;
  private modalRef?: NgbModalRef;

  constructor(
    private translateService: TranslateService,
    private attributeService: AttributeService,
    private utilService: UtilsService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.attributesFilter.page = 1;
    this.getAttributesWithPaging();
  }

  onChangedPage(event: any): void {
    this.attributesFilter.page = event;
    this.getAttributesWithPaging();
  }

  getAttributesWithPaging() {
    const searchRequest = this.utilService.buildFilterRequest(this.attributesFilter);
    this.attributeService.getAllWithPaging(searchRequest).subscribe(response => {
      this.attributes = response.result || [];
      this.totalItems = response.total || this.attributes.length;
    });
  }

  openModalSaveAttribute(attribute?: AttributeDTO) {
    this.modalRef = this.modalService.open(SaveAttributeComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.attribute = attribute ? attribute : {
      id: 0,
      shopId: 0,
      name: ''
    };

    this.modalRef.closed.subscribe((attribute: any) => {
      if (attribute) {
        this.attributeService.saveAttribute(attribute).subscribe(response => {
          this.notify(response, 'Lưu thuộc tính thành công', 'Lưu thuộc tính thất bại');
        });

        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  delete(attributeId: number) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {size: 'lg', backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắn chắn muốn xóa mục này không?';
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.attributeService.deleteAttributeById(attributeId).subscribe(response => {
          this.notify(response, 'Xóa thuộc tính thành công', 'Xóa thuộc tính thất bại');
        });

        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  private notify(response: BaseResponse<any>, successMessage: string, errorMessage: string) {
    if (response.status) {
      this.toast.success(this.translateService.instant(successMessage));
      this.onSearch();
    } else {
      this.toast.error(
        response.message
          ? response.message
          : this.translateService.instant(errorMessage)
      );
    }
  }

  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly Authorities = Authorities;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_COPY = ICON_COPY;
  protected readonly ICON_DELETE = ICON_DELETE;
}
