import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './manage-orders.html'
})
export class ManageOrders implements OnInit {
  orders: any[] = [];
  filtered: any[] = [];
  searchUser = '';
  selectedStatus = '';
  message = '';
  loading = true;

  statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filtered = data;
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load orders.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.filtered = this.orders.filter(o => {
      const matchUser = !this.searchUser ||
        o.user?.fullName?.toLowerCase().includes(this.searchUser.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(this.searchUser.toLowerCase());
      const matchStatus = !this.selectedStatus || o.status === this.selectedStatus;
      return matchUser && matchStatus;
    });
  }

  updateStatus(order: any, status: string): void {
    this.adminService.updateOrderStatus(order.orderId, status).subscribe({
      next: () => {
        order.status = status;
        this.message = `Order #${order.orderId} updated to ${status}.`;
        setTimeout(() => this.message = '', 3000);
      },
      error: () => this.message = 'Failed to update status.'
    });
  }

  getStatusBadge(status: string): string {
    const map: any = {
      'Pending': 'bg-warning',
      'Processing': 'bg-info',
      'Shipped': 'bg-primary',
      'Delivered': 'bg-success',
      'Cancelled': 'bg-danger'
    };
    return map[status] || 'bg-secondary';
  }
  
}