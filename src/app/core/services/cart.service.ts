import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchMap} from 'rxjs';
import {Cart, CartProduct, CartProductOption} from '../models/cart.model';
import {BaseResponse} from '../models/response.model';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_CART} from '../../constants/api.constants';
import {AuthService} from './auth.service';
import {Product} from '../models/product.model';
import {LOCAL_CART_KEY} from '../../constants/local-storage.constants';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private userId: number = 0;
  private cartAPI = this.applicationConfigService.getEndpointFor(API_CART);
  private cartSubject = new BehaviorSubject<Cart | undefined>(undefined);
  private cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private authService: AuthService
  ) {
    this.authService.subscribeAuthenticationState()
      .pipe(
        switchMap(user => {
          if (user) {
            this.userId = user.id;
            return this.loadCartFromAPI();
          } else {
            this.userId = 0;
            return of(this.loadCartFromLocalStorage());
          }
        })
      )
      .subscribe(cart => this.cartSubject.next(cart));
  }

  getCart(): Observable<Cart | undefined> {
    return this.cart$;
  }

  private loadCartFromAPI(): Observable<Cart | undefined> {
    return this.http
      .get<BaseResponse<Cart>>(`${this.cartAPI}/${this.userId}`)
      .pipe(map(res => res.result));
  }

  private loadCartFromLocalStorage(): Cart | undefined {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) as Cart : undefined;
  }

  private persistCart(cart: Cart | null): Observable<any> {
    if (!cart) {
      localStorage.removeItem(LOCAL_CART_KEY);
      return of(null);
    }

    if (this.userId > 0) {
      return this.http.put(this.cartAPI, cart);
    } else {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
      return of(null);
    }
  }

  addToCart(product: Product, options?: CartProductOption[]) {
    const cart = this.cartSubject.value;
    const products = Array.isArray(cart?.products) ? cart.products : [];

    const cartProduct: CartProduct = {
      productId: product.id,
      productName: product.name,
      thumbnail: product.thumbnailUrl,
      price: product.price
    };

    if (options && Array.isArray(options)) {
      cartProduct.data = JSON.stringify([...options].sort((a, b) => a.id - b.id));
    }

    const newCart: Cart = cart
      ? {
        ...cart,
        products: [...products, cartProduct],
        quantity: cart.quantity + 1
      }
      : {
        userId: this.userId,
        quantity: 1,
        products: [cartProduct]
      };

    this.cartSubject.next(newCart);
    this.persistCart(newCart).subscribe();
  }

  updateCartProductOptions(
    productId: number,
    oldOptions: CartProductOption[],
    newOptions: CartProductOption[]
  ) {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const oldData = JSON.stringify(oldOptions);
    const newData = JSON.stringify(newOptions);

    const products = cart.products.map(p => {
      if (p.productId === productId && p.data === oldData) {
        return { ...p, data: newData };
      }
      return p;
    });

    const newCart: Cart = {
      ...cart,
      products,
      quantity: products.length
    };

    this.cartSubject.next(newCart);
    this.persistCart(newCart).subscribe();
  }

  removeFromCart(productId: number) {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const products = cart.products.filter(p => p.productId !== productId);

    const newCart = {
      ...cart,
      products,
      quantity: products.length
    };

    this.cartSubject.next(newCart);
    this.persistCart(newCart).subscribe();
  }

  removeMultipleFromCart(productIds: number[]) {
    const cart = this.cartSubject.value;
    if (!cart) return;

    const products = cart.products.filter(p => !productIds.includes(p.productId));

    const newCart = {
      ...cart,
      products: products,
      quantity: products.length
    };

    this.cartSubject.next(newCart);
    this.persistCart(newCart).subscribe();
  }
}
