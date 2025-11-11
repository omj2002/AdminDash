import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  userForm: FormGroup;
  isEdit: boolean = false;

  roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' }
  ];

  statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.isEdit = !!data;
    this.userForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      role: [data?.role || 'user', Validators.required],
      status: [data?.status || 'active', Validators.required],
      password: [data?.password || '', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.isEdit) {
        userData.id = this.data.id;
      }
      this.dialogRef.close(userData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
