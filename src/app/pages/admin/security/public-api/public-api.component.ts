import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {Authorities} from '../../../../constants/authorities.constants';
import {ICON_DELETE, ICON_PLUS, ICON_RELOAD, ICON_SYNC_LARGE, ICON_UPDATE} from '../../../../shared/utils/icon';
import {TranslateService} from '@ngx-translate/core';
import {GatewaySecurityService} from '../../../../core/services/gateway-security.service';
import {
  ModalConfirmDialogComponent
} from '../../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {SaveApiPatternComponent} from '../save-api-pattern/save-api-pattern.component';

@Component({
  selector: 'app-public-api',
  standalone: true,
  imports: [
    HasAuthorityDirective,
    NgForOf,
    NgbTooltip,
    ReactiveFormsModule,
    SafeHtmlPipe,
    NgClass,
    FormsModule,
    NgIf
  ],
  templateUrl: './public-api.component.html',
  styleUrl: './public-api.component.scss'
})
export class PublicApiComponent implements OnInit {
  publicApiPatterns: string[] = [];
  private modalRef?: NgbModalRef;

  constructor(
    private gatewaySecurityService: GatewaySecurityService,
    private translateService: TranslateService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getPublicApisConfig();
  }

  getPublicApisConfig() {
    this.gatewaySecurityService.getPublicApiPatternConfigs().subscribe(response => {
      this.publicApiPatterns = response;
    });
  }

  createNewApiPattern() {
    this.modalRef = this.modalService.open(SaveApiPatternComponent, { size: 'lg', centered: true });
    this.modalRef.componentInstance.isCreateNew = true;
    this.modalRef.closed.subscribe((newApiPattern: string) => {
      if (newApiPattern) {
        this.publicApiPatterns.push(newApiPattern);
        this.updatePublicApisConfig();
        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  updatePublicApiConfig(oldApiPattern: string) {
    const oldPublicApiPatternToUpdate = JSON.parse(JSON.stringify(oldApiPattern));
    this.modalRef = this.modalService.open(SaveApiPatternComponent, { size: 'lg', centered: true });
    this.modalRef.componentInstance.isCreateNew = false;
    this.modalRef.componentInstance.apiPattern = oldPublicApiPatternToUpdate;
    this.modalRef.closed.subscribe((newApiPattern: string) => {
      if (newApiPattern) {
        const index = this.publicApiPatterns.findIndex(api => oldApiPattern === api);

        if (index !== -1) {
          this.publicApiPatterns[index] = newApiPattern;
          this.updatePublicApisConfig();
        }

        if (this.modalRef) {
          this.modalRef.close();
        }
      }
    });
  }

  updatePublicApisConfig() {
    this.gatewaySecurityService.updatePublicApiPatternConfigs(this.publicApiPatterns).subscribe({
      next: response => {
        this.gatewaySecurityService.notify(response, this.modalRef);
        this.getPublicApisConfig();
      },
      error: error => {
        this.getPublicApisConfig();
        this.gatewaySecurityService.error(error);
      },
    });
  }

  deleteApiPattern(configToDelete: string) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.title = 'Bạn có chắn chắn muốn xóa mục này không?';
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.publicApiPatterns = this.publicApiPatterns.filter(config => config != configToDelete);
        this.updatePublicApisConfig();
        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  resetPublicApisConfig() {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.title = this.translateService.instant('Bạn có chắc chắn muốn khôi phục về cài đặt gốc?');
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.gatewaySecurityService.resetPublicApiPatternConfigs().subscribe(response => {
          this.gatewaySecurityService.notify(response, this.modalRef);
          this.getPublicApisConfig();
        });
        if (this.modalRef) this.modalRef.close();
      }
    });
  }

  protected readonly Authorities = Authorities;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly ICON_RELOAD = ICON_RELOAD;
  protected readonly ICON_SYNC_LARGE = ICON_SYNC_LARGE;
}
