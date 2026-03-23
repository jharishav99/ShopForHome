import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../services/admin';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  lowStockProducts: any[] = [];

  constructor(private adminService: AdminService, private productService: ProductService) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe(u => this.totalUsers = u.length);
    this.productService.getAll().subscribe(p => {
      this.totalProducts = p.length;
      this.lowStockProducts = p.filter(prod => prod.stock < 10);
    });
    this.adminService.getSalesReport().subscribe(o => {
      this.totalOrders = o.length;
      this.totalRevenue = o.reduce((s, r) => s + r.totalAmount, 0);
    });
  }
}
