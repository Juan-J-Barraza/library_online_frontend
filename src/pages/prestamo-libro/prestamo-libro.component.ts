import { Component } from '@angular/core';
import { ApiService } from 'src/api/api.service';

@Component({
  selector: 'app-prestamo-libro',
  templateUrl: './prestamo-libro.component.html',
  styleUrls: ['./prestamo-libro.component.css']
})
export class PrestamoLibroComponent {

  libros: any[] = [];

  constructor(private api: ApiService){}

  prestarLibro(id: number){

    this.api.prestarLibro(id).subscribe(() => {

      alert("Libro prestado correctamente 📚");

    }, error => {

      alert("Error al realizar el préstamo");

    });

  }

}