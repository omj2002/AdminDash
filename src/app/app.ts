import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginSuccess } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ecommerce-admin');

  constructor(private store: Store) {}

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    const userRaw = localStorage.getItem('auth_user');
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        this.store.dispatch(loginSuccess({ user, token }));
      } catch {}
    }
  }
}
