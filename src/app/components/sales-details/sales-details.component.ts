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
  selector: 'app-sales-details',
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
  templateUrl: './sales-details.component.html',
  styleUrls: ['./sales-details.component.scss']
})
export class SalesDetailsComponent implements OnInit {

  // Sales data
  salesOverview = {
    todaySales: 12500,
    yesterdaySales: 11800,
    weeklySales: 87500,
    monthlySales: 245670,
    quarterlySales: 720000,
    yearlySales: 2800000
  };

  salesMetrics = {
    totalSales: 245670,
    monthlyGrowth: 12.5,
    averageOrderValue: 199.50,
    conversionRate: 3.2,
    customerRetention: 78.5,
    topSellingCategory: 'Electronics'
  };

  // Monthly sales data
  monthlySalesData = [
    { month: 'January', revenue: 12000, orders: 850, growth: 5.2 },
    { month: 'February', revenue: 15000, orders: 920, growth: 8.7 },
    { month: 'March', revenue: 18000, orders: 1100, growth: 12.3 },
    { month: 'April', revenue: 22000, orders: 1250, growth: 15.8 },
    { month: 'May', revenue: 19000, orders: 1080, growth: 9.4 },
    { month: 'June', revenue: 25000, orders: 1400, growth: 18.2 },
    { month: 'July', revenue: 28000, orders: 1550, growth: 22.1 },
    { month: 'August', revenue: 32000, orders: 1750, growth: 28.5 },
    { month: 'September', revenue: 29000, orders: 1620, growth: 19.8 },
    { month: 'October', revenue: 35000, orders: 1900, growth: 31.2 },
    { month: 'November', revenue: 38000, orders: 2050, growth: 35.7 },
    { month: 'December', revenue: 42000, orders: 2200, growth: 42.1 }
  ];

  // Chart data
  salesChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        data: [12000, 15000, 18000, 22000, 19000, 25000, 28000, 32000, 29000, 35000, 38000, 42000],
        label: 'Revenue',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      },
      {
        data: [8000, 9500, 12000, 14000, 13000, 16000, 18000, 20000, 19000, 22000, 24000, 26000],
        label: 'Orders',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  salesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
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
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
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
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  displayedColumns: string[] = ['month', 'revenue', 'orders', 'growth'];

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('Sales Details page loaded');
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getGrowthColor(growth: number): string {
    if (growth > 20) return 'primary';
    if (growth > 10) return 'accent';
    return 'warn';
  }

  getGrowthIcon(growth: number): string {
    if (growth > 0) return 'trending_up';
    if (growth < 0) return 'trending_down';
    return 'trending_flat';
  }
}
