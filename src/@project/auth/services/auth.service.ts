import { Injectable, OnDestroy } from '@angular/core';
import { LoginOptions, NullValidationHandler, OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { filter, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { getAuthorizationConfig } from '../config';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private discoveryDocumentLoaded$ = new BehaviorSubject<boolean>(false);

  private destroyer$ = new Subject<void>();

  private user$ = new BehaviorSubject<object>(null!);

  constructor(private oauthService: OAuthService) {
    // Remove this
    if (!environment.production)
      this.oauthService.events
        .pipe(
          filter((e) => e.type === 'silently_refreshed'),
          takeUntil(this.destroyer$),
        )
        .subscribe(() => alert('Silent Refresh worked :)'));
  }

  init(): Promise<boolean> {
    const config: AuthConfig = {
      ...getAuthorizationConfig(window.location.origin),
      issuer: environment.authority,
    };
    this.oauthService.configure(config);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    return this.initAuthFlow();
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  getToken(): Observable<string> {
    return of(this.oauthService.getAccessToken());
  }

  getUser(): Observable<object> {
    return this.user$.asObservable();
  }

  isDiscoveryDocumentLoaded(): Observable<boolean> {
    return this.discoveryDocumentLoaded$.pipe(startWith(this.discoveryDocumentLoaded$.value));
  }

  hasValidAccessToken(): Observable<boolean> {
    return of(this.oauthService.hasValidAccessToken()).pipe(shareReplay());
  }

  private initAuthFlow(): Promise<any> {
    return new Promise((resolve) => {
      return this.loadDiscoveryDocument().then(() => {
        this.tryLogin().then(() => {
          const isLoggedIn = this.oauthService.hasValidAccessToken();
          if (isLoggedIn) {
            this.loadUserProfile();
            this.oauthService.setupAutomaticSilentRefresh();
            resolve(true);
          } else {
            this.login();
          }
        });
      });
    });
  }

  private loadDiscoveryDocument() {
    return this.oauthService
      .loadDiscoveryDocument()
      .then(() => this.discoveryDocumentLoaded$.next(true));
  }

  private loadUserProfile() {
    from(this.oauthService.loadUserProfile()).subscribe((user) => this.user$.next(user));
  }

  private tryLogin(options?: LoginOptions) {
    return this.oauthService.tryLogin(options);
  }

  ngOnDestroy() {
    this.destroyer$.next();
  }
}
