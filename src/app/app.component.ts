import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '@project/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService, private http: HttpClient) {}

  readonly user$ = this.authService.getUser();
  readonly token$ = this.authService.getToken();

  logout(): void {
    this.authService.logout();
  }

  testHttp(): void {
    this.http
      .get('https://jsonplaceholder.typicode.com/todos')
      .subscribe(() => alert('Request succeeded! Check network on developer tools'));
  }
}
