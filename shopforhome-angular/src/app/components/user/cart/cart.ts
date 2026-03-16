import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth';
import { CartItem } from '../../../models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  message = '';
  messageType = 'success';
  loading = true;
  orderPlaced = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loading = false;
      },
      error: () => {
        this.showMsg('Failed to load cart.', 'danger');
        this.loading = false;
      }
    });
  }

  increaseQty(item: CartItem): void {
    this.cartService.addToCart({ productId: item.productId, quantity: 1 })
      .subscribe(() => this.loadCart());
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }
    this.cartService.removeFromCart(item.cartItemId!).subscribe(() => {
      this.cartService.addToCart({
        productId: item.productId,
        quantity: item.quantity - 1
      }).subscribe(() => this.loadCart());
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.cartItemId!).subscribe({
      next: () => {
        this.showMsg('Item removed from cart.', 'success');
        this.loadCart();
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce(
      (s, i) => s + (i.product?.price || 0) * i.quantity, 0
    );
    this.cartService.updateCount(this.cartItems.length);
  }

  checkout(): void {
    if (!this.authService.isLoggedIn()) {
      this.showMsg('Please login to place an order.', 'danger');
      return;
    }
    if (this.cartItems.length === 0) {
      this.showMsg('Your cart is empty.', 'danger');
      return;
    }

    const userId = this.authService.getUserId();
    const order = {
      userId: userId,
      totalAmount: this.total,
      orderDate: new Date(),
      status: 'Pending',
      paymentStatus: 'Pending'
    };

    this.http.post(`${environment.apiUrl}/orders`, order).subscribe({
      next: () => {
        this.orderPlaced = true;
        this.showMsg('Order placed successfully! Thank you for shopping.', 'success');
        // Clear cart items from DB
        const removeAll = this.cartItems.map(item =>
          this.cartService.removeFromCart(item.cartItemId!)
        );
        this.cartItems = [];
        this.total = 0;
        this.cartService.updateCount(0);
      },
      error: () => this.showMsg('Failed to place order. Try again.', 'danger')
    });
  }

  showMsg(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }
}