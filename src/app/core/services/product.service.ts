import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product, ProductStatus } from '../models/product.model';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    code: 'SP11',
    name: 'Ảnh',
    quantity: 1111109.918181,
    unit: 'Cái',
    price: 1000000,
    taxRate: 0,
    status: 'ACTIVE',
    startedAt: '2025-05-06T17:16:47',
  },
  {
    id: 2,
    code: 'SP8',
    name: 'Dầu khí đốt',
    quantity: 100,
    unit: 'Bao',
    price: 15000,
    taxRate: 0.1,
    status: 'ACTIVE',
    startedAt: '2023-12-13T17:23:27',
  },
  {
    id: 3,
    code: 'SP10',
    name: 'TS',
    quantity: 50,
    unit: 'Bao',
    price: 100000,
    taxRate: 0,
    status: 'ACTIVE',
    startedAt: '2024-01-01T11:32:20',
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>(INITIAL_PRODUCTS);

  getAll(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getById(id: number): Observable<Product | undefined> {
    const p = this.products$.value.find(pr => pr.id === id);
    return of(p);
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    const current = this.products$.value;
    const newId = current.length ? Math.max(...current.map(p => p.id)) + 1 : 1;
    const newProduct: Product = { ...product, id: newId };
    this.products$.next([...current, newProduct]);
    return of(newProduct);
  }

  update(id: number, partial: Omit<Product, 'id'>): Observable<Product | undefined> {
    const current = this.products$.value;
    const index = current.findIndex(p => p.id === id);
    if (index === -1) return of(undefined);

    const updated: Product = { ...current[index], ...partial };
    const cloned = [...current];
    cloned[index] = updated;
    this.products$.next(cloned);
    return of(updated);
  }

  delete(id: number): Observable<boolean> {
    const filtered = this.products$.value.filter(p => p.id !== id);
    const changed = filtered.length !== this.products$.value.length;
    if (changed) this.products$.next(filtered);
    return of(changed);
  }
}
