import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuscarLibrosComponent } from 'src/pages/buscar-libros/buscar-libros.component';
import { ReservaComponent } from 'src/pages/reserva/reserva.component';
import { LoginComponent } from 'src/pages/login/login.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserManagementComponent } from 'src/pages/usuarios/user-management.component';
import { DashboardComponent } from 'src/pages/dashboard/dashboard.component';
import { BookManagementComponent } from 'src/pages/book-management/book-management.component';

const routes: Routes = [

  { path: '', component: LoginComponent },

  { path: 'libros', component: BuscarLibrosComponent },

  { path: 'reservas', component: ReservaComponent, canActivate: [AuthGuard] },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },

  { path: 'admin/libros', component: BookManagementComponent, canActivate: [AdminGuard] },

  { path: 'usuarios', component: UserManagementComponent, canActivate: [AdminGuard] },

  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }