import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User, Coupon, SalesReport } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> { return this.http.get<User[]>(`${this.apiUrl}/users`); }
  getUserById(id: number): Observable<User> { return this.http.get<User>(`${this.apiUrl}/users/${id}`); }
  createUser(user: User): Observable<any> { return this.http.post(`${this.apiUrl}/users`, user); }
  updateUser(id: number, user: User): Observable<any> { return this.http.put(`${this.apiUrl}/users/${id}`, user); }
  deleteUser(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/users/${id}`); }
  getCoupons(): Observable<Coupon[]> { return this.http.get<Coupon[]>(`${this.apiUrl}/coupons`); }
  createCoupon(coupon: Coupon): Observable<any> { return this.http.post(`${this.apiUrl}/coupons`, coupon); }
  assignCoupon(userId: number, couponId: number): Observable<any> { return this.http.post(`${this.apiUrl}/usercoupons`, { userId, couponId }); }
  getSalesReport(): Observable<SalesReport[]> { return this.http.get<SalesReport[]>(`${this.apiUrl}/reports/sales`); }
}