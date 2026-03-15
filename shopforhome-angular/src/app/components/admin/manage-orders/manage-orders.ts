import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>📋 Manage Orders</h2>
      <p class="text-muted">Orders management panel.</p>
    </div>
  `
})
export class ManageOrdersComponent {}