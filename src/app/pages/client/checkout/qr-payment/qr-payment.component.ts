import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgIf} from '@angular/common';
import {PaymentInfo} from '../../../../core/models/payment.model';
import {PaymentService} from '../../../../core/services/payment.service';
import {VndCurrencyPipe} from '../../../../shared/pipes/vnd-currency.pipe';
import * as QRCode from 'qrcode';
import {WebSocketService} from '../../../../core/services/websocket.service';
import {AuthService} from '../../../../core/services/auth.service';
import {Authentication} from '../../../../core/models/auth.model';
import {ToastrService} from 'ngx-toastr';

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
export class QrPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() orderId!: number;
  @Input() paymentInfo!: PaymentInfo;
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;
  authentication!: Authentication;
  paymentCompletionTopicName: string = '/topics/payment_completion_notification_';
  isPaymentCompletion: boolean = false;

  private readonly QR_OPTIONS: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 8,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };

  constructor(
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private toast: ToastrService
  ) {
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
        this.paymentCompletionTopicName = this.paymentCompletionTopicName + this.authentication.id;
        this.webSocketService.subscribeToTopic(this.paymentCompletionTopicName).subscribe(message => {
          if (message.body && message.body == 'OK') {
            this.isPaymentCompletion = true;
          } else {
            this.toast.error('Thanh toán thất bại!', message.body ? message.body : '');
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.orderId && this.orderId > 0) {
      this.paymentService.getPaymentInfo(this.orderId).subscribe(response => {
        if (response) {
          this.paymentInfo = response;
          this.generateQrCode(response.qrCode);
        }
      });
    } else if (this.paymentInfo) {
      this.generateQrCode(this.paymentInfo.qrCode);
    }
  }

  refresh() {
    this.generateQrCode(this.paymentInfo.qrCode);
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
    this.webSocketService.unsubscribeFromTopic(this.paymentCompletionTopicName);
    this.activeModal.dismiss(false);
  }

  ngOnDestroy(): void {
    this.webSocketService.unsubscribeFromTopic(this.paymentCompletionTopicName);
  }
}
