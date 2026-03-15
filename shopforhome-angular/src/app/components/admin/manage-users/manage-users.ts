import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin';
import { User } from '../../../models/models';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.html'
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  message = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.adminService.getUsers().subscribe(u => this.users = u); }

  deleteUser(id: number): void {
    if (confirm('Delete this user?')) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.message = 'User deleted.';
        this.users = this.users.filter(u => u.userId !== id);
      });
    }
  }
}