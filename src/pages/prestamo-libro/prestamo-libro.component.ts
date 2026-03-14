import { Component } from '@angular/core';
import { ApiService } from 'src/api/api.service';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-prestamo-libro',
  templateUrl: './prestamo-libro.component.html',
  styleUrls: ['./prestamo-libro.component.css']
})
export class PrestamoLibroComponent {

  libros: any[] = [];

  constructor(
    private api: ApiService,
    private toastService: ToastService
  ) { }

  // prestarLibro(id: number){
  //   this.api.prestarLibro(id).subscribe(() => {
  //     this.toastService.showSuccess("Libro prestado correctamente 📚");
  //   }, (error: any) => {
  //     this.toastService.showError("Error al realizar el préstamo");
  //   });
  // }

}