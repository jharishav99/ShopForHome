import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../services/wishlist';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth';
import { Wishlist } from '../../../models/models';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html'
})
export class WishlistComponent implements OnInit {
  wishlist: Wishlist[] = [];
  message = '';

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.wishlistService.getWishlist(userId).subscribe(items => this.wishlist = items);
  }

  removeFromWishlist(item: Wishlist): void {
    const userId = this.authService.getUserId();
    this.wishlistService.toggle({ userId, productId: item.productId }).subscribe(() => {
      this.wishlist = this.wishlist.filter(w => w.wishlistId !== item.wishlistId);
    });
  }

  moveToCart(item: Wishlist): void {
    this.cartService.addToCart({ productId: item.productId, quantity: 1 }).subscribe(() => {
      this.message = `Moved to cart!`;
      this.removeFromWishlist(item);
    });
  }
}
