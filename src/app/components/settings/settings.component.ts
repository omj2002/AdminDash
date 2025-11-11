import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.reducer';
import { selectSettings, selectLoading } from '../../store/settings/settings.selectors';
import { loadSettings, updateSettings } from '../../store/settings/settings.actions';

@Component({
  selector: 'app-settings',
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
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings$: Observable<any>;
  loading$: Observable<boolean>;
  selectedTab: number = 0;

  generalForm: FormGroup;
  notificationForm: FormGroup;
  securityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.settings$ = this.store.select(selectSettings);
    this.loading$ = this.store.select(selectLoading);

    this.generalForm = this.fb.group({
      siteName: ['My E-commerce Store', Validators.required],
      siteDescription: ['Your one-stop shop for everything', Validators.required],
      currency: ['USD', Validators.required],
      timezone: ['UTC', Validators.required]
    });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false],
      pushNotifications: [true],
      orderUpdates: [true],
      marketingEmails: [false]
    });

    this.securityForm = this.fb.group({
      twoFactorAuth: [false],
      sessionTimeout: [30, Validators.required],
      passwordExpiry: [90, Validators.required],
      loginAttempts: [5, Validators.required]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadSettings());
  }

  onGeneralSubmit(): void {
    if (this.generalForm.valid) {
      this.store.dispatch(updateSettings({ settings: this.generalForm.value }));
      this.snackBar.open('General settings updated successfully', 'Close', { duration: 3000 });
    }
  }

  onNotificationSubmit(): void {
    if (this.notificationForm.valid) {
      this.store.dispatch(updateSettings({ settings: this.notificationForm.value }));
      this.snackBar.open('Notification settings updated successfully', 'Close', { duration: 3000 });
    }
  }

  onSecuritySubmit(): void {
    if (this.securityForm.valid) {
      this.store.dispatch(updateSettings({ settings: this.securityForm.value }));
      this.snackBar.open('Security settings updated successfully', 'Close', { duration: 3000 });
    }
  }
}
