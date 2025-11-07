import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {Authorities} from '../../../../constants/authorities.constants';
import {ICON_ATTENTION} from '../../../../shared/utils/icon';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-save-api-pattern',
  standalone: true,
  templateUrl: './save-api-pattern.component.html',
  styleUrls: ['./save-api-pattern.component.scss'],
  imports: [
    HasAuthorityDirective,
    FormsModule,
    SafeHtmlPipe
  ]
})
export class SaveApiPatternComponent {
  Authority = Authorities;
  disableButton = false;
  @Input() apiPattern: string = '';
  @Input() isCreateNew: boolean = false;

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
    if (this.apiPattern) {
      this.activeModal.close(this.apiPattern);
    } else {
      this.toast.error('Giá trị không được phép để trống');
    }
  }

  dismiss() {
    this.activeModal.dismiss(false);
  }

  protected readonly ICON_ATTENTION = ICON_ATTENTION;
}
