import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {AuthService} from '../../core/services/auth.service';

@Directive({
  selector: '[hasUserType]',
  standalone: true
})
export class HasUserTypeDirective implements OnDestroy {
  private userTypes!: string | string[];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  @Input()
  set hasUserType(value: string | string[]) {
    this.userTypes = value;
    this.updateView();

    // Get notified each time authentication state changes
    this.authService
      .subscribeAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    let hasUserType = false;

    if (this.userTypes) {
      hasUserType = this.authService.hasUserType(this.userTypes);
    }

    this.viewContainerRef.clear();

    if (hasUserType) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
