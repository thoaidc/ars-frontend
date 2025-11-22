import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import {SidebarComponent} from '../layouts/sidebar/sidebar.component';
import {NavbarComponent} from '../layouts/navbar/navbar.component';
import {AuthService} from '../../core/services/auth.service';
import {ADMIN_SIDEBAR_ROUTES} from '../../constants/sidebar.constants';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, SidebarComponent, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isSidebarShown = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.hasToken()) {
      this.authService.authenticate().subscribe(() => this.authService.navigateToPreviousPage());
    } else {
      this.router.navigate(['/login']).then();
    }
  }

  protected readonly ADMIN_SIDEBAR_ROUTES = ADMIN_SIDEBAR_ROUTES;
}
