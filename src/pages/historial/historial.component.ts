import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { BookResponse } from 'src/models/bookResponse';


@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html'
})
export class HistorialComponent {

  historial:BookResponse[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.obtenerHistorial().subscribe(data => {
      this.historial = data;
    });
  }
}