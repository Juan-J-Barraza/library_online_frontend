import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoanPaginated } from '../models/loanPaginated';
import { LoanResponse } from '../models/loanResponse';
import { ConfirmLoanRequest } from '../models/confirmLoanRequest';
import { CreateDirectLoanRequest } from '../models/createDirectLoanRequest';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAll(page: number = 1, pageSize: number = 8): Observable<LoanPaginated> {
    return this.http.get<LoanPaginated>(`${this.apiUrl}/loans?page=${page}&page_size=${pageSize}`);
  }

  getById(id: number): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(`${this.apiUrl}/loans/${id}`);
  }

  createDirect(request: CreateDirectLoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(`${this.apiUrl}/loans/direct`, request);
  }

  confirmLoan(id: number, request: ConfirmLoanRequest): Observable<any> {
    return this.http.patch(`${this.apiUrl}/loans/${id}/confirm`, request);
  }

  returnLoan(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/loans/${id}/return`, {});
  }
}
