import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-user',
  imports: [CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  user: any = null;
  authenticated = false;
  private sub: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe authentication state
    this.sub = this.authService.subscribeAuthenticationState().subscribe((auth) => {
      this.authenticated = !!auth;
      if (auth) {
        // set a simple user view from authentication payload (fallback to localStorage)
        this.user = {
          name: auth.fullname || auth.username || localStorage.getItem('username') || 'Người dùng',
          email: auth.email || '',
          phone: auth.phone || ''
        };
      } else {
        this.user = null;
      }
    });
  }

  logout(){
    this.authService.logout();
    // redirect to client home after logout
    this.router.navigate(['/client/home']).then();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
