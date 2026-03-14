import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../api/reservation.service';
import { LoanService } from 'src/api/loan.service';
import { ReservationResponse } from 'src/models/ReservationResponse';
import { AuthService } from 'src/api/auth.service';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  reservations: ReservationResponse[] = [];

  page = 1;
  pageSize = 8;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  // Cancel Modal
  isCancelModalOpen = false;
  selectedReservationId = 0;

  // Confirm Modal
  isConfirmModalOpen = false;
  confirmExpectedDate = '';
  minDate = '';

  constructor(
    private reservationService: ReservationService,
    private loanService: LoanService,
    public authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.cargarReservas();
    
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  cargarReservas() {
    this.isLoading = true;
    this.reservationService.getReservations(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.reservations = res.data;
        this.totalPages = res.total_pages;
        this.totalElements = res.total_items;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.showError('Error al cargar las reservas');
        this.isLoading = false;
      }
    });
  }

  /* ------------- CANCELAR RESERVA ------------- */
  abrirCancelar(id: number) {
    this.selectedReservationId = id;
    this.isCancelModalOpen = true;
  }

  cerrarCancelarModal() {
    this.isCancelModalOpen = false;
  }

  cancelarReserva() {
    this.reservationService.cancel(this.selectedReservationId).subscribe({
      next: () => {
        this.toastService.showSuccess('Reserva cancelada exitosamente');
        this.cerrarCancelarModal();
        this.cargarReservas();
      },
      error: () => {
        this.toastService.showError('Error al cancelar la reserva');
      }
    });
  }

  /* ------------- CONFIRMAR PRÉSTAMO ------------- */
  abrirConfirmModal(id: number) {
    this.selectedReservationId = id;

    const defaults = new Date();
    defaults.setDate(defaults.getDate() + 5);
    this.confirmExpectedDate = defaults.toISOString().split('T')[0];

    this.isConfirmModalOpen = true;
  }

  cerrarConfirmModal() {
    this.isConfirmModalOpen = false;
  }

  confirmarPrestamo() {
    if (!this.confirmExpectedDate) {
      this.toastService.showError('Debes seleccionar una fecha de devolución calculada');
      return;
    }

    const isoDateString = new Date(this.confirmExpectedDate + 'T23:59:59').toISOString();

    this.loanService.confirmLoan(this.selectedReservationId, { expected_return_date: isoDateString }).subscribe({
      next: () => {
        this.toastService.showSuccess('Préstamo confirmado y activo 📚');
        this.cerrarConfirmModal();
        this.cargarReservas();
      },
      error: (err) => {
        this.toastService.showError(err.error?.error || 'Error al confirmar el préstamo');
      }
    });
  }

  /* ------------- PAGINATION ------------- */
  cambiarPagina(p: number) {
    this.page = p;
    this.cargarReservas();
  }

  getPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}