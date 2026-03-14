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

  // Reservation Modal State
  isReservaModalOpen = false;
  selectedBookForReserva: BookResponse | null = null;
  reservaQuantity = 1;
  reservaExpectedReturnDate = '';

  // Date limits for the input date picker
  minDate = '';
  maxDate = '';

  abrirReserva(book: BookResponse) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.showInfo('Debes iniciar sesión para reservar un libro.');
      this.router.navigate(['/']);
      return;
    }

    this.selectedBookForReserva = book;
    this.reservaQuantity = 1;

    // Set date limits (Today to Today + 5 days)
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    const max = new Date(today);
    max.setDate(today.getDate() + 5);
    this.maxDate = max.toISOString().split('T')[0];

    // Default to maximum allowed date for convenience
    this.reservaExpectedReturnDate = this.maxDate;

    this.isReservaModalOpen = true;
  }

  cerrarReservaModal() {
    this.isReservaModalOpen = false;
    this.selectedBookForReserva = null;
  }

  confirmarReserva() {
    if (!this.selectedBookForReserva) return;

    if (this.reservaQuantity < 1 || this.reservaQuantity > this.selectedBookForReserva.available_quantity) {
      this.toastService.showError('Cantidad no válida.');
      return;
    }

    if (!this.reservaExpectedReturnDate) {
      this.toastService.showError('Debes seleccionar una fecha de devolución.');
      return;
    }

    const isoDateString = new Date(this.reservaExpectedReturnDate + 'T23:59:59').toISOString();

    this.reservationService.reserve({
      book_id: this.selectedBookForReserva.id,
      quantity: this.reservaQuantity,
      expected_return_date: isoDateString
    }).subscribe({
      next: () => {
        this.toastService.showSuccess('¡Libro reservado con éxito! 📚');
        this.cerrarReservaModal();
        this.buscar(); // Actualizar disponibilidad
      },
      error: (err) => {
        this.toastService.showError(err.error?.error || 'No se pudo realizar la reserva.');
      }
    });
  }

  getPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}