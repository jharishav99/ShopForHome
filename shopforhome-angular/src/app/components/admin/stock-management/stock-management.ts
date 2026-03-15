import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>⚠️ Stock Management</h2>
      <div class="alert alert-warning" *ngIf="lowStock.length > 0">
        {{lowStock.length}} product(s) have low stock (below 10 units)!
      </div>
      <table class="table table-hover">
        <thead class="table-dark">
          <tr><th>Product</th><th>Stock</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of products"
              [class.table-danger]="p.stock === 0"
              [class.table-warning]="p.stock > 0 && p.stock < 10">
            <td>{{p.name}}</td>
            <td>{{p.stock}}</td>
            <td>
              <span class="badge"
                    [class.bg-success]="p.stock >= 10"
                    [class.bg-warning]="p.stock > 0 && p.stock < 10"
                    [class.bg-danger]="p.stock === 0">
                {{p.stock >= 10 ? 'OK' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class StockManagementComponent implements OnInit {
  products: Product[] = [];
  lowStock: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(p => {
      this.products = p;
      this.lowStock = p.filter(prod => prod.stock < 10);
    });
  }
}