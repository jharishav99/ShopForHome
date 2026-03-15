import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>📋 My Orders</h2>
      <p class="text-muted">Order history will appear here.</p>
    </div>
  `
})
export class OrdersComponent {}