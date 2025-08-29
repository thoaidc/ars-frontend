import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {NavbarComponent} from './layouts/navbar/navbar.component';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf, SidebarComponent, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isSidebarShown = true;
}
