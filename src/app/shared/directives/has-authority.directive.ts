import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {AuthService} from '../../core/services/auth.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has the authorities passed as the `expression`
 *
 * @howToUse
 * ```ts
 * <some-element *hasAuthorities="'SYSTEM'">...</some-element>
 * <some-element *hasAuthorities="['CONFIG', 'ACCOUNT']">...</some-element>
 * ```
 */
@Directive({
  selector: '[hasAuthorities]',
  standalone: true
})
export class HasAuthorityDirective implements OnDestroy {
  private authorities!: string | string[];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
  ) {}

  @Input()
  set hasAuthorities(value: string | string[]) {
    this.authorities = value;
    this.updateView();

    // Get notified each time authentication state changes
    this.authService
      .subscribeAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    let hasAuthorities = true;

    if (this.authorities) {
      hasAuthorities = this.authService.hasAllAuthorities(this.authorities);
    }

    this.viewContainerRef.clear();

    if (hasAuthorities) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
