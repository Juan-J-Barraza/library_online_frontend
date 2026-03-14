import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}