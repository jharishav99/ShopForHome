export interface User {
  userId?: number;
  fullName: string;
  email: string;
  passwordHash: string;
  role?: string;
  createdAt?: Date;
  isActive?: boolean;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiration: Date;
  userEmail: string;
  role: string;
}

export interface Product {
  productId?: number;
  name: string;
  description: string;
  price: number;
  rating?: number;
  stock: number;
  imageUrl?: string;
  categoryId?: number;
  isActive?: boolean;
  category?: Category;
}

export interface Category {
  categoryId?: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CartItem {
  cartItemId?: number;
  cartId?: number;
  productId: number;
  quantity: number;
  product?: Product;
  userId?: number;
}

export interface Wishlist {
  wishlistId?: number;
  userId: number;
  productId: number;
  addedAt?: Date;
  product?: Product;
}

export interface Coupon {
  couponId?: number;
  code: string;
  discountPct: number;
  validFrom: Date;
  validTo: Date;
  isActive?: boolean;
}

export interface UserCoupon {
  userCouponId?: number;
  userId: number;
  couponId: number;
  isUsed?: boolean;
  assignedAt?: Date;
  coupon?: Coupon;
}

export interface Order {
  orderId?: number;
  userId?: number;
  totalAmount: number;
  orderDate?: Date;
  status?: string;
  couponId?: number;
  paymentStatus?: string;
}

export interface SalesReport {
  orderId: number;
  totalAmount: number;
  orderDate: Date;
}