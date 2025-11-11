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
import { selectPages, selectLoading } from '../../store/cms/cms.selectors';
import { loadPages, loadPagesSuccess, addPage, updatePage, deletePage } from '../../store/cms/cms.actions';
import { CmsDialogComponent } from './cms-dialog/cms-dialog.component';

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  content?: string;
}

@Component({
  selector: 'app-cms',
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
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'slug', 'author', 'status', 'createdAt', 'actions'];
  pages$: Observable<CmsPage[]>;
  loading$: Observable<boolean>;

  // no inline sample data

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dataService: DataService,
    private persistence: PersistenceService
  ) {
    this.pages$ = this.store.select(selectPages);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    // Load pages from localStorage or seed JSON
    this.persistence.loadList<CmsPage>('cms', '/data/cms.json').subscribe(pages => {
      this.store.dispatch(loadPagesSuccess({ pages }));
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'published': return 'primary';
      case 'draft': return 'warn';
      case 'archived': return 'accent';
      default: return 'primary';
    }
  }

  // New Page functionality
  createNewPage(): void {
    const dialogRef = this.dialog.open(CmsDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'create') {
        const newPage = this.createPageFromFormData(result.data);
        this.store.dispatch(addPage({ page: newPage }));
        this.snackBar.open('Page created successfully!', 'Close', {
          duration: 3000
        });
        console.log('Page created:', newPage);
        // Persist
        this.pages$.subscribe(list => {
          const updated = [...(list || []), newPage];
          this.persistence.saveList<CmsPage>('cms', updated);
        }).unsubscribe();
      }
    });
  }

  // Edit page
  editPage(page: CmsPage): void {
    const dialogRef = this.dialog.open(CmsDialogComponent, {
      width: '600px',
      data: { mode: 'edit', page: page }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'edit') {
        const updatedPage = { ...page, ...result.data, updatedAt: new Date().toISOString().split('T')[0] };
        this.store.dispatch(updatePage({ page: updatedPage }));
        this.snackBar.open(`Page ${page.title} updated successfully!`, 'Close', {
          duration: 3000
        });
        console.log('Page updated:', updatedPage);
        // Persist
        this.pages$.subscribe(list => {
          const updated = (list || []).map(p => p.id === page.id ? updatedPage : p);
          this.persistence.saveList<CmsPage>('cms', updated);
        }).unsubscribe();
      }
    });
  }

  // Preview page
  previewPage(page: CmsPage): void {
    const dialogRef = this.dialog.open(CmsDialogComponent, {
      width: '500px',
      data: { mode: 'preview', page: page }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Page previewed for:', page.title);
    });
  }

  // Delete page
  deletePage(page: CmsPage): void {
    const dialogRef = this.dialog.open(CmsDialogComponent, {
      width: '400px',
      data: { mode: 'delete', page: page }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.store.dispatch(deletePage({ id: page.id }));
        this.snackBar.open(`Page ${page.title} deleted successfully!`, 'Close', {
          duration: 3000
        });
        console.log('Page deleted:', page);
        // Persist
        this.pages$.subscribe(list => {
          const updated = (list || []).filter(p => p.id !== page.id);
          this.persistence.saveList<CmsPage>('cms', updated);
        }).unsubscribe();
      }
    });
  }

  // Helper method to create page from form data
  private createPageFromFormData(formData: any): CmsPage {
    const id = this.generatePageId();
    const currentDate = new Date().toISOString().split('T')[0];
    
    return {
      id: id,
      title: formData.title,
      slug: formData.slug,
      status: formData.status,
      author: formData.author,
      createdAt: currentDate,
      updatedAt: currentDate,
      content: formData.content
    };
  }

  // Generate unique page ID
  private generatePageId(): string {
    let currentCount = 0;
    this.pages$.subscribe(pages => {
      currentCount = pages.length;
    }).unsubscribe();
    return (currentCount + 1).toString();
  }
}
