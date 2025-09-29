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
import {ICON_CLOSE_SIDEBAR, ICON_EXPAND_SIDEBAR} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {HasAuthorityDirective} from '../../../shared/directives/has-authority.directive';
import {SIDEBAR_ROUTES} from './sidebar.route';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

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
    RouterLink,
    TranslatePipe
  ]
})
export class SidebarComponent implements AfterViewInit {
  routerList = SIDEBAR_ROUTES;
  latestUrl: string = '';
  mobileMode: boolean = false;
  desktopMode: boolean = false;
  private expanded = new Set<string>(); // Key is route.path
  @Input() isSidebarShown!: boolean;
  @Output() isSidebarShownChange = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService) {
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
    const current = this.latestUrl;
    const parent = this.routerList.find(r => current.startsWith(r.path) && r.submenu?.length);

    if (parent) {
      this.expanded.add(parent.path);
    }

    console.log(this.translateService.instant('user.status.active'));
  }

  isExpanded(key: string): boolean {
    return this.expanded.has(key);
  }

  toggleParent(key: string) {
    if (key) {
      const wasOpen = this.expanded.has(key);
      this.expanded.clear();

      if (!wasOpen) {
        this.expanded.add(key);
      }
    }
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
