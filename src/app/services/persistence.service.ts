import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  constructor(private http: HttpClient) {}

  loadList<T>(storageKey: string, seedUrl: string): Observable<T[]> {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        return of(JSON.parse(cached) as T[]);
      } catch {
        // fallthrough to fetch
      }
    }
    return this.http.get<T[]>(seedUrl).pipe(
      map(list => {
        localStorage.setItem(storageKey, JSON.stringify(list || []));
        return list || [];
      }),
      catchError(() => of([] as T[]))
    );
  }

  saveList<T>(storageKey: string, list: T[]): void {
    localStorage.setItem(storageKey, JSON.stringify(list || []));
  }
}


