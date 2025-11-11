import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { logout } from '../../store/auth/auth.actions';
import { ProfileDialogComponent } from '../auth/profile-dialog/profile-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isHandset$!: Observable<boolean>;

  navigationItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard', badge: null },
    { name: 'Users', icon: 'people', route: '/users', badge: null },
    { name: 'Products', icon: 'inventory_2', route: '/products', badge: null },
    { name: 'Orders', icon: 'shopping_cart', route: '/orders', badge: '5' },
    { name: 'Analytics', icon: 'analytics', route: '/analytics', badge: null },
    { name: 'Payments', icon: 'payment', route: '/payments', badge: null },
    { name: 'Support', icon: 'support_agent', route: '/support', badge: '3' },
    { name: 'CMS', icon: 'article', route: '/cms', badge: null },
    { name: 'Settings', icon: 'settings', route: '/settings', badge: null }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  openProfile(): void {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    this.dialog.open(ProfileDialogComponent, { width: '500px', data: { user } });
  }

  logout(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }
}
