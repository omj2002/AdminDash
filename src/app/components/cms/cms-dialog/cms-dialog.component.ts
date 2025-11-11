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

export interface CmsDialogData {
  page?: any;
  mode: 'create' | 'edit' | 'preview' | 'delete';
}

@Component({
  selector: 'app-cms-dialog',
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
    <div class="cms-dialog">
      <h2 mat-dialog-title>
        <mat-icon>{{ getDialogIcon() }}</mat-icon>
        {{ getDialogTitle() }}
      </h2>
      
      <mat-dialog-content>
        <div *ngIf="data.mode === 'preview' && data.page" class="page-preview">
          <mat-card>
            <mat-card-content>
              <h3>{{ data.page.title }}</h3>
              <div class="page-info">
                <div class="info-row">
                  <strong>Slug:</strong> {{ data.page.slug }}
                </div>
                <div class="info-row">
                  <strong>Status:</strong> 
                  <mat-chip [color]="getStatusColor(data.page.status)" selected>
                    {{ data.page.status | titlecase }}
                  </mat-chip>
                </div>
                <div class="info-row">
                  <strong>Author:</strong> {{ data.page.author }}
                </div>
                <div class="info-row">
                  <strong>Created:</strong> {{ data.page.createdAt | date:'MMM dd, yyyy' }}
                </div>
                <div class="info-row">
                  <strong>Updated:</strong> {{ data.page.updatedAt | date:'MMM dd, yyyy' }}
                </div>
              </div>
              <div class="content-preview">
                <h4>Content Preview:</h4>
                <div class="preview-content">
                  <p>{{ data.page.content || 'No content available for preview.' }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div *ngIf="data.mode === 'delete' && data.page" class="delete-confirmation">
          <mat-card>
            <mat-card-content>
              <h3>Delete Page</h3>
              <p>Are you sure you want to delete <strong>{{ data.page.title }}</strong>?</p>
              <div class="page-info">
                <div class="info-row">
                  <strong>Slug:</strong> {{ data.page.slug }}
                </div>
                <div class="info-row">
                  <strong>Status:</strong> 
                  <mat-chip [color]="getStatusColor(data.page.status)" selected>
                    {{ data.page.status | titlecase }}
                  </mat-chip>
                </div>
              </div>
              <p class="warning-text">This action cannot be undone.</p>
            </mat-card-content>
          </mat-card>
        </div>

        <div *ngIf="data.mode === 'create' || data.mode === 'edit'" class="page-form">
          <form [formGroup]="pageForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Page Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter page title">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Slug</mat-label>
              <input matInput formControlName="slug" placeholder="Enter page slug">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="draft">Draft</mat-option>
                <mat-option value="published">Published</mat-option>
                <mat-option value="archived">Archived</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Author</mat-label>
              <input matInput formControlName="author" placeholder="Enter author name">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Content</mat-label>
              <textarea matInput formControlName="content" placeholder="Enter page content" rows="6"></textarea>
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
    .cms-dialog {
      min-width: 500px;
    }
    
    .page-info .info-row {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .content-preview {
      margin-top: 16px;
    }
    
    .preview-content {
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      border-left: 4px solid #1976d2;
    }
    
    .warning-text {
      color: #f44336;
      font-weight: bold;
      margin-top: 16px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class CmsDialogComponent {
  pageForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CmsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CmsDialogData,
    private fb: FormBuilder
  ) {
    this.pageForm = this.fb.group({
      title: [this.data.page?.title || '', Validators.required],
      slug: [this.data.page?.slug || '', Validators.required],
      status: [this.data.page?.status || 'draft', Validators.required],
      author: [this.data.page?.author || '', Validators.required],
      content: [this.data.page?.content || '', Validators.required]
    });
  }

  getDialogTitle(): string {
    switch (this.data.mode) {
      case 'create': return 'Create New Page';
      case 'edit': return 'Edit Page';
      case 'preview': return 'Page Preview';
      case 'delete': return 'Delete Page';
      default: return 'CMS Page';
    }
  }

  getDialogIcon(): string {
    switch (this.data.mode) {
      case 'create': return 'add';
      case 'edit': return 'edit';
      case 'preview': return 'visibility';
      case 'delete': return 'delete';
      default: return 'web';
    }
  }

  getConfirmButtonText(): string {
    switch (this.data.mode) {
      case 'create': return 'Create Page';
      case 'edit': return 'Update Page';
      case 'preview': return 'Close';
      case 'delete': return 'Delete';
      default: return 'Confirm';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'published': return 'primary';
      case 'draft': return 'warn';
      case 'archived': return 'accent';
      default: return 'primary';
    }
  }

  isFormValid(): boolean {
    if (this.data.mode === 'preview') return true;
    if (this.data.mode === 'delete') return true;
    if (this.data.mode === 'create' || this.data.mode === 'edit') return this.pageForm.valid;
    return false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.data.mode === 'preview') {
      this.dialogRef.close();
    } else if (this.data.mode === 'delete') {
      this.dialogRef.close({ action: 'delete', data: this.data.page });
    } else if (this.data.mode === 'create' || this.data.mode === 'edit') {
      const pageData = this.pageForm.value;
      this.dialogRef.close({ action: this.data.mode, data: pageData });
    }
  }
}
