import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '@project/auth/services/auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.getToken$().pipe(
      switchMap((token) => {
        if (token) {
          const headers = req.headers.set('Authorization', token);
          return next.handle(req.clone({ headers }));
        }
        return next.handle(req);
      }),
    );
  }

  private getToken$(): Observable<string | null> {
    return this.authService.getToken().pipe(map((token) => (token ? `Bearer ${token}` : null)));
  }
}
