import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { CartItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl).pipe(
      tap(items => this.cartCountSubject.next(items.length))
    );
  }

  addToCart(item: { productId: number; quantity: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, item).pipe(
      tap(() => {
        const current = this.cartCountSubject.value;
        this.cartCountSubject.next(current + 1);
      })
    );
  }

  removeFromCart(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.cartCountSubject.value;
        this.cartCountSubject.next(Math.max(0, current - 1));
      })
    );
  }

  refreshCount(): void {
    this.getCart().subscribe();
  }

  updateCount(count: number): void {
    this.cartCountSubject.next(count);
  }
}