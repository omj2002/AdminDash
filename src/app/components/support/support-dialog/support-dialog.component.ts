import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface SupportDialogData {
  ticket?: any;
  mode: 'create' | 'view' | 'reply' | 'close';
}

@Component({
  selector: 'app-support-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="support-dialog">
      <h2 mat-dialog-title>
        <mat-icon>{{ getDialogIcon() }}</mat-icon>
        {{ getDialogTitle() }}
      </h2>
      
      <mat-dialog-content>
        <div *ngIf="data.mode === 'view' && data.ticket" class="ticket-details">
          <mat-card>
            <mat-card-content>
              <div class="detail-row">
                <strong>Ticket Number:</strong> {{ data.ticket.ticketNumber }}
              </div>
              <div class="detail-row">
                <strong>Subject:</strong> {{ data.ticket.subject }}
              </div>
              <div class="detail-row">
                <strong>Customer:</strong> {{ data.ticket.customerName }}
              </div>
              <div class="detail-row">
                <strong>Priority:</strong> 
                <mat-chip [color]="getPriorityColor(data.ticket.priority)" selected>
                  {{ data.ticket.priority | titlecase }}
                </mat-chip>
              </div>
              <div class="detail-row">
                <strong>Status:</strong> 
                <mat-chip [color]="getStatusColor(data.ticket.status)" selected>
                  {{ data.ticket.status | titlecase }}
                </mat-chip>
              </div>
              <div class="detail-row">
                <strong>Created:</strong> {{ data.ticket.createdAt | date:'MMM dd, yyyy HH:mm' }}
              </div>
              <div class="detail-row">
                <strong>Description:</strong>
                <p>{{ data.ticket.description || 'No description provided' }}</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div *ngIf="data.mode === 'create'" class="ticket-form">
          <form [formGroup]="ticketForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Subject</mat-label>
              <input matInput formControlName="subject" placeholder="Enter ticket subject">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Customer Name</mat-label>
              <input matInput formControlName="customerName" placeholder="Enter customer name">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" placeholder="Describe the issue" rows="4"></textarea>
            </mat-form-field>
          </form>
        </div>

        <div *ngIf="data.mode === 'reply' && data.ticket" class="reply-form">
          <mat-card>
            <mat-card-content>
              <h3>Reply to {{ data.ticket.ticketNumber }}</h3>
              <div class="ticket-info">
                <strong>Subject:</strong> {{ data.ticket.subject }}
              </div>
            </mat-card-content>
          </mat-card>
          
          <form [formGroup]="replyForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reply Message</mat-label>
              <textarea matInput formControlName="message" placeholder="Type your reply here" rows="4"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status Update</mat-label>
              <mat-select formControlName="status">
                <mat-option value="open">Open</mat-option>
                <mat-option value="in_progress">In Progress</mat-option>
                <mat-option value="resolved">Resolved</mat-option>
              </mat-select>
            </mat-form-field>
          </form>
        </div>

        <div *ngIf="data.mode === 'close' && data.ticket" class="close-form">
          <mat-card>
            <mat-card-content>
              <h3>Close Ticket {{ data.ticket.ticketNumber }}</h3>
              <div class="ticket-info">
                <strong>Subject:</strong> {{ data.ticket.subject }}
                <br>
                <strong>Current Status:</strong> 
                <mat-chip [color]="getStatusColor(data.ticket.status)" selected>
                  {{ data.ticket.status | titlecase }}
                </mat-chip>
              </div>
            </mat-card-content>
          </mat-card>
          
          <form [formGroup]="closeForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Resolution Notes</mat-label>
              <textarea matInput formControlName="resolution" placeholder="Describe how the issue was resolved" rows="3"></textarea>
            </mat-form-field>
          </form>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onConfirm()" [disabled]="!isFormValid()">
          {{ getConfirmButtonText() }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .support-dialog {
      min-width: 500px;
    }
    
    .ticket-details .detail-row {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .ticket-details .detail-row:last-child {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .ticket-details .detail-row p {
      margin: 8px 0 0 0;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .reply-form, .close-form {
      margin-top: 16px;
    }
    
    .ticket-info {
      margin-bottom: 16px;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class SupportDialogComponent {
  ticketForm: FormGroup;
  replyForm: FormGroup;
  closeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SupportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SupportDialogData,
    private fb: FormBuilder
  ) {
    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      customerName: ['', Validators.required],
      priority: ['medium', Validators.required],
      description: ['', Validators.required]
    });

    this.replyForm = this.fb.group({
      message: ['', Validators.required],
      status: [this.data.ticket?.status || 'open', Validators.required]
    });

    this.closeForm = this.fb.group({
      resolution: ['', Validators.required]
    });
  }

  getDialogTitle(): string {
    switch (this.data.mode) {
      case 'create': return 'Create New Ticket';
      case 'view': return 'Ticket Details';
      case 'reply': return 'Reply to Ticket';
      case 'close': return 'Close Ticket';
      default: return 'Support Ticket';
    }
  }

  getDialogIcon(): string {
    switch (this.data.mode) {
      case 'create': return 'add';
      case 'view': return 'visibility';
      case 'reply': return 'reply';
      case 'close': return 'close';
      default: return 'support';
    }
  }

  getConfirmButtonText(): string {
    switch (this.data.mode) {
      case 'create': return 'Create Ticket';
      case 'view': return 'Close';
      case 'reply': return 'Send Reply';
      case 'close': return 'Close Ticket';
      default: return 'Confirm';
    }
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

  isFormValid(): boolean {
    if (this.data.mode === 'view') return true;
    if (this.data.mode === 'create') return this.ticketForm.valid;
    if (this.data.mode === 'reply') return this.replyForm.valid;
    if (this.data.mode === 'close') return this.closeForm.valid;
    return false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.data.mode === 'view') {
      this.dialogRef.close();
    } else if (this.data.mode === 'create') {
      const ticketData = this.ticketForm.value;
      this.dialogRef.close({ action: 'create', data: ticketData });
    } else if (this.data.mode === 'reply') {
      const replyData = this.replyForm.value;
      this.dialogRef.close({ action: 'reply', data: replyData });
    } else if (this.data.mode === 'close') {
      const closeData = this.closeForm.value;
      this.dialogRef.close({ action: 'close', data: closeData });
    }
  }
}
