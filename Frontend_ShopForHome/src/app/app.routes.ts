import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/user/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/user/product-list/product-list').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./components/user/product-detail/product-detail').then(m => m.ProductDetail)
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/user/cart/cart').then(m => m.Cart),
    canActivate: [authGuard]
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./components/user/wishlist/wishlist').then(m => m.WishlistComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/user/orders/orders').then(m => m.OrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'my-coupons',
    loadComponent: () => import('./components/user/my-coupons/my-coupons').then(m => m.MyCoupons),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/admin/manage-products/manage-products').then(m => m.ManageProducts)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/admin/manage-users/manage-users').then(m => m.ManageUsersComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/admin/manage-orders/manage-orders').then(m => m.ManageOrders)
      },
      {
        path: 'coupons',
        loadComponent: () => import('./components/admin/manage-coupons/manage-coupons').then(m => m.ManageCouponsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/admin/sales-report/sales-report').then(m => m.SalesReportComponent)
      },
      {
        path: 'stock',
        loadComponent: () => import('./components/admin/stock-management/stock-management').then(m => m.StockManagementComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/home' }
];
