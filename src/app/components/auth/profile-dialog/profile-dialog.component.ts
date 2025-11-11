import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateProfile } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Profile</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width{width:100%;}`]
})
export class ProfileDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const user = data?.user || JSON.parse(localStorage.getItem('auth_user') || '{}');
    this.form = this.fb.group({
      name: [user?.name || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]]
    });
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    const user = { ...JSON.parse(localStorage.getItem('auth_user') || '{}'), ...this.form.value };
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.store.dispatch(updateProfile({ user }));
    this.dialogRef.close(user);
  }
}

