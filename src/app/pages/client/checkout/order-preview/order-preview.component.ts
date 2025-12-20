import { Component } from '@angular/core';
import {Product} from '../../../../core/models/product.model';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import {NgIf} from '@angular/common';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {QrPaymentComponent} from '../qr-payment/qr-payment.component';

@Component({
  selector: 'app-order-preview',
  standalone: true,
  imports: [
    VndCurrencyPipe,
    NgIf
  ],
  templateUrl: './order-preview.component.html',
  styleUrl: './order-preview.component.scss'
})
export class OrderPreviewComponent {
  product!: Product;
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

  payOrder() {
    this.modalRef = this.modalService.open(QrPaymentComponent, { size: 'xl', backdrop: 'static' });
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
