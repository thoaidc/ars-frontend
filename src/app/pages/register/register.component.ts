import {Component} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';
import {UtilsService} from '../../shared/utils/utils.service';
import {ICON_EYE, ICON_EYE_CROSS} from '../../shared/utils/icon';
import {SafeHtmlPipe} from '../../shared/pipes/safe-html.pipe';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {LoginRequest} from '../../core/models/auth.model';
import {USER_TYPE} from '../../constants/user.constants';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    SafeHtmlPipe,
    FormsModule,
    NgIf,
    TranslatePipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  isHiddenPassword: boolean = true;
  isRememberMe: boolean = false;
  loginRequest: LoginRequest = {
    username: '',
    password: '',
    rememberMe: false
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private translateService: TranslateService
  ) {}

  toggleDisplayPassword() {
    this.isHiddenPassword = !this.isHiddenPassword;
  }

  login() {
    if (!this.loginRequest.username) {
      this.toastr.error(this.translateService.instant('notification.notEmptyUsername'));
      return;
    }

    if (!this.loginRequest.password) {
      this.toastr.error(this.translateService.instant('notification.notEmptyPassword'));
      return;
    } else if (!this.utilsService.validatePassword(this.loginRequest.password)) {
      return;
    }

    this.loginRequest.rememberMe = this.isRememberMe;

    this.authService.authenticate(this.loginRequest, true).subscribe(authentication => {
      if (authentication) {
        this.toastr.success(this.translateService.instant('notification.loginSuccess'));
        let redirectUrl = '/';

        if (authentication.type === USER_TYPE.ADMIN) {
          redirectUrl += this.utilsService.findFirstAccessibleRoute(authentication.authorities);
        } else if (authentication.type === USER_TYPE.SHOP) {
          redirectUrl += 'shop/dashboard';
        } else {
          redirectUrl += 'client/home';
        }

        this.router.navigate([redirectUrl]).then();
      }
    });
  }

  protected readonly ICON_EYE = ICON_EYE;
  protected readonly ICON_EYE_CROSS = ICON_EYE_CROSS;
}
