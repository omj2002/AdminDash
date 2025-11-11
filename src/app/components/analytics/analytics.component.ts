import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.reducer';
import { selectDashboardData, selectLoading } from '../../store/analytics/analytics.selectors';
import { loadDashboardData, loadSalesData, loadUserData } from '../../store/analytics/analytics.actions';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule,
    MatTableModule,
    BaseChartDirective
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  dashboardData$: Observable<any>;
  loading$: Observable<boolean>;
  selectedPeriod: string = '30d';
  selectedTab: number = 0;

  // Sales Chart
  salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  salesChartData: ChartData<'line'> = { labels: [], datasets: [] };

  userChartData: ChartData<'line'> = { labels: [], datasets: [] };

  // User Growth Chart
  userGrowthChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  userGrowthChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Top Products Chart
  topProductsChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  // Conversion Funnel Chart
  conversionFunnelData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Top Products Table Data
  topProducts: any[] = [];

  // Recent Activity
  recentActivity: any[] = [];

  periods: any[] = [];

  // analytics dataset loaded from JSON
  analyticsData: any = {};

  constructor(private store: Store<AppState>, private dataService: DataService) {
    this.dashboardData$ = this.store.select(selectDashboardData);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadDashboardData());
    this.store.dispatch(loadSalesData());
    this.store.dispatch(loadUserData());
    
    // Try load analytics JSON
    this.dataService.getJson<any>('/data/analytics.json').subscribe({
      next: (d) => {
        if (d?.periods) this.periods = d.periods;
        if (d?.analyticsData) this.analyticsData = d.analyticsData;
        if (d?.topProducts) this.topProducts = d.topProducts;
        if (d?.recentActivity) this.recentActivity = d.recentActivity;
        this.updateChartsData();
      },
      error: () => {
        // no fallback
      }
    });
  }

  onPeriodChange(): void {
    // Update charts and data based on selected period
    this.updateChartsData();
  }

  updateChartsData(): void {
    const data = this.analyticsData ? this.analyticsData[this.selectedPeriod as keyof typeof this.analyticsData] : undefined;
    if (!data) return;
    
    // Update sales chart
    this.salesChartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.salesData,
          label: 'Sales',
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          fill: true
        }
      ]
    };

    // Update user chart
    this.userChartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.userData,
          label: 'Users',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: true
        }
      ]
    };
  }

  // Export functionality
  exportData(): void {
    const data = this.analyticsData[this.selectedPeriod as keyof typeof this.analyticsData];
    const exportData = {
      period: this.periods.find(p => p.value === this.selectedPeriod)?.label,
      revenue: data.revenue,
      orders: data.orders,
      users: data.users,
      conversion: data.conversion,
      salesData: data.salesData,
      userData: data.userData,
      labels: data.labels,
      exportDate: new Date().toISOString()
    };

    this.downloadJSON(exportData, `analytics-${this.selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`);
  }

  exportCSV(): void {
    const data = this.analyticsData[this.selectedPeriod as keyof typeof this.analyticsData];
    const csvData = this.convertToCSV(data);
    this.downloadCSV(csvData, `analytics-${this.selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
  }

  private downloadJSON(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any): string {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Revenue', data.revenue],
      ['Orders', data.orders],
      ['Users', data.users],
      ['Conversion Rate', data.conversion],
      ['', ''],
      ['Date', 'Sales', 'Users']
    ];

    // Add daily data
    data.labels.forEach((label: string, index: number) => {
      rows.push([label, data.salesData[index], data.userData[index]]);
    });

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'order': return 'shopping_cart';
      case 'user': return 'person_add';
      case 'payment': return 'payment';
      case 'product': return 'inventory';
      case 'support': return 'support_agent';
      default: return 'info';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'order': return 'primary';
      case 'user': return 'accent';
      case 'payment': return 'primary';
      case 'product': return 'warn';
      case 'support': return 'accent';
      default: return 'primary';
    }
  }
}
