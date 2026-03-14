import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReservationResponse } from '../models/ReservationResponse';
import { CreateReservationRequest } from '../models/createReservationRequest';
import { ReservationPaginated } from '../models/reservationPaginated';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getReservations(page: number = 1, pageSize: number = 8): Observable<ReservationPaginated> {
    return this.http.get<ReservationPaginated>(`${this.apiUrl}/reservations?page=${page}&page_size=${pageSize}`);
  }

  getReservationById(id: number): Observable<ReservationResponse> {
    return this.http.get<ReservationResponse>(`${this.apiUrl}/reservations/${id}`);
  }

  reserve(request: CreateReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.apiUrl}/reservations`, request);
  }

  cancel(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reservations/${id}/cancel`, {});
  }
}
