import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserService } from '../../api/user.service';
import { AuthService } from '../../api/auth.service';
import { UserResponse } from 'src/models/userResponse';
import { FiltersUser } from 'src/models/filtersUser';
import { CreateOrUpdatedUserRequest } from '../../models/createOrUpdatedUserRequest';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  usuarios: UserResponse[] = [];
  filters: FiltersUser = {
    name: '',
    last_name: '',
    role: '',
    page: 1,
    page_size: 5
  };

  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  selectedUser: UserResponse | null = null;
  isEditModalOpen = false;

  // Create user modal
  isCreateModalOpen = false;
  newUser: CreateOrUpdatedUserRequest = {
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'ESTUDIANTE'
  };
  createErrorMsg = '';

  // Debounce search
  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filters.page = 1;
      this.cargarUsuarios();
    });

    this.cargarUsuarios();
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  onSearchInput(value: string) {
    this.filters.name = value;
    this.searchSubject.next(value);
  }

  cargarUsuarios() {
    this.isLoading = true;
    this.userService.getAll(this.filters).subscribe({
      next: (res) => {
        this.usuarios = res.data;
        this.totalPages = res.total_pages;
        this.totalElements = res.total_items;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.delete(id).subscribe(() => {
        this.toastService.showSuccess('Usuario eliminado');
        this.cargarUsuarios();
      });
    }
  }

  abrirEditar(user: UserResponse) {
    this.selectedUser = { ...user };
    this.isEditModalOpen = true;
  }

  cerrarModal() {
    this.isEditModalOpen = false;
    this.selectedUser = null;
  }

  guardarCambios() {
    if (this.selectedUser) {
      this.userService.update(this.selectedUser.id, {
        name: this.selectedUser.name,
        last_name: this.selectedUser.last_name,
        email: this.selectedUser.email,
        role: this.selectedUser.role
      }).subscribe(() => {
        this.toastService.showSuccess('Usuario actualizado');
        this.cerrarModal();
        this.cargarUsuarios();
      });
    }
  }

  // Create user methods
  abrirCrear() {
    this.newUser = { name: '', last_name: '', email: '', password: '', role: 'ESTUDIANTE' };
    this.createErrorMsg = '';
    this.isCreateModalOpen = true;
  }

  cerrarCrearModal() {
    this.isCreateModalOpen = false;
    this.createErrorMsg = '';
  }

  crearUsuario() {
    if (!this.newUser.name || !this.newUser.last_name || !this.newUser.email || !this.newUser.password) {
      this.toastService.showError('Por favor, completa todos los campos.');
      this.createErrorMsg = 'Por favor, completa todos los campos.';
      return;
    }
    this.authService.register(this.newUser).subscribe({
      next: () => {
        this.toastService.showSuccess('Usuario creado exitosamente 👤');
        this.cerrarCrearModal();
        this.cargarUsuarios();
      },
      error: () => {
        this.toastService.showError('Error al crear el usuario. Inténtalo de nuevo.');
        this.createErrorMsg = 'Error al crear el usuario. Inténtalo de nuevo.';
      }
    });
  }

  cambiarPagina(p: number) {
    this.filters.page = p;
    this.cargarUsuarios();
  }

  getPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
