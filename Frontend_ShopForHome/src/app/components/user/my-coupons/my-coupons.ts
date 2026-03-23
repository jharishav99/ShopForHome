import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-coupons',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './my-coupons.html'
})
export class MyCoupons implements OnInit {
  coupons: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.http.get<any[]>(`${environment.apiUrl}/coupons/${userId}`)
      .subscribe({
        next: data => {
          this.coupons = data;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }
}

