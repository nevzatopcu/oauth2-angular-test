import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../services';

@Injectable({ providedIn: 'root' })
export class DiscoveryDocumentLoadedGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isDiscoveryDocumentLoaded().pipe(
      filter((x) => Boolean(x)),
      take(1),
    );
  }
}
