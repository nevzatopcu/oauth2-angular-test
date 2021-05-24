import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { DiscoveryDocumentLoadedGuard, ForceLoginGuard } from './guards';
import { AuthService } from './services/auth.service';
import { HttpAuthInterceptor } from './interceptors/auth.interceptor';

export const initializeAppFactory = (authService: AuthService) => {
  const fn = (): Promise<any> => {
    return authService.init();
  };
  return fn;
};

/**
 * Browser kapandığında auth'un kaybolması için bunu açın
 */
const authStorage: Storage = sessionStorage;

/**
 * Browser kapandığında auth'un kaybolmaması için bunu açın
 */
// const authStorage: Storage = localStorage;

@NgModule({
  imports: [OAuthModule.forRoot(), HttpClientModule],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true,
    },
    {
      provide: OAuthStorage,
      useValue: authStorage,
    },
    DiscoveryDocumentLoadedGuard,
    ForceLoginGuard,
  ],
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error(
        `AuthModule has already been loaded. Import Core modules in the AppModule only.`,
      );
    }
  }
}
