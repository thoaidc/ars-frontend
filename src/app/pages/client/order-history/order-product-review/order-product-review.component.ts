import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForOf, NgIf} from '@angular/common';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import {Authentication} from '../../../../core/models/auth.model';
import {AuthService} from '../../../../core/services/auth.service';
import {SaveReviewRequest} from '../../../../core/models/review.model';
import {OrderProduct} from '../../../../core/models/order.model';
import {ReviewService} from '../../../../core/services/review.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-order-product-review',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    VndCurrencyPipe
  ],
  templateUrl: './order-product-review.component.html',
  styleUrl: './order-product-review.component.scss'
})
export class OrderProductReviewComponent implements OnInit {
  @Input() products: OrderProduct[] = [];
  reviewForm!: FormGroup;
  authentication!: Authentication;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private authService: AuthService,
    private reviewService: ReviewService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      reviews: this.fb.array(this.products.map(orderProduct => this.createProductReview(orderProduct)))
    });
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
      }
    });
  }

  get reviewArray() {
    return this.reviewForm.get('reviews') as FormArray;
  }

  createProductReview(product: OrderProduct): FormGroup {
    return this.fb.group({
      shopId: [product.shopId],
      productId: [product.productId],
      productName: [product.productName],
      productImage: [product.productThumbnail],
      price: [product.totalAmount],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      reviewImage: [null]
    });
  }

  onFileSelect(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.reviewArray.at(index).patchValue({
        reviewImage: file
      });
    }
  }

  submitReviews() {
    if (this.reviewForm.valid) {
      const formValues = this.reviewForm.value.reviews;

      const request: SaveReviewRequest = {
        customerId: this.authentication.id,
        customerName: this.authentication.fullname,
        reviews: formValues.map((item: any) => ({
          shopId: item.shopId,
          productId: item.productId,
          content: item.comment,
          image: item.reviewImage
        }))
      };

      this.reviewService.save(request).subscribe(response => {
        if (response && response.status) {
          this.toast.success('Đánh giá sản phẩm thành công');
        }

        this.dismiss();
      });
    }
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
