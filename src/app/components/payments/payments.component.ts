import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatBadgeModule } from '@angular/material/badge';
import { Store } from '@ngrx/store';
import { DataService } from '../../services/data.service';
import { PersistenceService } from '../../services/persistence.service';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.reducer';
import { selectPayments, selectLoading } from '../../store/payment/payment.selectors';
import { loadPayments, addPayment, loadPaymentsSuccess } from '../../store/payment/payment.actions';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  status: string;
  method: string;
  customerName: string;
  createdAt: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
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
    MatSnackBarModule,
    MatBadgeModule
  ],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  displayedColumns: string[] = ['transactionId', 'customerName', 'amount', 'method', 'status', 'createdAt', 'actions'];
  payments$: Observable<Payment[]>;
  loading$: Observable<boolean>;

  // no inline sample data

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private persistence: PersistenceService
  ) {
    this.payments$ = this.store.select(selectPayments);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    // Load payments from localStorage or seed JSON
    this.persistence.loadList<Payment>('payments', '/data/payments.json').subscribe(payments => {
      this.store.dispatch(loadPaymentsSuccess({ payments }));
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'primary';
      case 'pending': return 'warn';
      case 'failed': return 'accent';
      default: return 'primary';
    }
  }

  // Process Payment functionality
  processPayment(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '600px',
      data: { mode: 'process' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'process') {
        const newPayment = this.createPaymentFromFormData(result.data);
        this.store.dispatch(addPayment({ payment: newPayment }));
        this.snackBar.open('Payment processed successfully!', 'Close', {
          duration: 3000
        });
        console.log('Payment processed:', newPayment);
        // Persist
        this.payments$.subscribe(list => {
          const updated = [...(list || []), newPayment];
          this.persistence.saveList<Payment>('payments', updated);
        }).unsubscribe();
      }
    });
  }

  // View payment details
  viewPaymentDetails(payment: Payment): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '500px',
      data: { mode: 'view', payment: payment }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Payment details viewed for:', payment.transactionId);
    });
  }

  // Refund payment
  refundPayment(payment: Payment): void {
    if (payment.status === 'completed') {
      const dialogRef = this.dialog.open(PaymentDialogComponent, {
        width: '600px',
        data: { mode: 'refund', payment: payment }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action === 'refund') {
          this.snackBar.open(`Refund processed for ${payment.transactionId}`, 'Close', {
            duration: 3000
          });
          console.log('Refund processed:', result.data);
          // Update and persist status locally as needed
          this.payments$.subscribe(list => {
            const updated = (list || []).map(p => p.id === payment.id ? { ...p, status: 'refunded' } : p);
            this.persistence.saveList<Payment>('payments', updated);
          }).unsubscribe();
        }
      });
    } else {
      this.snackBar.open('Only completed payments can be refunded', 'Close', {
        duration: 3000
      });
    }
  }

  // Helper method to create payment from form data
  private createPaymentFromFormData(formData: any): Payment {
    const id = this.generatePaymentId();
    const transactionId = this.generateTransactionId();
    
    return {
      id: id,
      transactionId: transactionId,
      amount: parseFloat(formData.amount),
      status: 'completed', // New payments are completed by default
      method: formData.method,
      customerName: formData.customerName,
      createdAt: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    };
  }

  // Generate unique payment ID
  private generatePaymentId(): string {
    // Get current payments count from store
    let currentCount = 0;
    this.payments$.subscribe(payments => {
      currentCount = payments.length;
    }).unsubscribe();
    return (currentCount + 1).toString();
  }

  // Generate unique transaction ID
  private generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN-${timestamp}-${random}`;
  }
}
