import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-management.html'
})
export class StockManagementComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: p => this.products = p,
      error: () => {}
    });
  }

  get lowStockProducts(): Product[] {
    return this.products.filter(p => p.stock > 0 && p.stock < 10);
  }

  get outOfStockProducts(): Product[] {
    return this.products.filter(p => p.stock === 0);
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warning';
    return 'success';
  }
}