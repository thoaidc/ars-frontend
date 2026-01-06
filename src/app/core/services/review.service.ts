import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApplicationConfigService} from '../config/application-config.service';
import {API_REVIEW, API_REVIEW_PUBLIC} from '../../constants/api.constants';
import {Observable} from 'rxjs';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';
import {Review, ReviewsFilter, SaveReviewRequest} from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private reviewAPI = this.applicationConfigService.getEndpointFor(API_REVIEW);
  private reviewPublicAPI = this.applicationConfigService.getEndpointFor(API_REVIEW_PUBLIC);

  getAllWithPaging(request: ReviewsFilter): Observable<BaseResponse<Review[]>> {
    const params = createSearchRequestParams(request);
    return this.http.get<BaseResponse<Review[]>>(this.reviewPublicAPI, {params: params});
  }

  save(request: SaveReviewRequest): Observable<BaseResponse<any>> {
    const formData = new FormData();
    formData.append('customerId', request.customerId.toString());
    formData.append('customerName', request.customerName);

    request.reviews.forEach((review, index) => {
      formData.append(`reviews[${index}].shopId`, review.shopId.toString());
      formData.append(`reviews[${index}].productId`, review.productId.toString());
      formData.append(`reviews[${index}].content`, review.content);

      if (review.image) {
        formData.append(`reviews[${index}].image`, review.image);
      }
    });

    return this.http.post<BaseResponse<any>>(this.reviewAPI, formData);
  }

  deleteById(reviewId: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(this.reviewAPI + `/${reviewId}`);
  }
}
