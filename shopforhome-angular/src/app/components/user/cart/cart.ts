import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart';
import { CartItem } from '../../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  message = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  increaseQty(item: CartItem): void {
    this.cartService.addToCart({ productId: item.productId, quantity: 1 })
      .subscribe(() => this.loadCart());
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity <= 1) { this.removeItem(item); return; }
    this.cartService.removeFromCart(item.cartItemId!).subscribe(() => {
      this.cartService.addToCart({ productId: item.productId, quantity: item.quantity - 1 })
        .subscribe(() => this.loadCart());
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.cartItemId!).subscribe(() => {
      this.message = 'Item removed.';
      this.loadCart();
      setTimeout(() => this.message = '', 3000);
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
    this.cartService.updateCount(this.cartItems.length);
  }
}