import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart';
import { WishlistService } from '../../../services/wishlist';
import { AuthService } from '../../../services/auth';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  message = '';
  messageType = 'success';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(+id).subscribe({
        next: (p) => { this.product = p; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.showMsg('Please login to add items to cart.', 'warning');
      return;
    }
    if (!this.product) return;
    this.cartService.addToCart({ 
      productId: this.product.productId!, 
      quantity: 1 
    }).subscribe({
      next: () => this.showMsg('Added to cart successfully.', 'success'),
      error: () => this.showMsg('Failed to add to cart.', 'danger')
    });
  }

  addToWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.showMsg('Please login to use wishlist.', 'warning');
      return;
    }
    if (!this.product) return;
    // Send only productId — backend reads userId from JWT
    this.wishlistService.toggle({ 
      userId: 0,  // ignored by backend, uses JWT
      productId: this.product.productId! 
    }).subscribe({
      next: (res) => this.showMsg(
        res.status === 'added' ? 'Added to wishlist.' : 'Removed from wishlist.',
        'success'
      ),
      error: () => this.showMsg('Failed to update wishlist.', 'danger')
    });
  }

  showMsg(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 3000);
  }
}