import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Enhanced Sales Chart Data (loaded from JSON)
  salesChartData: ChartConfiguration<'line'>['data'] = { datasets: [], labels: [] };

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

  // Enhanced Revenue by Category (Doughnut Chart)
  revenueChartData: ChartConfiguration<'doughnut'>['data'] = { datasets: [], labels: [] };

  // Revenue Bar Chart Data
  revenueBarChartData: ChartConfiguration<'bar'>['data'] = { datasets: [], labels: [] };

  // Monthly Revenue Bar Chart
  monthlyRevenueData: ChartConfiguration<'bar'>['data'] = { datasets: [], labels: [] };

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

  // Revenue Bar Chart Options
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

  // Monthly Revenue Bar Chart Options
  monthlyRevenueOptions: ChartOptions<'bar'> = {
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
            return `Revenue: $${context.parsed?.y?.toLocaleString() || '0'}`;
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

  // Test Chart Data (Simple)
  testChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: [
      {
        data: [10, 20, 30, 40, 50],
        label: 'Test Data',
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ],
    labels: ['A', 'B', 'C', 'D', 'E']
  };

  testChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Additional KPI Data
  salesMetrics: any = {};

  // Sales Overview Data
  salesOverview: any = {};

  // Revenue by Category with detailed breakdown
  revenueByCategory: any[] = [];

  // Sample Data
  recentOrders: any[] = [];

  topProducts: any[] = [];

  constructor(private router: Router, private dataService: DataService) { }

  // Export Data Methods
  exportSalesData(): void {
    const salesData = {
      title: 'Sales & Revenue Data',
      data: this.salesChartData,
      exportDate: new Date().toISOString(),
      summary: {
        totalRevenue: this.salesOverview.monthlySales,
        growth: this.salesMetrics.monthlyGrowth
      }
    };
    
    this.downloadJSON(salesData, 'sales-data.json');
    console.log('Sales data exported:', salesData);
  }

  exportRevenueData(): void {
    const revenueData = {
      title: 'Revenue by Category Data',
      data: this.revenueChartData,
      exportDate: new Date().toISOString(),
      summary: this.revenueByCategory
    };
    
    this.downloadJSON(revenueData, 'revenue-data.json');
    console.log('Revenue data exported:', revenueData);
  }

  exportBarChartData(): void {
    const barChartData = {
      title: 'Revenue by Category Bar Chart Data',
      data: this.revenueBarChartData,
      exportDate: new Date().toISOString(),
      summary: this.revenueByCategory
    };
    
    this.downloadJSON(barChartData, 'revenue-bar-chart-data.json');
    console.log('Bar chart data exported:', barChartData);
  }

  exportMonthlyData(): void {
    const monthlyData = {
      title: 'Monthly Revenue Data',
      data: this.monthlyRevenueData,
      exportDate: new Date().toISOString(),
      summary: {
        totalYearlyRevenue: this.salesOverview.yearlySales,
        averageMonthlyRevenue: this.salesOverview.monthlySales
      }
    };
    
    this.downloadJSON(monthlyData, 'monthly-revenue-data.json');
    console.log('Monthly data exported:', monthlyData);
  }

  // View Details Methods
  viewSalesDetails(): void {
    console.log('Navigating to sales details page...');
    this.router.navigate(['/sales-details']);
  }

  viewRevenueDetails(): void {
    console.log('Navigating to revenue details page...');
    this.router.navigate(['/revenue-details']);
  }

  viewBarChartDetails(): void {
    console.log('Navigating to revenue details page...');
    this.router.navigate(['/revenue-details']);
  }

  viewMonthlyDetails(): void {
    console.log('Navigating to sales details page...');
    this.router.navigate(['/sales-details']);
  }

  // Download Report Methods
  downloadSalesReport(): void {
    const report = this.generateSalesReport();
    this.downloadCSV(report, 'sales-report.csv');
    console.log('Sales report downloaded');
  }

  downloadRevenueReport(): void {
    const report = this.generateRevenueReport();
    this.downloadCSV(report, 'revenue-report.csv');
    console.log('Revenue report downloaded');
  }

  downloadFullReport(): void {
    const fullReport = this.generateFullReport();
    this.downloadJSON(fullReport, 'full-dashboard-report.json');
    console.log('Full report downloaded');
  }

  // View Full Report
  viewFullReport(): void {
    const fullReport = this.generateFullReport();
    this.showDetailsModal('Full Dashboard Report', fullReport);
  }

  // View All Methods
  viewAllOrders(): void {
    console.log('Navigating to orders page...');
    this.router.navigate(['/orders']);
  }

  viewAllProducts(): void {
    console.log('Navigating to products page...');
    this.router.navigate(['/products']);
  }

  // Helper Methods
  private downloadJSON(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private downloadCSV(data: string, filename: string): void {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private showDetailsModal(title: string, data: any): void {
    // In a real app, this would open a modal dialog
    console.log(`${title}:`, data);
    alert(`${title}\n\n${JSON.stringify(data, null, 2)}`);
  }

  private generateSalesReport(): string {
    const headers = 'Month,Revenue,Orders,Growth\n';
    const rows = this.salesChartData.labels?.map((month, index) => {
      const revenue = this.salesChartData.datasets?.[0]?.data?.[index] || 0;
      const orders = this.salesChartData.datasets?.[1]?.data?.[index] || 0;
      const growth = index > 0 ? 
        (((revenue as number) - (this.salesChartData.datasets?.[0]?.data?.[index - 1] as number || 0)) / (this.salesChartData.datasets?.[0]?.data?.[index - 1] as number || 1) * 100).toFixed(2) : '0';
      return `${month},${revenue},${orders},${growth}%`;
    }).join('\n') || '';
    
    return headers + rows;
  }

  private generateRevenueReport(): string {
    const headers = 'Category,Revenue,Percentage,Growth\n';
    const rows = this.revenueByCategory.map(cat => 
      `${cat.category},${cat.revenue},${cat.percentage}%,${cat.growth}%`
    ).join('\n');
    
    return headers + rows;
  }

  private generateFullReport(): any {
    return {
      title: 'Complete Dashboard Report',
      generatedAt: new Date().toISOString(),
      salesOverview: this.salesOverview,
      salesMetrics: this.salesMetrics,
      revenueByCategory: this.revenueByCategory,
      recentOrders: this.recentOrders,
      topProducts: this.topProducts,
      charts: {
        salesChart: this.salesChartData,
        revenueChart: this.revenueChartData,
        revenueBarChart: this.revenueBarChartData,
        monthlyRevenue: this.monthlyRevenueData
      }
    };
  }

  private getBestMonth(): string {
    const data = this.monthlyRevenueData.datasets[0].data;
    const validData = data.map(val => {
      if (Array.isArray(val)) return val[0];
      return val || 0;
    }).filter(val => val !== null) as number[];
    
    if (validData.length === 0) return 'Unknown';
    const maxValue = Math.max(...validData);
    const maxIndex = data.findIndex(val => {
      const numVal = Array.isArray(val) ? val[0] : (val || 0);
      return numVal === maxValue;
    });
    return this.monthlyRevenueData.labels?.[maxIndex]?.toString() || 'Unknown';
  }

  private getWorstMonth(): string {
    const data = this.monthlyRevenueData.datasets[0].data;
    const validData = data.map(val => {
      if (Array.isArray(val)) return val[0];
      return val || 0;
    }).filter(val => val !== null) as number[];
    
    if (validData.length === 0) return 'Unknown';
    const minValue = Math.min(...validData);
    const minIndex = data.findIndex(val => {
      const numVal = Array.isArray(val) ? val[0] : (val || 0);
      return numVal === minValue;
    });
    return this.monthlyRevenueData.labels?.[minIndex]?.toString() || 'Unknown';
  }

  ngOnInit(): void {
    this.dataService.getJson<any>('/data/dashboard.json').subscribe({
      next: (d) => {
        if (d?.salesChartData) this.salesChartData = d.salesChartData;
        if (d?.revenueChartData) this.revenueChartData = d.revenueChartData;
        if (d?.revenueBarChartData) this.revenueBarChartData = d.revenueBarChartData;
        if (d?.monthlyRevenueData) this.monthlyRevenueData = d.monthlyRevenueData;
        if (d?.salesMetrics) this.salesMetrics = d.salesMetrics;
        if (d?.salesOverview) this.salesOverview = d.salesOverview;
        if (d?.revenueByCategory) this.revenueByCategory = d.revenueByCategory;
        if (d?.recentOrders) this.recentOrders = d.recentOrders;
        if (d?.topProducts) this.topProducts = d.topProducts;
        this.testChartDataStructure();
      },
      error: () => {
        // Fallback silently keeps existing inline data
        this.testChartDataStructure();
      }
    });
  }

  testChartDataStructure(): void {
    console.log('Testing chart data structure:');
    console.log('Revenue Bar Chart Data:', {
      labels: this.revenueBarChartData.labels,
      datasets: this.revenueBarChartData.datasets?.length,
      dataLength: this.revenueBarChartData.datasets?.[0]?.data?.length
    });
    console.log('Monthly Revenue Data:', {
      labels: this.monthlyRevenueData.labels,
      datasets: this.monthlyRevenueData.datasets?.length,
      dataLength: this.monthlyRevenueData.datasets?.[0]?.data?.length
    });
  }

  getOrderStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'primary';
      case 'shipped':
        return 'accent';
      case 'processing':
        return 'warn';
      default:
        return 'warn';
    }
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }

    if (hasHalfStar) {
      stars.push('star_half');
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('star_border');
    }

    return stars;
  }
}