import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';
import {WebSocketService} from './core/services/websocket.service';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {AuthService} from './core/services/auth.service';
import {Authentication} from './core/models/account.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private stateSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private webSocketService: WebSocketService,
    private authService: AuthService
  ) {
    if (this.authService.hasToken()) {
      this.authService.authenticate().subscribe();
      this.authService.navigateToPreviousPage();
    } else {
      this.router.navigate(['/login']).then();
    }
  }

  ngOnInit(): void {
    this.stateSubscription = this.webSocketService.onState().subscribe();

    this.authService.subscribeAuthenticationState().subscribe((authentication: Authentication | null) => {
      if (authentication) {
        this.webSocketService.connect();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }

    this.webSocketService.disconnect();
  }
}
