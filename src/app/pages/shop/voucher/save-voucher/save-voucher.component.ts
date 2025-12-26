import {Component, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Location, NgIf} from '@angular/common';
import {Voucher, VoucherType} from '../../../../core/models/voucher.model';
import {AlphanumericOnlyDirective} from '../../../../shared/directives/alphanumeric-only.directive';
import {VoucherService} from '../../../../core/services/voucher.service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {Authentication} from '../../../../core/models/auth.model';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-save-voucher',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AlphanumericOnlyDirective,
    NgIf,
    NgSelectComponent
  ],
  templateUrl: './save-voucher.component.html',
  styleUrl: './save-voucher.component.scss'
})
export class SaveVoucherComponent implements OnInit {
  @Input() voucher: Voucher = {
    id: 0,
    shopId: 0,
    type: 1,
    status: 0,
    name: '',
    code: '',
    value: 0
  }
  @Input() voucherId!: number;
  @Input() isUpdatable: boolean = false;
  authentication!: Authentication;

  constructor(
    public activeModal: NgbActiveModal,
    private voucherService: VoucherService,
    private toast: ToastrService,
    private location: Location,
    private authService: AuthService
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss(false);
    });
    this.authService.subscribeAuthenticationState().subscribe(response => {
      if (response) {
        this.authentication = response;
      }
    });
  }

  ngOnInit(): void {
    if (!this.isUpdatable) {
      this.voucherService.getById(this.voucherId).subscribe(response => {
        if (response) {
          this.voucher = response;
        } else {
          this.toast.error('Không tìm thấy thông tin mã giảm giá');
        }
      });
    }
  }

  changeVoucherStatus() {
    if (this.voucher.status === 1) {
      this.voucher.status = 0;
    } else {
      this.voucher.status = 1;
    }
  }

  confirmSave() {
    if (this.voucher.name && this.voucher.code) {
      this.voucher.shopId = this.authentication?.shopId || 0;
      this.voucherService.saveVoucher(this.voucher).subscribe(response => {
        if (response.status) {
          this.toast.success("Cập nhật mã giảm giá thành công");
          this.activeModal.close(true);
        } else {
          this.toast.error(response.message || '', "Cập nhật mã giảm giá thất bại");
        }
      });
    } else {
      this.toast.error('Tên và mã voucher không được phép để trống');
    }
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }

  protected readonly VoucherType = VoucherType;
}
