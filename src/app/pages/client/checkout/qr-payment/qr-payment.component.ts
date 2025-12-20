import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgIf} from '@angular/common';
import {PaymentInfo} from '../../../../core/models/payment.model';
import {PaymentService} from '../../../../core/services/payment.service';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-checkout-now',
  standalone: true,
  imports: [
    NgIf,
    VndCurrencyPipe
  ],
  templateUrl: './qr-payment.component.html',
  styleUrl: './qr-payment.component.scss'
})
export class QrPaymentComponent implements OnInit {
  @Input() orderId: number = 8;
  paymentInfo!: PaymentInfo;
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;

  private readonly QR_OPTIONS: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 8,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };

  constructor(public activeModal: NgbActiveModal, private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getPaymentInfo(this.orderId).subscribe(response => {
      if (response) {
        this.paymentInfo = response;
        this.generateQrCode(response.qrCode);
      }
    });
  }

  private generateQrCode(qrCode: string): void {
    if (this.qrCanvas && this.qrContainer) {
      const containerWidth = this.qrContainer.nativeElement.offsetWidth;
      const options = {
        ...this.QR_OPTIONS,
        width: containerWidth,
        margin: 2
      };

      QRCode.toCanvas(
        this.qrCanvas.nativeElement,
        qrCode,
        options,
        (error) => {
          if (error) console.error('QR Code ERR:', error);
        }
      );
    }
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
