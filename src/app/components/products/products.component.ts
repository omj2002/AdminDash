import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
import { MatBadgeModule } from '@angular/material/badge';
import { Store } from '@ngrx/store';
import { DataService } from '../../services/data.service';
import { PersistenceService } from '../../services/persistence.service';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.reducer';
import { selectProducts, selectLoading } from '../../store/product/product.selectors';
import { loadProducts, deleteProduct, addProduct, updateProduct, loadProductsSuccess } from '../../store/product/product.actions';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  image: string;
  createdAt: string;
}

@Component({
  selector: 'app-products',
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
    MatSnackBarModule,
    MatBadgeModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['image', 'name', 'category', 'price', 'stock', 'status', 'actions'];
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  categoryFilter: string = 'all';
  statusFilter: string = 'all';

  // no inline sample data

  categories = ['Electronics', 'Sports', 'Clothing', 'Books', 'Home'];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private dataService: DataService,
    private persistence: PersistenceService
  ) {
    this.products$ = this.store.select(selectProducts);
    this.loading$ = this.store.select(selectLoading);
  }

  filteredProducts: Product[] = [];

  ngOnInit(): void {
    // Load products from localStorage or seed JSON
    this.persistence.loadList<Product>('products', '/data/products.json').subscribe(products => {
      this.store.dispatch(loadProductsSuccess({ products }));
    });
    
    // Subscribe to products from store and apply filters
    this.products$.subscribe(products => {
      const allProducts = products || [];
      this.filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                             product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesCategory = this.categoryFilter === 'all' || product.category === this.categoryFilter;
        const matchesStatus = this.statusFilter === 'all' || product.status === this.statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
    });
  }

  // removed inline seeding

  openProductDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (product) {
          // Update existing product
          this.store.dispatch(updateProduct({ product: result }));
          this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
        } else {
          // Add new product
          const newProduct = {
            ...result,
            id: this.generateProductId(),
            createdAt: new Date().toISOString().split('T')[0]
          };
          this.store.dispatch(addProduct({ product: newProduct }));
          this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
          // Persist
          this.products$.subscribe(list => {
            const updated = [...(list || []), newProduct];
            this.persistence.saveList<Product>('products', updated);
          }).unsubscribe();
        }
      }
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.store.dispatch(deleteProduct({ id: product.id }));
      this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
      // Persist
      this.products$.subscribe(list => {
        const updated = (list || []).filter(p => p.id !== product.id);
        this.persistence.saveList<Product>('products', updated);
      }).unsubscribe();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'out_of_stock': return 'accent';
      default: return 'primary';
    }
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  }

  getStockColor(stock: number): string {
    if (stock === 0) return 'warn';
    if (stock < 10) return 'accent';
    return 'primary';
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private generateProductId(): string {
    return 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.products$.subscribe(products => {
      const allProducts = products || [];
      this.filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                             product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesCategory = this.categoryFilter === 'all' || product.category === this.categoryFilter;
        const matchesStatus = this.statusFilter === 'all' || product.status === this.statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
    });
  }
}
