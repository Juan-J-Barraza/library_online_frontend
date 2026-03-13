import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';
  errorMensaje = '';

  constructor(private api: ApiService, private router: Router) {

    if(localStorage.getItem('token')){
      this.router.navigate(['/libros']);
    }

  }

  login(){

    this.errorMensaje = '';

    this.api.login(this.email, this.password).subscribe(res => {

      localStorage.setItem("token", res.token);

      this.router.navigate(['/libros']);

    }, error => {

      if(error.status === 404){
        this.errorMensaje = "Esa cuenta no existe. Regístrate.";
      }

      else if(error.status === 401){
        this.errorMensaje = "El correo o la contraseña son incorrectos.";
      }

      else{
        this.errorMensaje = "Error al iniciar sesión.";
      }

    });

  }

  // 🔹 entrar como invitado
  invitado(){
     alert("Entrando como invitado");

    localStorage.removeItem('token'); // aseguramos que no haya sesión
    localStorage.setItem('guest','true');

    this.router.navigate(['/libros']);

  }

}