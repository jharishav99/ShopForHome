import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  cartCount = 0;

  constructor(public authService: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'Admin';
      if (user) {
        // Refresh actual cart count from backend for this user
        this.cartService.refreshCount();
      } else {
        // Reset to 0 on logout
        this.cartService.updateCount(0);
      }
    });

    this.cartService.cartCount$.subscribe(count => this.cartCount = count);
  }

  logout(): void {
    this.authService.logout();
  }
}