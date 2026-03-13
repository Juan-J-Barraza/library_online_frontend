import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuscarLibrosComponent } from 'src/pages/buscar-libros/buscar-libros.component';
import { ReservaComponent } from 'src/pages/reserva/reserva.component';
import { HistorialComponent } from 'src/pages/historial/historial.component';
import { LoginComponent } from 'src/pages/login/login.component';
import { RegisterComponent } from 'src/pages/register/register.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrestamoLibroComponent } from 'src/pages/prestamo-libro/prestamo-libro.component';

const routes: Routes = [

  { path: '', component: LoginComponent },

  { path: 'prestamo-libro',component: PrestamoLibroComponent},

  { path: 'register', component: RegisterComponent },

  { path: 'libros', component: BuscarLibrosComponent, canActivate:[AuthGuard] },

  { path: 'reservas', component: ReservaComponent, canActivate:[AuthGuard] },

  { path: 'historial', component: HistorialComponent, canActivate:[AuthGuard] },

  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }