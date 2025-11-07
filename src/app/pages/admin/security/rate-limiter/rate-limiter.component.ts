import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {GatewaySecurityService} from '../../../../core/services/gateway-security.service';
import {TranslateService} from '@ngx-translate/core';
import {SaveApiPatternComponent} from '../save-api-pattern/save-api-pattern.component';
import {
  ModalConfirmDialogComponent
} from '../../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {Authorities} from '../../../../constants/authorities.constants';
import {
  ICON_ATTENTION,
  ICON_DELETE,
  ICON_PLUS,
  ICON_RELOAD,
  ICON_SYNC_LARGE,
  ICON_UPDATE
} from '../../../../shared/utils/icon';
import {RateLimiterDTO} from '../../../../core/models/gateway-security.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-rate-limiter',
  standalone: true,
  imports: [
    HasAuthorityDirective,
    NgForOf,
    NgbTooltip,
    SafeHtmlPipe,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './rate-limiter.component.html',
  styleUrl: './rate-limiter.component.scss'
})
export class RateLimiterComponent implements OnInit {
  rateLimiterConfigs: RateLimiterDTO[] = [];
  rateLimitExcludedApis: string[] = [];
  private modalRef?: NgbModalRef;
  configToUpdate: RateLimiterDTO = {
    routeId: '',
    banThreshold: 1,
    windowSeconds: 1,
    banDurationMinutes: 0,
  };
  @ViewChild('rateLimiterModal') rateLimiterModal!: TemplateRef<any>;

  constructor(
    private gatewaySecurityService: GatewaySecurityService,
    private translateService: TranslateService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllRateLimitExcludedApi();
    this.getAllRateLimiterRoutingConfigs();
  }

  getAllRateLimitExcludedApi() {
    this.gatewaySecurityService.getAllRateLimitExcludedApi().subscribe(response => {
      this.rateLimitExcludedApis = response;
    });
  }

  getAllRateLimiterRoutingConfigs() {
    this.gatewaySecurityService.getAllRateLimiterRoutingConfigs().subscribe(response => {
      this.rateLimiterConfigs = response;
    });
  }

  createNewApiPattern() {
    this.modalRef = this.modalService.open(SaveApiPatternComponent, {size: 'lg', centered: true});
    this.modalRef.componentInstance.isCreateNew = true;
    this.modalRef.closed.subscribe((newApiPattern: string) => {
      if (newApiPattern) {
        this.rateLimitExcludedApis.push(newApiPattern);
        this.updateRateLimiterExcludedApiConfigs();
        if (this.modalRef) {
          this.modalRef.close();
        }
      }
    });
  }

  updateRateLimiterExcludedApiConfig(oldApiPattern: string) {
    const oldExcludedApiToUpdate = JSON.parse(JSON.stringify(oldApiPattern));
    this.modalRef = this.modalService.open(SaveApiPatternComponent, {size: 'lg', centered: true});
    this.modalRef.componentInstance.isCreateNew = false;
    this.modalRef.componentInstance.apiPattern = oldExcludedApiToUpdate;
    this.modalRef.closed.subscribe((newApiPattern: string) => {
      if (newApiPattern) {
        const index = this.rateLimitExcludedApis.findIndex(api => oldApiPattern === api);

        if (index !== -1) {
          this.rateLimitExcludedApis[index] = newApiPattern;
          this.updateRateLimiterExcludedApiConfigs();
        }

        if (this.modalRef) {
          this.modalRef.close();
        }
      }
    });
  }

  updateRateLimiterExcludedApiConfigs() {
    this.gatewaySecurityService.updateRateLimitExcludedApi(this.rateLimitExcludedApis).subscribe({
      next: response => {
        this.gatewaySecurityService.notify(response, this.modalRef);
        this.getAllRateLimitExcludedApi();
      },
      error: error => {
        this.getAllRateLimitExcludedApi();
        this.gatewaySecurityService.error(error);
      },
    });
  }

  openModalUpdateRoute(routeId: string) {
    this.modalRef = this.modalService.open(this.rateLimiterModal, { size: 'lg', centered: true });
    const configToUpdate = this.rateLimiterConfigs.filter(config => config.routeId === routeId)?.[0];
    this.configToUpdate = { ...configToUpdate };
    this.modalRef.result.finally(() => (this.modalRef = undefined));
  }

  confirmSaveRateLimiterConfig() {
    const index = this.rateLimiterConfigs.findIndex(c => c.routeId === this.configToUpdate.routeId);

    if (index !== -1) {
      this.rateLimiterConfigs[index] = this.configToUpdate;
    }

    this.gatewaySecurityService.updateRateLimiterConfig(this.rateLimiterConfigs).subscribe({
      next: response => {
        this.gatewaySecurityService.notify(response, this.modalRef);
        this.getAllRateLimiterRoutingConfigs();
      },
      error: error => {
        this.getAllRateLimiterRoutingConfigs();
        this.gatewaySecurityService.error(error);
      },
    });
  }

  deleteApiPattern(configToDelete: string) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {size: 'lg', backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắn chắn muốn xóa mục này không?';
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.rateLimitExcludedApis = this.rateLimitExcludedApis.filter(config => config != configToDelete);
        this.updateRateLimiterExcludedApiConfigs();
        if (this.modalRef)
          this.modalRef.close();
      }
    });
  }

  resetRateLimitExcludedApiConfig() {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {size: 'lg', backdrop: 'static'});
    this.modalRef.componentInstance.title = this.translateService.instant('Bạn có chắn chắn muốn khôi phục về cài đặt gốc');
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.gatewaySecurityService.resetRateLimitExcludedApi().subscribe(response => {
          this.gatewaySecurityService.notify(response, this.modalRef);
          this.getAllRateLimitExcludedApi();
        });
        if (this.modalRef) this.modalRef.close();
      }
    });
  }

  resetRateLimitConfigs() {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {size: 'lg', backdrop: 'static'});
    this.modalRef.componentInstance.title = this.translateService.instant('Bạn có chắn chắn muốn khôi phục về cài đặt gốc');
    this.modalRef.closed.subscribe((confirm: boolean) => {
      if (confirm) {
        this.gatewaySecurityService.resetRateLimiterConfig().subscribe(response => {
          this.gatewaySecurityService.notify(response, this.modalRef);
          this.getAllRateLimiterRoutingConfigs();
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
  protected readonly ICON_ATTENTION = ICON_ATTENTION;
}
