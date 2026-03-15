import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart';
import { WishlistService } from '../../../services/wishlist';
import { AuthService } from '../../../services/auth';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  selectedCategory = '';
  minPrice = 0;
  maxPrice = 100000;
  minRating = 0;
  categories: string[] = [];
  message = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public authService: AuthService
  ) {}

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    this.productService.getAll().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.categories = [...new Set(products.map(p => p.category?.name || 'Uncategorized'))];
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchSearch = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchPrice = p.price >= this.minPrice && p.price <= this.maxPrice;
      const matchRating = !this.minRating || (p.rating || 0) >= this.minRating;
      const matchCat = !this.selectedCategory || p.category?.name === this.selectedCategory;
      return matchSearch && matchPrice && matchRating && matchCat;
    });
  }

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) { this.message = 'Please login first.'; return; }
    this.cartService.addToCart({ productId: product.productId!, quantity: 1 }).subscribe({
      next: () => { this.message = `${product.name} added to cart!`; setTimeout(() => this.message = '', 3000); }
    });
  }

  toggleWishlist(product: Product): void {
    if (!this.authService.isLoggedIn()) { this.message = 'Please login first.'; return; }
    const userId = this.authService.getUserId();
    this.wishlistService.toggle({ userId, productId: product.productId! }).subscribe({
      next: (res) => { this.message = res.status === 'added' ? 'Added to wishlist!' : 'Removed!'; setTimeout(() => this.message = '', 3000); }
    });
  }
}