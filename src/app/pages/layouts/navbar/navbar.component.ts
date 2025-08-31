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

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    SafeHtmlPipe,
    NgIf
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
    private webSocketService: WebSocketService
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

  logout() {
    this.authService.logout().subscribe((success: boolean) => {
      if (success) {
        this.toast.success('Đăng xuất thành công', 'Thông báo');
        this.router.navigate(['/login']).then();
      } else {
        this.toast.error('Đăng xuất thất bại', 'Thông báo');
      }
    });
  }

  protected readonly ICON_LOGOUT = ICON_LOGOUT;
  protected readonly ICON_VIETNAMESE = ICON_VIETNAMESE;
  protected readonly ICON_ENGLISH = ICON_ENGLISH;
  protected readonly ICON_NOTIFICATION = ICON_NOTIFICATION;
}
