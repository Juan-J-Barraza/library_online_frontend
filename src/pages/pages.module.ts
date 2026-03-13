import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoLibroComponent } from './prestamo-libro/prestamo-libro.component';
import { CreateOrUpdateBookRequestComponent } from './create-or-update-book-request/create-or-update-book-request.component';




@NgModule({
  declarations: [
    PrestamoLibroComponent,
    CreateOrUpdateBookRequestComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
