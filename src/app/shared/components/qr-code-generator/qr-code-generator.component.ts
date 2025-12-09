import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code-generator',
  standalone: true,
  imports: [],
  templateUrl: './qr-code-generator.component.html',
  styleUrl: './qr-code-generator.component.scss'
})
export class QrCodeGeneratorComponent implements AfterViewInit {
  private readonly QR_DATA: string = '';
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly QR_OPTIONS: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 8,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };

  ngAfterViewInit(): void {
    this.generateQrCode();
  }

  private generateQrCode(): void {
    if (this.qrCanvas) {
      QRCode.toCanvas(
        this.qrCanvas.nativeElement,
        this.QR_DATA,
        this.QR_OPTIONS,
        (error) => console.error('QR Code ERR:', error)
      );
    }
  }
}
