import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { Subscription } from 'rxjs';
import { ProductsFilter } from '../../../core/models/product.model';

interface ProductForm {
  code: string;
  name: string;
  quantity: number | null;
  unit: string;
  price: number | null;
  taxRate: number;
  status: string;
  startedAt: string; // dùng cho input type="datetime-local"
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  // dữ liệu
  allProducts: any[] = [];
  filteredProducts: any[] = [];

  // filter + search
  keyword = '';
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';

  // phân trang
  pageSizeOptions = [10, 25, 50];
  pageSize = 10;
  pageIndex = 0;

  // popup form
  showModal = false;
  isEdit = false;
  editingId: number | null = null;

  form: ProductForm = this.createEmptyForm();
  taxOptions = [0, 0.05, 0.1];
  statusOptions = ['ACTIVE', 'INACTIVE'];

  private sub?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // initial load using ProductsFilter (page and size) to call getAllWithPaging
    const req: ProductsFilter = { page: 0, size: 100 };
    this.sub = this.productService.getAllWithPaging(req).subscribe(resp => {
      // Handle both cases: service might return BaseResponse or raw array
      // @ts-ignore
      this.allProducts = Array.isArray(resp) ? resp : (resp.result ?? []);
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ---- LIST + FILTER ----
  applyFilter(): void {
    const kw = this.keyword.trim().toLowerCase();
    this.filteredProducts = this.allProducts.filter(p => {
      const matchKw =
        !kw ||
        (p.code && p.code.toLowerCase().includes(kw)) ||
        (p.name && p.name.toLowerCase().includes(kw));
      const matchStatus =
        this.statusFilter === 'ALL' ? true : p.status === this.statusFilter;
      return matchKw && matchStatus;
    });
    this.pageIndex = 0;
  }

  onSearch(): void {
    this.applyFilter();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.pageIndex = 0;
  }

  prevPage(): void {
    if (this.pageIndex > 0) this.pageIndex--;
  }

  nextPage(): void {
    if ((this.pageIndex + 1) * this.pageSize < this.filteredProducts.length) {
      this.pageIndex++;
    }
  }

  get pagedProducts(): any[] {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice(start, end);
  }

  // ---- MODAL ----
  openAdd(): void {
    this.isEdit = false;
    this.editingId = null;
    this.form = this.createEmptyForm();
    this.showModal = true;
  }

  openEdit(p: Product): void {
    this.isEdit = true;
    this.editingId = p.id;
    this.form = {
      code: p.code,
      name: p.name,
      quantity: (p as any).quantity ?? null,
      unit: (p as any).unit ?? '',
      price: p.price ? Number(p.price) : null,
      taxRate: (p as any).taxRate ?? 0,
      status: p.status,
      startedAt: this.toInputDatetime((p as any).startedAt),
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveProduct(): void {
    if (!this.form.code?.trim() || !this.form.name?.trim()) {
      alert('Mã và tên sản phẩm là bắt buộc');
      return;
    }

    // Create payload matching CreateProductRequest | Product for create/update
    const payload: any = {
      shopId: 0, // TODO: set current shop id
      code: this.form.code.trim(),
      name: this.form.name.trim(),
      price: String(Number(this.form.price ?? 0)),
      description: undefined,
      customizable: false,
      // Note: createProduct expects FormData with fields like 'thumbnail' etc.
    };

    if (this.isEdit && this.editingId != null) {
      const updatePayload: any = { ...payload, id: this.editingId };
      this.productService.updateProduct(updatePayload).subscribe(() => {
        // refresh list
        this.reloadList();
        this.closeModal();
      });
    } else {
      this.productService.createProduct(payload).subscribe(() => {
        this.reloadList();
        this.closeModal();
      });
    }
  }

  deleteProduct(p: Product): void {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    this.productService.deleteProductById(p.id).subscribe(() => this.reloadList());
  }

  // ---- helpers ----
  private createEmptyForm(): ProductForm {
    const now = new Date().toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    return {
      code: '',
      name: '',
      quantity: null,
      unit: '',
      price: null,
      taxRate: 0,
      status: 'ACTIVE',
      startedAt: now,
    };
  }

  private toInputDatetime(iso: string): string {
    if (!iso) return new Date().toISOString().slice(0, 16);
    try {
      return new Date(iso).toISOString().slice(0, 16);
    } catch {
      return iso.slice(0, 16);
    }
  }

  private reloadList(): void {
    const req: ProductsFilter = { page: 0, size: 100 };
    this.productService.getAllWithPaging(req).subscribe(resp => {
      // @ts-ignore
      this.allProducts = Array.isArray(resp) ? resp : (resp.result ?? []);
      this.applyFilter();
    });
  }
}
