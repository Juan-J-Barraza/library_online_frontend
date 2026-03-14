import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { BookService } from '../../api/book.service';
import { BookResponse } from '../../models/bookResponse';
import { FiltersBook } from '../../models/filtersBook';
import { CreateOrUpdateBookRequest } from '../../models/createOrUpdateBookRequest';
import { AuthorService } from '../../api/author.service';
import { EditorialService } from '../../api/editorial.service';
import { AuthorResponse } from '../../models/authorResponse';
import { EditorialResponse } from '../../models/editorialResponse';
import { ToastService } from 'src/app/components/toast/toast.service';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-management.component.html',
  styleUrls: ['./book-management.component.css']
})
export class BookManagementComponent implements OnInit, OnDestroy {
  libros: BookResponse[] = [];
  filters: FiltersBook = {
    title: '',
    page: 1,
    page_size: 5
  };

  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  // Modals
  isCreateModalOpen = false;
  isEditModalOpen = false;

  // Dropdown data
  availableAuthors: AuthorResponse[] = [];
  availableEditorials: EditorialResponse[] = [];

  newBook: CreateOrUpdateBookRequest = {
    title: '',
    available_quantity: 0,
    total_quantity: 1,
    image: '',
    editorial_id: 0,
    author_ids: []
  };

  editBook: CreateOrUpdateBookRequest = {
    title: '',
    available_quantity: 0,
    total_quantity: 1,
    image: '',
    editorial_id: 0,
    author_ids: []
  };
  editBookId = 0;

  errorMsg = '';

  // Debounce
  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private editorialService: EditorialService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filters.page = 1;
      this.cargarLibros();
    });

    this.cargarLibros();
    this.cargarListados();
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  cargarListados() {
    this.authorService.getAll().subscribe(res => this.availableAuthors = res);
    this.editorialService.getAll().subscribe(res => this.availableEditorials = res);
  }

  onSearchInput(value: string) {
    this.filters.title = value;
    this.searchSubject.next(value);
  }

  cargarLibros() {
    this.isLoading = true;
    this.bookService.getAll(this.filters).subscribe({
      next: (res) => {
        this.libros = res.data;
        this.totalPages = res.total_pages;
        this.totalElements = res.total_items;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  // Create
  abrirCrear() {
    this.newBook = { title: '', available_quantity: 0, total_quantity: 1, image: '', editorial_id: 0, author_ids: [] };
    this.errorMsg = '';
    this.isCreateModalOpen = true;
  }

  cerrarCrearModal() {
    this.isCreateModalOpen = false;
    this.errorMsg = '';
  }

  crearLibro() {
    this.newBook.editorial_id = Number(this.newBook.editorial_id);

    if (!this.newBook.title || !this.newBook.editorial_id || this.newBook.author_ids.length === 0) {
      this.toastService.showError('Completa título, editorial e ingresa al menos un autor.');
      this.errorMsg = 'Completa título, editorial e ingresa al menos un autor.';
      return;
    }
    this.bookService.create(this.newBook).subscribe({
      next: () => {
        this.toastService.showSuccess('Libro creado exitosamente 📚');
        this.cerrarCrearModal();
        this.cargarLibros();
      },
      error: () => {
        this.toastService.showError('Error al crear el libro.');
        this.errorMsg = 'Error al crear el libro.';
      }
    });
  }

  // Edit
  abrirEditar(book: BookResponse) {
    this.editBookId = book.id;
    this.editBook = {
      title: book.title,
      available_quantity: book.available_quantity,
      total_quantity: book.total_quantity,
      image: book.image,
      editorial_id: book.editorial.id,
      author_ids: book.authors.map(a => a.id)
    };
    this.errorMsg = '';
    this.isEditModalOpen = true;
  }

  cerrarEditarModal() {
    this.isEditModalOpen = false;
    this.errorMsg = '';
  }

  guardarCambios() {
    this.editBook.editorial_id = Number(this.editBook.editorial_id);

    if (!this.editBook.title || !this.editBook.editorial_id || this.editBook.author_ids.length === 0) {
      this.toastService.showError('Completa título, editorial e ingresa al menos un autor.');
      this.errorMsg = 'Completa título, editorial e ingresa al menos un autor.';
      return;
    }
    this.bookService.update(this.editBookId, this.editBook).subscribe({
      next: () => {
        this.toastService.showSuccess('Libro actualizado correctamente');
        this.cerrarEditarModal();
        this.cargarLibros();
      },
      error: () => {
        this.toastService.showError('Error al actualizar el libro.');
        this.errorMsg = 'Error al actualizar el libro.';
      }
    });
  }

  // Delete
  eliminar(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.bookService.delete(id).subscribe(() => {
        this.toastService.showSuccess('Libro eliminado');
        this.cargarLibros();
      });
    }
  }

  // Image upload
  onImageSelected(event: Event, target: 'new' | 'edit') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        if (target === 'new') {
          this.newBook.image = base64;
        } else {
          this.editBook.image = base64;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  cambiarPagina(p: number) {
    this.filters.page = p;
    this.cargarLibros();
  }

  getPages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  isAuthorSelected(id: number, target: 'new' | 'edit'): boolean {
    const list = target === 'new' ? this.newBook.author_ids : this.editBook.author_ids;
    return list.includes(id);
  }

  toggleAuthor(id: number, target: 'new' | 'edit') {
    const list = target === 'new' ? this.newBook.author_ids : this.editBook.author_ids;
    const index = list.indexOf(id);
    if (index === -1) {
      list.push(id);
    } else {
      list.splice(index, 1);
    }
  }

  // Author filter search
  authorSearchNew = '';
  authorSearchEdit = '';

  getFilteredAuthors(target: 'new' | 'edit'): AuthorResponse[] {
    const term = (target === 'new' ? this.authorSearchNew : this.authorSearchEdit).toLowerCase();

    if (!term) {
      const selectedIds = target === 'new' ? this.newBook.author_ids : this.editBook.author_ids;
      // Always show selected authors, plus up to 3 unselected ones
      const selected = this.availableAuthors.filter(a => selectedIds.includes(a.id));
      const unselected = this.availableAuthors.filter(a => !selectedIds.includes(a.id)).slice(0, 3);
      return [...selected, ...unselected];
    }

    return this.availableAuthors.filter(a =>
      `${a.name} ${a.last_name}`.toLowerCase().includes(term)
    );
  }
}

