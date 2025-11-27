import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {ProductGroupDTO} from '../../../../../core/models/product.model';

@Component({
  selector: 'app-save-product-group',
  standalone: true,
  templateUrl: './save-group.component.html',
  styleUrls: ['./save-group.component.scss'],
  imports: [FormsModule]
})
export class SaveProductGroupComponent {

  @Input() productGroup: ProductGroupDTO = {
    id: 0,
    shopId: 0,
    name: ''
  }

  constructor(
    public activeModal: NgbActiveModal,
    private toast: ToastrService,
    private location: Location,
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss(false);
    });
  }

  confirmSave() {
    if (this.productGroup.name) {
      this.activeModal.close(this.productGroup);
    } else {
      this.toast.error('Tên nhóm sản phẩm không được phép để trống');
    }
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
