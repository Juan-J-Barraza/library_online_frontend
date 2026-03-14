import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReservationResponse } from '../models/ReservationResponse';
import { BookResponse } from '../models/bookResponse';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  reserve(bookId: number): Observable<ReservationResponse[]> {
    return this.http.post<ReservationResponse[]>(`${this.apiUrl}/reservations/${bookId}`, {});
  }

  getReservations(): Observable<BookResponse[]> {
    return this.http.get<BookResponse[]>(`${this.apiUrl}/reservations`);
  }

  loan(bookId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/loads/${bookId}`, {});
  }

  getHistory(): Observable<BookResponse[]> {
    return this.http.get<BookResponse[]>(`${this.apiUrl}/historial`);
  }
}
