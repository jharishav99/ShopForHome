import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import { Coupon, User } from '../../../models/models';

@Component({
  selector: 'app-manage-coupons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './manage-coupons.html'
})
export class ManageCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  users: User[] = [];
  couponForm: FormGroup;
  message = '';
  messageType = 'success';
  selectedCouponId: number | null = null;
  selectedUserId: number | null = null;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
      discountPct: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadCoupons();
    this.loadUsers();
  }

  loadCoupons(): void {
    this.adminService.getCoupons().subscribe({
      next: c => this.coupons = c,
      error: () => {}
    });
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: u => this.users = u,
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }
    this.adminService.createCoupon(this.couponForm.value).subscribe({
      next: () => {
        this.showMsg('Coupon created successfully.', 'success');
        this.couponForm.reset({ isActive: true, discountPct: 0 });
        this.loadCoupons();
      },
      error: () => this.showMsg('Failed to create coupon.', 'danger')
    });
  }

  assignCoupon(): void {
    // ✅ FIXED: use === null instead of falsy check so ID=0 doesn't trigger warning
    if (this.selectedUserId === null || this.selectedCouponId === null) {
      this.showMsg('Please select both a user and a coupon.', 'danger');
      return;
    }
    this.adminService.assignCoupon(
      this.selectedUserId,
      this.selectedCouponId
    ).subscribe({
      next: () => {
        this.showMsg('Coupon assigned to user successfully.', 'success');
        this.selectedUserId = null;
        this.selectedCouponId = null;
      },
      error: (err) => {
        this.showMsg(
          err.error?.message || 'Failed to assign coupon.',
          'danger'
        );
      }
    });
  }

  showMsg(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }
}