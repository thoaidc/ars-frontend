import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {AttributeDTO} from '../../../../../core/models/product.model';

@Component({
  selector: 'app-save-attribute',
  standalone: true,
  templateUrl: './save-attribute.component.html',
  styleUrls: ['./save-attribute.component.scss'],
  imports: [FormsModule]
})
export class SaveAttributeComponent {

  @Input() attribute: AttributeDTO = {
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
    if (this.attribute.name) {
      this.activeModal.close(this.attribute);
    } else {
      this.toast.error('Tên thuộc tính không được phép để trống');
    }
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
