import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { DataService } from '../../services/data.service';
import { PersistenceService } from '../../services/persistence.service';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.reducer';
import { selectUsers, selectLoading } from '../../store/user/user.selectors';
import { loadUsers, deleteUser, addUser, updateUser, loadUsersSuccess } from '../../store/user/user.actions';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'createdAt', 'actions'];
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  roleFilter: string = 'all';
  statusFilter: string = 'all';

  // no inline sample data

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private persistence: PersistenceService
  ) {
    this.users$ = this.store.select(selectUsers);
    this.loading$ = this.store.select(selectLoading);
  }

  filteredUsers: User[] = [];

  ngOnInit(): void {
    // Load users from localStorage or seed JSON
    this.persistence.loadList<User>('users', '/data/users.json').subscribe(users => {
      this.store.dispatch(loadUsersSuccess({ users }));
    });
    
    // Subscribe to users from store and apply filters
    this.users$.subscribe(users => {
      const allUsers = users || [];
      this.filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
        const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
      });
    });
  }

  // removed inline seeding

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          // Update existing user
          this.store.dispatch(updateUser({ user: result }));
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        } else {
          // Add new user
          const newUser = {
            ...result,
            id: this.generateUserId(),
            createdAt: new Date().toISOString().split('T')[0],
            lastLogin: 'Never'
          };
          this.store.dispatch(addUser({ user: newUser }));
          this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
          // Persist
          this.users$.subscribe(list => {
            const updated = [...(list || []), newUser];
            this.persistence.saveList<User>('users', updated);
          }).unsubscribe();
        }
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.store.dispatch(deleteUser({ id: user.id }));
      this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
      // Persist
      this.users$.subscribe(list => {
        const updated = (list || []).filter(u => u.id !== user.id);
        this.persistence.saveList<User>('users', updated);
      }).unsubscribe();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'suspended': return 'accent';
      default: return 'primary';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'warn';
      case 'manager': return 'accent';
      case 'user': return 'primary';
      default: return 'primary';
    }
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onRoleFilterChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.users$.subscribe(users => {
      const allUsers = users || [];
      this.filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
        const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
      });
    });
  }
}
