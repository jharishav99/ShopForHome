import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  cartCount = 0;

  // Declare subscriptions — needed for OnDestroy cleanup
  private authSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'Admin';
      if (user) {
        this.cartService.refreshCount();
      } else {
        this.cartService.updateCount(0);
      }
    });

    this.cartSub = this.cartService.cartCount$.subscribe(
      count => this.cartCount = count
    );
  }

  logout(): void {
    this.authService.logout();
  }

  // Cleanup subscriptions — prevents memory leaks
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.cartSub.unsubscribe();
  }
}