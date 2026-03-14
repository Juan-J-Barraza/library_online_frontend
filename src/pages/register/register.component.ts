import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../api/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  lastName = '';
  role: 'PROFESOR' | 'ESTUDIANTE' | 'ADMIN' | '' = '';
  email = '';
  password = '';
  errorMensaje = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.name || !this.lastName || !this.role || !this.email || !this.password) {
      this.errorMensaje = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMensaje = '';

    this.authService.register({
      name: this.name,
      last_name: this.lastName,
      role: this.role as any,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/libros']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMensaje = 'Error al registrarse. Inténtalo de nuevo.';
      }
    });
  }
}