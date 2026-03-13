import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule   
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  name = '';
  lastName = '';
  role = '';
  email = '';
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  register(){

    if(!this.role){
      alert("Debe seleccionar un rol");
      return;
    }

    this.api.register(
      this.name,
      this.lastName,
      this.role,
      this.email,
      this.password
    ).subscribe(res => {

      alert("Usuario registrado correctamente");

      this.router.navigate(['/']);

    }, error => {

      alert("Error al registrar usuario");

    });

  }

}