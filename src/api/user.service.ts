import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResponse } from '../models/userResponse';
import { UserPaginated } from '../models/userPaginated';
import { FiltersUser } from '../models/filtersUser';
import { CreateOrUpdatedUserRequest } from '../models/createOrUpdatedUserRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(filters?: FiltersUser): Observable<UserPaginated> {
    let params = new HttpParams();
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.last_name) params = params.set('last_name', filters.last_name);
      if (filters.role) params = params.set('role', filters.role);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.page_size) params = params.set('page_size', filters.page_size.toString());
    }
    return this.http.get<UserPaginated>(this.apiUrl, { params });
  }

  getById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: number, userData: CreateOrUpdatedUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}`, userData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
