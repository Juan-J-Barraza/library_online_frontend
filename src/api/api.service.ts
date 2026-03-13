import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookResponse } from 'src/models/bookResponse';
import { AuthResponse } from 'src/models/authResponse';
import { ReservationResponse } from 'src/models/ReservationResponse';
import { BookPaginated } from 'src/models/bookPaginated';
import { FiltersBook } from 'src/pages/buscar-libros/buscar-libros.component';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = "http://localhost:8080/api/v1";

  constructor(private http: HttpClient) { }


  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/logins`, {
      email: email,
      password: password
    });
  }


  register(name: string, lastName: string, role: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/registers`, {
      name: name,
      last_name: lastName,
      role: role,
      email: email,
      password: password
    });
  }


  buscarLibros(filters?: FiltersBook): Observable<BookPaginated> {
    var params = new HttpParams()
    if (filters?.author_id) params.set("author_id", filters.author_id)
    if (filters?.editorial_id) params.set("editorial_id", filters.editorial_id)
    if (filters?.page) params.set("page", filters.page)
    if (filters?.page_size) params.set("page_size", filters.page_size)
    if (filters?.title) params.set("title", filters.title)

    return this.http.get<BookPaginated>(`${this.apiUrl}/books`, { params });
  }


  reservarLibro(id: number): Observable<ReservationResponse[]> {
    return this.http.post<ReservationResponse[]>(`${this.apiUrl}/reservations/${id}`, {});
  }

  prestarLibro(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/loads/${id}`, {});
  }

  obtenerReservas(): Observable<BookResponse[]> {
    return this.http.get<BookResponse[]>(`${this.apiUrl}/reservations`);
  }


  obtenerHistorial(): Observable<BookResponse[]> {
    return this.http.get<BookResponse[]>(`${this.apiUrl}/historial`);
  }


}