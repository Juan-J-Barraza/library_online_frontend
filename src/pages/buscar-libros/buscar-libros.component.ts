import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookService } from '../../api/book.service';
import { ReservationService } from '../../api/reservation.service';
import { AuthService } from '../../api/auth.service';
import { BookResponse } from '../../models/bookResponse';
import { FiltersBook } from '../../models/filtersBook';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-buscar-libros',
  templateUrl: './buscar-libros.component.html',
  styleUrls: ['./buscar-libros.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class BuscarLibrosComponent implements OnInit {
  libros: BookResponse[] = [];
  filters: FiltersBook = {
    title: '',
    editorial_id: undefined,
    author_id: undefined,
    page: 1,
    page_size: 8
  };

  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  constructor(
    private bookService: BookService,
    private reservationService: ReservationService,
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.isLoading = true;
    this.bookService.getAll(this.filters).subscribe({
      next: (res) => {
        this.libros = res.data;
        this.totalPages = res.total_pages;
        this.totalElements = res.total_items;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  cambiarPagina(p: number) {
    this.filters.page = p;
    this.buscar();
  }

  reservar(id: number) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.showInfo('Debes iniciar sesión para reservar un libro.');
      this.router.navigate(['/']);
      return;
    }

    this.reservationService.reserve(id).subscribe({
      next: () => {
        this.toastService.showSuccess('¡Libro reservado con éxito! 📚');
        this.buscar(); // Actualizar disponibilidad
      },
      error: (err) => {
        this.toastService.showError('No se pudo realizar la reserva.');
      }
    });
  }

  getPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}