import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import { Coupon } from '../../../models/models';

@Component({
  selector: 'app-manage-coupons',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-coupons.html'
})
export class ManageCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  couponForm: FormGroup;
  message = '';

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
      discountPct: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void { this.adminService.getCoupons().subscribe(c => this.coupons = c); }

  onSubmit(): void {
    if (this.couponForm.invalid) return;
    this.adminService.createCoupon(this.couponForm.value).subscribe({
      next: () => { this.message = 'Coupon created!'; this.couponForm.reset({ isActive: true }); this.ngOnInit(); },
      error: () => this.message = 'Failed to create coupon.'
    });
  }
}