import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PaymentDialogData {
  payment?: any;
  mode: 'process' | 'view' | 'refund';
}

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="payment-dialog">
      <h2 mat-dialog-title>
        <mat-icon>{{ getDialogIcon() }}</mat-icon>
        {{ getDialogTitle() }}
      </h2>
      
      <mat-dialog-content>
        <div *ngIf="data.mode === 'view' && data.payment" class="payment-details">
          <mat-card>
            <mat-card-content>
              <div class="detail-row">
                <strong>Transaction ID:</strong> {{ data.payment.transactionId }}
              </div>
              <div class="detail-row">
                <strong>Customer:</strong> {{ data.payment.customerName }}
              </div>
              <div class="detail-row">
                <strong>Amount:</strong> {{ data.payment.amount | currency:'USD':'symbol':'1.2-2' }}
              </div>
              <div class="detail-row">
                <strong>Method:</strong> {{ data.payment.method }}
              </div>
              <div class="detail-row">
                <strong>Status:</strong> 
                <span [class]="'status-' + data.payment.status">{{ data.payment.status | titlecase }}</span>
              </div>
              <div class="detail-row">
                <strong>Date:</strong> {{ data.payment.createdAt | date:'MMM dd, yyyy HH:mm' }}
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div *ngIf="data.mode === 'process'" class="payment-form">
          <form [formGroup]="paymentForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Customer Name</mat-label>
              <input matInput formControlName="customerName" placeholder="Enter customer name">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Amount</mat-label>
              <input matInput type="number" formControlName="amount" placeholder="Enter amount">
              <span matPrefix>$&nbsp;</span>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Payment Method</mat-label>
              <mat-select formControlName="method">
                <mat-option value="Credit Card">Credit Card</mat-option>
                <mat-option value="PayPal">PayPal</mat-option>
                <mat-option value="Bank Transfer">Bank Transfer</mat-option>
                <mat-option value="Cash">Cash</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" placeholder="Payment description (optional)"></textarea>
            </mat-form-field>
          </form>
        </div>

        <div *ngIf="data.mode === 'refund' && data.payment" class="refund-form">
          <mat-card>
            <mat-card-content>
              <h3>Refund Details</h3>
              <div class="detail-row">
                <strong>Original Amount:</strong> {{ data.payment.amount | currency:'USD':'symbol':'1.2-2' }}
              </div>
              <div class="detail-row">
                <strong>Transaction ID:</strong> {{ data.payment.transactionId }}
              </div>
            </mat-card-content>
          </mat-card>
          
          <form [formGroup]="refundForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Refund Amount</mat-label>
              <input matInput type="number" formControlName="refundAmount" [max]="data.payment.amount" placeholder="Enter refund amount">
              <span matPrefix>$&nbsp;</span>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason</mat-label>
              <textarea matInput formControlName="reason" placeholder="Reason for refund"></textarea>
            </mat-form-field>
          </form>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onConfirm()" [disabled]="!isFormValid()">
          {{ getConfirmButtonText() }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .payment-dialog {
      min-width: 500px;
    }
    
    .payment-details .detail-row {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .status-completed {
      color: #4caf50;
      font-weight: bold;
    }
    
    .status-pending {
      color: #ff9800;
      font-weight: bold;
    }
    
    .status-failed {
      color: #f44336;
      font-weight: bold;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .refund-form {
      margin-top: 16px;
    }
    
    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class PaymentDialogComponent {
  paymentForm: FormGroup;
  refundForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      customerName: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      method: ['', Validators.required],
      description: ['']
    });

    this.refundForm = this.fb.group({
      refundAmount: ['', [Validators.required, Validators.min(0.01)]],
      reason: ['', Validators.required]
    });
  }

  getDialogTitle(): string {
    switch (this.data.mode) {
      case 'process': return 'Process New Payment';
      case 'view': return 'Payment Details';
      case 'refund': return 'Process Refund';
      default: return 'Payment';
    }
  }

  getDialogIcon(): string {
    switch (this.data.mode) {
      case 'process': return 'payment';
      case 'view': return 'visibility';
      case 'refund': return 'refresh';
      default: return 'payment';
    }
  }

  getConfirmButtonText(): string {
    switch (this.data.mode) {
      case 'process': return 'Process Payment';
      case 'view': return 'Close';
      case 'refund': return 'Process Refund';
      default: return 'Confirm';
    }
  }

  isFormValid(): boolean {
    if (this.data.mode === 'view') return true;
    if (this.data.mode === 'process') return this.paymentForm.valid;
    if (this.data.mode === 'refund') return this.refundForm.valid;
    return false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.data.mode === 'view') {
      this.dialogRef.close();
    } else if (this.data.mode === 'process') {
      const paymentData = this.paymentForm.value;
      this.dialogRef.close({ action: 'process', data: paymentData });
    } else if (this.data.mode === 'refund') {
      const refundData = this.refundForm.value;
      this.dialogRef.close({ action: 'refund', data: refundData });
    }
  }
}
