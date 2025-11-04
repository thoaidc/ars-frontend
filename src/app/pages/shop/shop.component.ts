import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import {SidebarComponent} from '../layouts/sidebar/sidebar.component';
import {NavbarComponent} from '../layouts/navbar/navbar.component';
import {SHOP_SIDEBAR_ROUTES} from '../../constants/sidebar.constants';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterOutlet, NgClass, SidebarComponent, NavbarComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
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

  protected readonly SHOP_SIDEBAR_ROUTES = SHOP_SIDEBAR_ROUTES;
}
