import { AuthConfig } from 'angular-oauth2-oidc';

export function getAuthorizationConfig(origin: string): AuthConfig {
  return {
    clientId: 'interactive.confidential.short',
    redirectUri: `${origin}`,
    silentRefreshRedirectUri: `${origin}/assets/silent-renew.html`,
    postLogoutRedirectUri: `${origin}/?postLogout=true`,
    responseType: 'code',
    showDebugInformation: false,
    useSilentRefresh: true,
    requestAccessToken: true,
    sessionChecksEnabled: true,
    sessionCheckIntervall: 60000,
    scope: 'openid profile email api offline_access',
    clearHashAfterLogin: true,
    dummyClientSecret: 'secret',
  };
}
