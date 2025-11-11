import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-revenue-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    BaseChartDirective
  ],
  templateUrl: './revenue-details.component.html',
  styleUrls: ['./revenue-details.component.scss']
})
export class RevenueDetailsComponent implements OnInit {

  // Revenue by Category with detailed breakdown
  revenueByCategory = [
    { category: 'Electronics', revenue: 45000, percentage: 35.2, growth: 15.3, color: '#667eea', orders: 1250, avgOrderValue: 36.00 },
    { category: 'Clothing', revenue: 32000, percentage: 25.0, growth: 8.7, color: '#764ba2', orders: 980, avgOrderValue: 32.65 },
    { category: 'Books', revenue: 28000, percentage: 21.9, growth: 12.1, color: '#f093fb', orders: 850, avgOrderValue: 32.94 },
    { category: 'Home & Garden', revenue: 22000, percentage: 17.2, growth: 5.4, color: '#f5576c', orders: 650, avgOrderValue: 33.85 },
    { category: 'Sports', revenue: 15000, percentage: 11.7, growth: 22.8, color: '#4facfe', orders: 420, avgOrderValue: 35.71 }
  ];

  // Revenue Chart Data
  revenueChartData: ChartConfiguration<'doughnut'>['data'] = {
    datasets: [
      {
        data: [45000, 32000, 28000, 22000, 15000],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#f5576c',
          '#4facfe'
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ],
    labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
  };

  revenueChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Revenue Bar Chart Data
  revenueBarChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [45000, 32000, 28000, 22000, 15000],
        label: 'Revenue',
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(240, 147, 251, 0.8)',
          'rgba(245, 87, 108, 0.8)',
          'rgba(79, 172, 254, 0.8)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(118, 75, 162, 1)',
          'rgba(240, 147, 251, 1)',
          'rgba(245, 87, 108, 1)',
          'rgba(79, 172, 254, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ],
    labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
  };

  revenueBarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context) {
            return `${context.label}: $${context.parsed?.y?.toLocaleString() || '0'}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  displayedColumns: string[] = ['category', 'revenue', 'percentage', 'growth', 'orders', 'avgOrderValue'];

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('Revenue Details page loaded');
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getGrowthColor(growth: number): string {
    if (growth > 15) return 'primary';
    if (growth > 10) return 'accent';
    return 'warn';
  }

  getGrowthIcon(growth: number): string {
    if (growth > 0) return 'trending_up';
    if (growth < 0) return 'trending_down';
    return 'trending_flat';
  }

  getTotalRevenue(): number {
    return this.revenueByCategory.reduce((sum, cat) => sum + cat.revenue, 0);
  }

  getTopCategory(): any {
    return this.revenueByCategory.reduce((top, cat) => cat.revenue > top.revenue ? cat : top);
  }
}
