import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {VndCurrencyPipe} from "../../../../shared/pipes/vnd-currency.pipe";
import {OrderDetail} from '../../../../core/models/order.model';
import {OrderService} from '../../../../core/services/order.service';
import {ToastrService} from 'ngx-toastr';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {QrPaymentComponent} from '../../checkout/qr-payment/qr-payment.component';
import {ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS} from '../../../../constants/order.constants';
import {FormsModule} from '@angular/forms';
import {ICON_DOWNLOAD} from '../../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    VndCurrencyPipe,
    NgClass,
    FormsModule,
    SafeHtmlPipe
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  orderDetail?: OrderDetail;
  @Input() orderId: number = 0;
  private modalRef?: NgbModalRef;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private orderService: OrderService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getOrderDetail();
  }

  getOrderDetail() {
    this.orderService.getByIdForUser(this.orderId).subscribe({
      next: (data) => {
        this.orderDetail = data;
      },
      error: (err) => {
        console.error('Lỗi tải chi tiết đơn hàng', err);
      }
    });
  }

  payOrder() {
    this.modalRef = this.modalService.open(QrPaymentComponent, { size: 'xl', backdrop: 'static' });
    this.modalRef.componentInstance.orderId = this.orderId;
    this.modalRef.result.then().finally(() => this.getOrderDetail());
  }

  downloadFile(orderProductId: number) {
    this.orderService.downloadProductFile(orderProductId).subscribe({
      next: response => {
        if (response && response.body) {
          const blob = new Blob([response.body], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `ars_design_${orderProductId}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          this.toast.error('Không tìm thấy dữ liệu');
        }
      },
      error: error => {
        console.log(error);
        this.toast.error('Không thể tải file');
      }
    });
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }

  protected readonly ORDER_STATUS = ORDER_STATUS;
  protected readonly PAYMENT_METHOD = PAYMENT_METHOD;
  protected readonly PAYMENT_STATUS = PAYMENT_STATUS;
  protected readonly ICON_DOWNLOAD = ICON_DOWNLOAD;
}
