import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';
import {WebSocketService} from './core/services/websocket.service';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private stateSubscription: Subscription | null = null;

  constructor(private webSocketService: WebSocketService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authenticate(undefined, true).subscribe(); // Force check status and reload authentication state
    this.stateSubscription = this.webSocketService.onState().subscribe();
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }

    this.webSocketService.disconnect();
  }
}
