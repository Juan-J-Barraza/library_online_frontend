import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookResponse } from '../models/bookResponse';
import { BookPaginated } from '../models/bookPaginated';
import { FiltersBook } from '../models/filtersBook';
import { CreateOrUpdateBookRequest } from '../models/createOrUpdateBookRequest';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) { }

  getAll(filters?: FiltersBook): Observable<BookPaginated> {
    let params = new HttpParams();
    if (filters) {
      if (filters.title) params = params.set('title', filters.title);
      if (filters.editorial_id) params = params.set('editorial_id', filters.editorial_id.toString());
      if (filters.author_id) params = params.set('author_id', filters.author_id.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.page_size) params = params.set('page_size', filters.page_size.toString());
    }
    return this.http.get<BookPaginated>(this.apiUrl, { params });
  }

  getById(id: number): Observable<BookResponse> {
    return this.http.get<BookResponse>(`${this.apiUrl}/${id}`);
  }

  create(book: CreateOrUpdateBookRequest): Observable<BookResponse> {
    return this.http.post<BookResponse>(this.apiUrl, book);
  }

  update(id: number, book: CreateOrUpdateBookRequest): Observable<BookResponse> {
    return this.http.put<BookResponse>(`${this.apiUrl}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
