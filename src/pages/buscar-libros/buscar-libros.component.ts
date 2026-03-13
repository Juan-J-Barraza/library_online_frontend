import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { BookResponse } from 'src/models/bookResponse';


export interface FiltersBook {
  title: string;
  editorial_id: number;
  author_id: number;
  page: number;
  page_size: number;
}

@Component({
  selector: 'app-buscar-libros',
  templateUrl: './buscar-libros.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class BuscarLibrosComponent {

  filters?: FiltersBook;
  libro: BookResponse[] = [];

  page = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private api: ApiService) {}

  buscar() {

    this.api.buscarLibros(this.filters)
    .subscribe(res => {

      this.libro = res.data;
      this.page = res.page;
      this.pageSize = res.page_size;
      this.totalPages = res.total_pages;

    });

  }

  siguientePagina(){

    if(this.page < this.totalPages){

      this.page++;
      this.buscar();

    }

  }

  anteriorPagina(){

    if(this.page > 1){

      this.page--;
      this.buscar();

    }

  }

  reservar(id: number){

    this.api.reservarLibro(id).subscribe(()=>{

      alert("Libro reservado 📚");

    });

  }

}