import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.productService.getById(+id).subscribe(p => this.product = p);
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart({ productId: this.product.productId!, quantity: 1 }).subscribe({
      next: () => { this.message = 'Added to cart!'; setTimeout(() => this.message = '', 3000); }
    });
  }
}