import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {Location, NgIf} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {LoadingOption} from '../../../../shared/utils/loading-option';
import {PaymentService} from '../../../../core/services/payment.service';
import {PaymentHistoryDetail} from '../../../../core/models/payment.model';
import {PAYMENT_METHOD, PAYMENT_STATUS, PAYMENT_TYPE} from '../../../../constants/order.constants';

@Component({
  selector: 'app-payment-history-detail',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './payment-history-detail.component.html',
  styleUrl: './payment-history-detail.component.scss'
})
export class PaymentHistoryDetailComponent implements OnInit {
  @Input() paymentHistoryId: number = 0;
  paymentHistoryDetail!: PaymentHistoryDetail;

  constructor(
    public toastr: ToastrService,
    public location: Location,
    public translateService: TranslateService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public renderer: Renderer2,
    public utilService: UtilsService,
    public loading: LoadingOption,
    private paymentService: PaymentService
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss();
    });
  }

  ngOnInit(): void {
    this.loadPaymentHistoryDetail();
  }

  loadPaymentHistoryDetail() {
    this.paymentService.getPaymentHistoryById(this.paymentHistoryId).subscribe(response => {
      if (response) {
        this.paymentHistoryDetail = response;
      } else {
        this.toastr.error('Không tìm thấy thông tin giao dịch');
      }
    })
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }

  protected readonly PAYMENT_STATUS = PAYMENT_STATUS;
  protected readonly PAYMENT_TYPE = PAYMENT_TYPE;
  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
}
