import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorResponse } from '../models/authorResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = `${environment.apiUrl}/authors`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<AuthorResponse[]> {
    return this.http.get<AuthorResponse[]>(this.apiUrl);
  }
}
