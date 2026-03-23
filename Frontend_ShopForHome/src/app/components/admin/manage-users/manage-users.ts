import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin';
import { User } from '../../../models/models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-users.html'
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  message = '';
  messageType = 'success';
  userForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(5)]],
      role: ['User']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: u => this.users = u,
      error: () => this.showMsg('Failed to load users.', 'danger')
    });
  }

  createUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.adminService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.showMsg('User created successfully.', 'success');
        this.userForm.reset({ role: 'User' });
        this.loadUsers();
      },
      error: (err) => {
        this.showMsg(err.error || 'Failed to create user.', 'danger');
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.showMsg('User deleted successfully.', 'success');
          this.users = this.users.filter(u => u.userId !== id);
        },
        error: () => this.showMsg('Failed to delete user.', 'danger')
      });
    }
  }

  showMsg(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 4000);
  }
}
