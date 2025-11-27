import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { Subscription } from 'rxjs';

interface ProductForm {
  code: string;
  name: string;
  quantity: number | null;
  unit: string;
  price: number | null;
  taxRate: number;
  status: ProductStatus;
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
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

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
  statusOptions: ProductStatus[] = ['ACTIVE', 'INACTIVE'];

  private sub?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.sub = this.productService.getAll().subscribe(list => {
      this.allProducts = list;
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
        p.code.toLowerCase().includes(kw) ||
        p.name.toLowerCase().includes(kw);
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

  get pagedProducts(): Product[] {
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
      quantity: p.quantity,
      unit: p.unit,
      price: p.price,
      taxRate: p.taxRate,
      status: p.status,
      startedAt: this.toInputDatetime(p.startedAt),
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

    const payload: Omit<Product, 'id'> = {
      code: this.form.code.trim(),
      name: this.form.name.trim(),
      quantity: Number(this.form.quantity ?? 0),
      unit: this.form.unit?.trim() || '',
      price: Number(this.form.price ?? 0),
      taxRate: Number(this.form.taxRate ?? 0),
      status: this.form.status,
      startedAt: this.form.startedAt
        ? new Date(this.form.startedAt).toISOString()
        : new Date().toISOString(),
    };

    if (this.isEdit && this.editingId != null) {
      this.productService.update(this.editingId, payload).subscribe(() => {
        this.closeModal();
      });
    } else {
      this.productService.create(payload).subscribe(() => {
        this.closeModal();
      });
    }
  }

  deleteProduct(p: Product): void {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    this.productService.delete(p.id).subscribe();
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
}
