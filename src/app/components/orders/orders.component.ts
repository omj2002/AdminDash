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
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { DataService } from '../../services/data.service';
import { PersistenceService } from '../../services/persistence.service';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.reducer';
import { selectOrders, selectLoading } from '../../store/order/order.selectors';
import { loadOrders, updateOrderStatus, addOrder, updateOrder, deleteOrder, loadOrdersSuccess } from '../../store/order/order.actions';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  items: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-orders',
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
    MatBadgeModule,
    MatTabsModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['orderNumber', 'customer', 'total', 'items', 'status', 'createdAt', 'actions'];
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  searchTerm: string = '';
  statusFilter: string = 'all';
  selectedTab: number = 0;

  // no inline sample data

  statusTabs = [
    { label: 'All Orders', value: 'all', count: 0 },
    { label: 'Pending', value: 'pending', count: 0 },
    { label: 'Processing', value: 'processing', count: 0 },
    { label: 'Shipped', value: 'shipped', count: 0 },
    { label: 'Delivered', value: 'delivered', count: 0 },
    { label: 'Cancelled', value: 'cancelled', count: 0 }
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private dataService: DataService,
    private persistence: PersistenceService
  ) {
    this.orders$ = this.store.select(selectOrders);
    this.loading$ = this.store.select(selectLoading);
  }

  filteredOrders: Order[] = [];

  ngOnInit(): void {
    // Load orders from localStorage or seed JSON
    this.persistence.loadList<Order>('orders', '/data/orders.json').subscribe(orders => {
      this.store.dispatch(loadOrdersSuccess({ orders }));
    });
    
    // Subscribe to orders from store and apply filters
    this.orders$.subscribe(orders => {
      const allOrders = orders || [];
      this.filteredOrders = allOrders.filter(order => {
        const matchesSearch = this.searchTerm ? (
          order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(this.searchTerm.toLowerCase())
        ) : true;
        
        const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
        
        return matchesSearch && matchesStatus;
      });
      this.updateStatusCounts(allOrders);
    });
  }

  // removed inline seeding

  updateStatusCounts(orders: Order[]): void {
    this.statusTabs.forEach(tab => {
      if (tab.value === 'all') {
        tab.count = orders.length;
      } else {
        tab.count = orders.filter(order => order.status === tab.value).length;
      }
    });
  }


  openOrderDialog(order?: Order): void {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '800px',
      data: order
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (order) {
          // Normalize and update existing order
          const itemsCount = Array.isArray(result.items) ? result.items.length : (typeof result.items === 'number' ? result.items : 0);
          const totalAmount = typeof result.total === 'number' ? result.total : parseFloat(result.total) || 0;
          const updatedOrder: Order = {
            ...order,
            ...result,
            items: itemsCount,
            total: totalAmount,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          this.store.dispatch(updateOrder({ order: updatedOrder }));
          this.snackBar.open('Order updated successfully', 'Close', { duration: 3000 });
          // Persist
          this.orders$.subscribe(list => {
            const updated = (list || []).map(o => o.id === updatedOrder.id ? updatedOrder : o);
            this.persistence.saveList<Order>('orders', updated);
          }).unsubscribe();
        } else {
          // Add new order
          const itemsCount = Array.isArray(result.items) ? result.items.length : (typeof result.items === 'number' ? result.items : 0);
          const totalAmount = typeof result.total === 'number' ? result.total : parseFloat(result.total) || 0;
          const newOrder: Order = {
            ...result,
            items: itemsCount,
            total: totalAmount,
            id: this.generateOrderId(),
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          };
          this.store.dispatch(addOrder({ order: newOrder }));
          this.snackBar.open('Order created successfully', 'Close', { duration: 3000 });
          // Persist
          this.orders$.subscribe(list => {
            const updated = [...(list || []), newOrder];
            this.persistence.saveList<Order>('orders', updated);
          }).unsubscribe();
        }
      }
    });
  }

  updateStatus(order: Order, newStatus: string): void {
    this.store.dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
    this.snackBar.open(`Order status updated to ${newStatus}`, 'Close', { duration: 3000 });
    // Status counts will be updated automatically through the store subscription
    // Persist
    this.orders$.subscribe(list => {
      const updated = (list || []).map(o => o.id === order.id ? { ...o, status: newStatus } : o);
      this.persistence.saveList<Order>('orders', updated);
    }).unsubscribe();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'processing': return 'accent';
      case 'shipped': return 'primary';
      case 'delivered': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'autorenew';
      case 'shipped': return 'local_shipping';
      case 'delivered': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private generateOrderId(): string {
    return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.statusFilter = this.statusTabs[index].value;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.orders$.subscribe(orders => {
      const allOrders = orders || [];
      this.filteredOrders = allOrders.filter(order => {
        const matchesSearch = this.searchTerm ? (
          order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(this.searchTerm.toLowerCase())
        ) : true;
        
        const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
        
        return matchesSearch && matchesStatus;
      });
      this.updateStatusCounts(allOrders);
    });
  }
}
