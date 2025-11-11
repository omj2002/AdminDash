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
import { selectTickets, selectLoading } from '../../store/support/support.selectors';
import { loadTickets, loadTicketsSuccess, addTicket, updateTicket } from '../../store/support/support.actions';
import { SupportDialogComponent } from './support-dialog/support-dialog.component';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  customerName: string;
  createdAt: string;
  description?: string;
}

@Component({
  selector: 'app-support',
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
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  displayedColumns: string[] = ['ticketNumber', 'subject', 'customerName', 'priority', 'status', 'createdAt', 'actions'];
  tickets$: Observable<SupportTicket[]>;
  loading$: Observable<boolean>;

  // no inline sample data

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private persistence: PersistenceService
  ) {
    this.tickets$ = this.store.select(selectTickets);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    // Load tickets from localStorage or seed JSON
    this.persistence.loadList<SupportTicket>('support', '/data/support.json').subscribe(tickets => {
      this.store.dispatch(loadTicketsSuccess({ tickets }));
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'open': return 'warn';
      case 'in_progress': return 'accent';
      case 'resolved': return 'primary';
      default: return 'primary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'warn';
      case 'medium': return 'accent';
      case 'low': return 'primary';
      default: return 'primary';
    }
  }

  // New Ticket functionality
  createNewTicket(): void {
    const dialogRef = this.dialog.open(SupportDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'create') {
        const newTicket = this.createTicketFromFormData(result.data);
        this.store.dispatch(addTicket({ ticket: newTicket }));
        this.snackBar.open('Ticket created successfully!', 'Close', {
          duration: 3000
        });
        console.log('Ticket created:', newTicket);
        // Persist
        this.tickets$.subscribe(list => {
          const updated = [...(list || []), newTicket];
          this.persistence.saveList<SupportTicket>('support', updated);
        }).unsubscribe();
      }
    });
  }

  // View ticket details
  viewTicketDetails(ticket: SupportTicket): void {
    const dialogRef = this.dialog.open(SupportDialogComponent, {
      width: '500px',
      data: { mode: 'view', ticket: ticket }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Ticket details viewed for:', ticket.ticketNumber);
    });
  }

  // Reply to ticket
  replyToTicket(ticket: SupportTicket): void {
    const dialogRef = this.dialog.open(SupportDialogComponent, {
      width: '600px',
      data: { mode: 'reply', ticket: ticket }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'reply') {
        this.snackBar.open(`Reply sent for ${ticket.ticketNumber}`, 'Close', {
          duration: 3000
        });
        console.log('Reply sent:', result.data);
        // TODO: Update ticket with reply
      }
    });
  }

  // Close ticket
  closeTicket(ticket: SupportTicket): void {
    if (ticket.status === 'open' || ticket.status === 'in_progress') {
      const dialogRef = this.dialog.open(SupportDialogComponent, {
        width: '500px',
        data: { mode: 'close', ticket: ticket }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action === 'close') {
          const updatedTicket = { ...ticket, status: 'resolved' };
          this.store.dispatch(updateTicket({ ticket: updatedTicket }));
          this.snackBar.open(`Ticket ${ticket.ticketNumber} closed successfully!`, 'Close', {
            duration: 3000
          });
          console.log('Ticket closed:', result.data);
          // Persist
          this.tickets$.subscribe(list => {
            const updated = (list || []).map(t => t.id === ticket.id ? { ...t, status: 'resolved' } : t);
            this.persistence.saveList<SupportTicket>('support', updated);
          }).unsubscribe();
        }
      });
    } else {
      this.snackBar.open('This ticket is already closed', 'Close', {
        duration: 3000
      });
    }
  }

  // Helper method to create ticket from form data
  private createTicketFromFormData(formData: any): SupportTicket {
    const id = this.generateTicketId();
    const ticketNumber = this.generateTicketNumber();
    
    return {
      id: id,
      ticketNumber: ticketNumber,
      subject: formData.subject,
      status: 'open',
      priority: formData.priority,
      customerName: formData.customerName,
      createdAt: new Date().toISOString().split('T')[0],
      description: formData.description
    };
  }

  // Generate unique ticket ID
  private generateTicketId(): string {
    let currentCount = 0;
    this.tickets$.subscribe(tickets => {
      currentCount = tickets.length;
    }).unsubscribe();
    return (currentCount + 1).toString();
  }

  // Generate unique ticket number
  private generateTicketNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TICKET-${timestamp}-${random}`;
  }
}
