import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditorialResponse } from '../models/editorialResponse';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {
  private apiUrl = `${environment.apiUrl}/editorials`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<EditorialResponse[]> {
    return this.http.get<EditorialResponse[]>(this.apiUrl);
  }
}
