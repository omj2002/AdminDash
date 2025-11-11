import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { login, loginSuccess, loginFailure } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  private static readonly ALLOWED_PASSWORD = 'admin123';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (password === LoginComponent.ALLOWED_PASSWORD) {
        try {
          const user = { id: 'admin', name: email?.split?.('@')?.[0] || 'admin', email };
          const token = 'fake-token-' + Date.now();
          localStorage.setItem('auth_user', JSON.stringify(user));
          localStorage.setItem('auth_token', token);
          this.store.dispatch(login({ email, password }));
          this.store.dispatch(loginSuccess({ user, token }));
          this.snackBar.open('Logged in successfully', 'Close', { duration: 2000 });
          this.router.navigate(['/dashboard']);
        } catch (e: any) {
          this.store.dispatch(loginFailure({ error: 'Login failed' }));
          this.snackBar.open('Login failed. Please try again.', 'Close', { duration: 3000 });
        }
      } else {
        this.store.dispatch(loginFailure({ error: 'Invalid password' }));
        this.snackBar.open('Invalid password', 'Close', { duration: 3000 });
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
