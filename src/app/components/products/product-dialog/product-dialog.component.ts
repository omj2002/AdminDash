import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  image: string;
}

@Component({
  selector: 'app-product-dialog',
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
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent {
  productForm: FormGroup;
  isEdit: boolean = false;

  categories = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Books', label: 'Books' },
    { value: 'Home', label: 'Home' }
  ];

  statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.isEdit = !!data;
    this.productForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [data?.description || '', [Validators.required, Validators.minLength(10)]],
      price: [data?.price || 0, [Validators.required, Validators.min(0)]],
      category: [data?.category || '', Validators.required],
      stock: [data?.stock || 0, [Validators.required, Validators.min(0)]],
      status: [data?.status || 'active', Validators.required],
      image: [data?.image || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEdit) {
        productData.id = this.data.id;
      }
      this.dialogRef.close(productData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
