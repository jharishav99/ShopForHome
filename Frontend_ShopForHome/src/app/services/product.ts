import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private searchUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> { return this.http.get<Product[]>(this.apiUrl); }
  getById(id: number): Observable<Product> { return this.http.get<Product>(`${this.apiUrl}/${id}`); }
  create(product: Product): Observable<Product> { return this.http.post<Product>(this.apiUrl, product); }
  update(id: number, product: Product): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, product); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
  search(query: string): Observable<Product[]> { return this.http.get<Product[]>(`${this.searchUrl}?query=${query}`); }
  uploadCsv(file: File): Observable<any> {
    const fd = new FormData(); fd.append('file', file);
    return this.http.post(`${this.apiUrl}/uploadcsv`, fd);
  }
}


