import { Component, HostListener, Input, OnInit } from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {NgIf} from '@angular/common';
import {ICON_ENGLISH, ICON_LOGOUT, ICON_NOTIFICATION, ICON_VIETNAMESE} from '../../../shared/utils/icon';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {LOCAL_USERNAME_KEY} from '../../../constants/local-storage.constants';
import {WebSocketService} from '../../../core/services/websocket.service';
import {NOTIFICATION_TOPIC, SocketMessage} from '../../../constants/websocket.constants';
import {IMessage} from '@stomp/stompjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LOCALE} from '../../../constants/common.constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    SafeHtmlPipe,
    NgIf,
    TranslatePipe
  ]
})
export class NavbarComponent implements OnInit {
  @Input() isSidebarShown!: boolean;
  showDropdown = '';
  username: string | null = '';

  constructor(
    private router: Router,
    private toast: ToastrService,
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getUserName();

    this.webSocketService.subscribeToTopic(NOTIFICATION_TOPIC).subscribe((message: IMessage) => {
      const notification: SocketMessage = JSON.parse(message.body) as SocketMessage;
      console.log(notification);
    });
  }

  getUserName() {
    let rawUsername = localStorage.getItem(LOCAL_USERNAME_KEY);

    if (rawUsername) {
      this.username = rawUsername.replace(/^"(.*)"$/, '$1');
    } else {
      this.username = null;
    }
  }

  @HostListener('document:click', ['$event'])
  hiddenAllDropdown() {
    this.showDropdown = '';
  }

  toggleUserInfo(event: any) {
    event.stopPropagation();
    this.showDropdown = this.showDropdown == 'USER_INFO' ? '' : 'USER_INFO';
  }

  toggleLanguage(event: any) {
    event.stopPropagation();
    this.showDropdown = this.showDropdown == 'LANGUAGE' ? '' : 'LANGUAGE';
  }

  switchLocale(locale: string) {
    this.translateService.use(locale);
  }

  logout() {
    this.authService.logout();
    this.toast.success(this.translateService.instant('notification.logoutSuccess'));
    this.router.navigate(['/client/home']).then();
  }

  protected readonly ICON_LOGOUT = ICON_LOGOUT;
  protected readonly ICON_VIETNAMESE = ICON_VIETNAMESE;
  protected readonly ICON_ENGLISH = ICON_ENGLISH;
  protected readonly ICON_NOTIFICATION = ICON_NOTIFICATION;
  protected readonly LOCALE = LOCALE;
}
