import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from 'src/api/loan.service';
import { AuthService } from 'src/api/auth.service';
import { UserService } from 'src/api/user.service';
import { BookService } from 'src/api/book.service';
import { ToastService } from 'src/app/components/toast/toast.service';
import { LoanResponse } from 'src/models/loanResponse';
import { UserResponse } from 'src/models/userResponse';
import { BookResponse } from 'src/models/bookResponse';

@Component({
  selector: 'app-prestamo-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamo-libro.component.html',
  styleUrls: ['./prestamo-libro.component.css']
})
export class PrestamoLibroComponent implements OnInit {

  loans: LoanResponse[] = [];

  page = 1;
  pageSize = 8;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  // Modals state
  isReturnModalOpen = false;
  isCreateModalOpen = false; // Add state for Direct Loan modal

  selectedLoanId = 0;
  confirmExpectedDate = '';
  minDate = '';

  // Direct Loan Form State
  activeUsers: UserResponse[] = [];
  availableBooks: BookResponse[] = [];
  
  newLoanUserId: number | null = null;
  newLoanBookId: number | null = null;
  newLoanQuantity: number = 1;
  newLoanExpectedDate: string = '';

  constructor(
    private loanService: LoanService,
    public authService: AuthService,
    private userService: UserService,
    private bookService: BookService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.cargarPrestamos();

    // Set minimum date for loan confirm to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  cargarPrestamos() {
    this.isLoading = true;
    this.loanService.getAll(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.loans = res.data;
        this.totalPages = res.total_pages;
        this.totalElements = res.total_items;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.showError('Error al cargar la lista de préstamos');
        this.isLoading = false;
      }
    });
  }

  abrirCreateModal() {
    // Reset form
    this.newLoanUserId = null;
    this.newLoanBookId = null;
    this.newLoanQuantity = 1;
    
    const defaults = new Date();
    defaults.setDate(defaults.getDate() + 5);
    this.newLoanExpectedDate = defaults.toISOString().split('T')[0];

    // Fetch lists
    this.fetchDataForForm();
    this.isCreateModalOpen = true;
  }

  cerrarCreateModal() {
    this.isCreateModalOpen = false;
  }

  fetchDataForForm() {
    // Fetch all users (ideally active or students)
    this.userService.getAll({ page_size: 100 }).subscribe({
      next: (res) => this.activeUsers = res.data
    });

    // Fetch available books
    this.bookService.getAll({ page_size: 100 }).subscribe({
      next: (res) => this.availableBooks = res.data.filter(b => b.available_quantity > 0)
    });
  }

  crearPrestamoDirecto() {
    if (!this.newLoanUserId || !this.newLoanBookId || this.newLoanQuantity < 1 || !this.newLoanExpectedDate) {
      this.toastService.showError('Por favor completa todos los campos correctamente.');
      return;
    }

    const isoDateString = new Date(this.newLoanExpectedDate + 'T23:59:59').toISOString();

    this.loanService.createDirect({
      user_id: Number(this.newLoanUserId),
      book_id: Number(this.newLoanBookId),
      quantity: this.newLoanQuantity,
      expected_return_date: isoDateString
    }).subscribe({
      next: () => {
        this.toastService.showSuccess('Préstamo directo creado exitosamente 🎉');
        this.cerrarCreateModal();
        this.cargarPrestamos();
      },
      error: (err) => {
        this.toastService.showError(err.error?.error || 'Error al crear el préstamo.');
      }
    });
  }

  abrirReturnModal(id: number) {
    this.selectedLoanId = id;
    this.isReturnModalOpen = true;
  }

  cerrarReturnModal() {
    this.isReturnModalOpen = false;
  }

  devolverPrestamo() {
    this.loanService.returnLoan(this.selectedLoanId).subscribe({
      next: () => {
        this.toastService.showSuccess('Libro devuelto exitosamente ✅');
        this.cerrarReturnModal();
        this.cargarPrestamos();
      },
      error: (err) => {
        this.toastService.showError(err.error?.error || 'Error al procesar la devolución');
      }
    });
  }

  cambiarPagina(p: number) {
    this.page = p;
    this.cargarPrestamos();
  }

  getPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}