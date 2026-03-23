import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'Please login to view orders.';
      this.loading = false;
      return;
    }
    this.http.get<any[]>(`${environment.apiUrl}/orders/user/${userId}`).subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.error = 'Failed to load orders.'; this.loading = false; }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':   return 'badge bg-warning text-dark';
      case 'shipped':   return 'badge bg-primary';
      case 'delivered': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default:          return 'badge bg-secondary';
    }
  }
}
