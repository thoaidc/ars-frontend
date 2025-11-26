import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {Authorities} from '../../../../constants/authorities.constants';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {CategoryDTO} from '../../../../core/models/product.model';

@Component({
  selector: 'app-save-category',
  standalone: true,
  templateUrl: './save-category.component.html',
  styleUrls: ['./save-category.component.scss'],
  imports: [FormsModule]
})
export class SaveCategoryComponent {
  Authority = Authorities;
  @Input() category: CategoryDTO = {
    id: 0,
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
    if (this.category.name) {
      this.activeModal.close(this.category);
    } else {
      this.toast.error('Tên không được phép để trống');
    }
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }
}
