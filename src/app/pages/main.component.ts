import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {NavbarComponent} from './layouts/navbar/navbar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, SidebarComponent, NavbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  isSidebarShown = true;
}
