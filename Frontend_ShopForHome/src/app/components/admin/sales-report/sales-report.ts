import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import { SalesReport } from '../../../models/models';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-report.html'
})
export class SalesReportComponent implements OnInit {
  reports: SalesReport[] = [];
  filtered: SalesReport[] = [];
  startDate = '';
  endDate = '';
  totalRevenue = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getSalesReport().subscribe(data => {
      this.reports = data;
      this.filtered = data;
      this.calculateTotal();
    });
  }

  filterByDate(): void {
    this.filtered = this.reports.filter(r => {
      const date = new Date(r.orderDate);
      const from = this.startDate ? new Date(this.startDate) : null;
      const to = this.endDate ? new Date(this.endDate) : null;
      return (!from || date >= from) && (!to || date <= to);
    });
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalRevenue = this.filtered.reduce((s, r) => s + r.totalAmount, 0);
  }
}
