import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { BookResponse } from 'src/models/bookResponse';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva.component.html'
})
export class ReservaComponent {

  libros: BookResponse[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.obtenerReservas().subscribe(data => {
      this.libros = data;
    });
  }
}