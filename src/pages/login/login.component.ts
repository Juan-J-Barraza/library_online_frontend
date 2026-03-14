import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../api/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMensaje = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      const dest = this.authService.getCurrentUser()?.role === 'ADMIN' ? '/dashboard' : '/libros';
      this.router.navigate([dest]);
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMensaje = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMensaje = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        const dest = res.user.role === 'ADMIN' ? '/dashboard' : '/libros';
        this.router.navigate([dest]);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMensaje = 'Credenciales incorrectas.';
        } else {
          this.errorMensaje = 'Error al iniciar sesión. Inténtalo de nuevo.';
        }
      }
    });
  }
}