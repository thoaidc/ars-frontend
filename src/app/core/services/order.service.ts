import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_ORDER, API_ORDER_BY_SHOP, API_ORDER_BY_USER} from '../../constants/api.constants';
import {map, Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';
import {CreateOrderRequest, Order, OrderDetail, OrdersFilter, SubOrder, SubOrderDetail} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private orderAPI = this.applicationConfigService.getEndpointFor(API_ORDER);
  private orderByUserAPI = this.applicationConfigService.getEndpointFor(API_ORDER_BY_USER);
  private orderByShopAPI = this.applicationConfigService.getEndpointFor(API_ORDER_BY_SHOP);

  getAllWithPaging(request: OrdersFilter): Observable<BaseResponse<Order[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<Order[]>>(this.orderAPI, {params: params});
  }

  getAllWithPagingForUser(request: OrdersFilter): Observable<BaseResponse<Order[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<Order[]>>(this.orderByUserAPI, {params: params});
  }

  getAllWithPagingForShop(request: OrdersFilter): Observable<BaseResponse<SubOrder[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<SubOrder[]>>(this.orderByShopAPI, {params: params});
  }

  getById(orderId: number): Observable<OrderDetail | undefined> {
    return this.http.get<BaseResponse<OrderDetail>>(this.orderAPI + `/${orderId}`)
      .pipe(map(response => response.result));
  }

  getByIdForUser(orderId: number): Observable<OrderDetail | undefined> {
    return this.http.get<BaseResponse<OrderDetail>>(this.orderByUserAPI + `/${orderId}`)
      .pipe(map(response => response.result));
  }

  getByIdForShop(orderId: number): Observable<SubOrderDetail | undefined> {
    return this.http.get<BaseResponse<SubOrderDetail>>(this.orderByShopAPI + `/${orderId}`)
      .pipe(map(response => response.result));
  }

  createOrder(request: CreateOrderRequest): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(this.orderAPI, request);
  }
}
