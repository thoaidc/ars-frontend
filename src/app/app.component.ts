import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {Subscription, filter} from 'rxjs';
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
  private routerSubscription: Subscription | null = null;

  constructor(private router: Router, private webSocketService: WebSocketService, private authService: AuthService) {}

  ngOnInit(): void {
    // NOTE: disable automatic authentication check at startup to allow UI to load without backend running.
    // If you need authentication check, re-enable the following line when backend is available.
    // this.authService.authenticate(undefined, true).subscribe(); // Force check status and reload authentication state

    this.stateSubscription = this.webSocketService.onState().subscribe();

    // Call coza plugin initializers after each successful navigation so elements in the new view are initialized
    try {
      if (window && (window as any).initCozaPlugins) {
        (window as any).initCozaPlugins();
      }
    } catch (e) {}

    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      try {
        if (window && (window as any).initCozaPlugins) {
          (window as any).initCozaPlugins();
        }
      } catch (e) {}
    });
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    this.webSocketService.disconnect();
  }
}
