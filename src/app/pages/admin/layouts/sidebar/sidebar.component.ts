import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {ICON_CLOSE_SIDEBAR, ICON_EXPAND_SIDEBAR} from '../../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {slideUp} from '../../../../shared/composables/slideCommonStyles';
import {SIDEBAR_ROUTES} from './sidebar.route';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SafeHtmlPipe,
    NgIf,
    NgFor,
    NgClass,
    HasAuthorityDirective,
    RouterLink
  ]
})
export class SidebarComponent implements AfterViewInit {
  routerList = SIDEBAR_ROUTES;
  latestUrl: string = '';
  mobileMode: boolean = false;
  desktopMode: boolean = false;

  @Input() isSidebarShown!: boolean;
  @Output() isSidebarShownChange = new EventEmitter<boolean>();

  constructor(private router: Router) {
    this.latestUrl = this.router.url;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.latestUrl = event.urlAfterRedirects;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewInit() {
    const menuBaseSelector = '.app-sidebar .menu > .menu-item.has-sub';
    const submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub';

    // menu
    const menuLinkSelector = menuBaseSelector + ' > .menu-link';
    const menus = Array.from(document.querySelectorAll(menuLinkSelector)) as HTMLElement[];

    if (menus.length > 0) {
      this.handleSidebarMenuToggle(menus);
    }

    // submenu
    const submenuSelector = menuBaseSelector + submenuBaseSelector;
    const submenus = Array.from(document.querySelectorAll(submenuSelector + ' > .menu-link')) as HTMLElement[];

    if (submenus.length > 0) {
      this.handleSidebarMenuToggle(submenus);
    }
  }

  handleSidebarMenuToggle(menus: HTMLElement[]) {
    menus.forEach((menu) => {
      menu.onclick = (e) => {
        e.preventDefault();
        const target = menu.nextElementSibling;

        if (target && target instanceof HTMLElement) {
          menus.forEach((m) => {
            const otherTarget = m.nextElementSibling;

            if (otherTarget && otherTarget !== target && otherTarget instanceof HTMLElement) {
              slideUp(otherTarget);
              const otherItem = otherTarget.closest('.menu-item');

              if (otherItem instanceof HTMLElement) {
                otherItem.classList.remove('expand');
                otherItem.classList.add('closed');
              }
            }
          });

          const targetItemElm = target.closest('.menu-item');

          if (targetItemElm instanceof HTMLElement) {
            if (
              targetItemElm.classList.contains('expand') ||
              (targetItemElm.classList.contains('active') && !target.style.display)
            ) {
              targetItemElm.classList.remove('expand');
              targetItemElm.classList.add('closed');
            } else {
              targetItemElm.classList.add('expand');
              targetItemElm.classList.remove('closed');
            }
          }
        }
      };
    });
  }

  getLink(path: string, ignore?: boolean) {
    if (ignore) {
      return;
    }

    this.latestUrl = path;
    this.router.navigate([path]).then();
  }

  toggleAppSidebar() {
    this.isSidebarShown = !this.isSidebarShown;
    this.isSidebarShownChange.emit(this.isSidebarShown);

    if (this.isSidebarShown) {
      document.getElementById('sidebar')?.classList.add('open');
    } else {
      document.getElementById('sidebar')?.classList.remove('open');
    }
  }

  protected readonly ICON_CLOSE_SIDEBAR = ICON_CLOSE_SIDEBAR;
  protected readonly ICON_EXPAND_SIDEBAR = ICON_EXPAND_SIDEBAR;
}
