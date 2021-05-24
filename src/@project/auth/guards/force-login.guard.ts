import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services';

@Injectable({ providedIn: 'root' })
export class ForceLoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const hasValid = this.authService.hasValidAccessToken();
    if (hasValid) {
      return true;
    }
    this.authService.login();
    return false;
  }
}
