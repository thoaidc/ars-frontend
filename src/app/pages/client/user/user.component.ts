import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-user',
  imports: [CommonModule, RouterModule, FormsModule],
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
        // treat auth as any to safely read optional fields that may not be on the Authentication type
        const payload: any = auth as any;
        this.user = {
          name: payload.fullname || payload.username || localStorage.getItem('username') || 'Người dùng',
          fullname: payload.fullname || payload.username || localStorage.getItem('username') || 'Người dùng',
          email: payload.email || '',
          phone: payload.phone || '',
          gender: payload.gender || 'N',
          avatarUrl: payload.avatarUrl || null
        };
      } else {
        this.user = null;
      }
    });
  }

  // navigate to login page (used in guest view)
  goToLogin(): void {
    this.router.navigate(['/login']).then();
  }

  logout(){
    this.authService.logout();
    // redirect to client home after logout
    this.router.navigate(['/client/home']).then();
  }

  // avatar upload not required by DB — removed file upload logic

  updateProfile(): void {
    // nếu có API, chỉ gửi các trường có thể cập nhật: fullname, gender
    const payload = {
      fullname: this.user?.fullname,
      gender: this.user?.gender
    };
    console.log('Cập nhật profile', payload);
    // TODO: gọi API cập nhật profile tại đây nếu cần
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
