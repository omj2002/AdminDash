import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  items: OrderItem[];
  total: number;
}

@Component({
  selector: 'app-order-dialog',
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
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent {
  orderForm: FormGroup;
  isEdit: boolean = false;
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total', 'actions'];

  sampleItems: OrderItem[] = [
    { id: '1', name: 'Wireless Headphones', quantity: 1, price: 199.99, total: 199.99 },
    { id: '2', name: 'Smart Watch', quantity: 1, price: 299.99, total: 299.99 }
  ];

  statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {
    this.isEdit = !!data;
    this.orderForm = this.fb.group({
      orderNumber: [data?.orderNumber || '', [Validators.required]],
      customerName: [data?.customerName || '', [Validators.required, Validators.minLength(2)]],
      customerEmail: [data?.customerEmail || '', [Validators.required, Validators.email]],
      status: [data?.status || 'pending', Validators.required]
    });
  }

  get totalAmount(): number {
    return this.sampleItems.reduce((sum, item) => sum + item.total, 0);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const orderData = {
        ...this.orderForm.value,
        items: this.sampleItems,
        total: this.totalAmount
      };
      if (this.isEdit) {
        orderData.id = this.data.id;
      }
      this.dialogRef.close(orderData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  removeItem(item: OrderItem): void {
    const index = this.sampleItems.indexOf(item);
    if (index > -1) {
      this.sampleItems.splice(index, 1);
    }
  }
}
