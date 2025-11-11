import { createReducer, on } from '@ngrx/store';
import * as SupportActions from './support.actions';

export interface SupportState {
  tickets: any[];
  selectedTicket: any;
  loading: boolean;
  error: string | null;
}

export const initialState: SupportState = {
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null
};

export const supportReducer = createReducer(
  initialState,
  on(SupportActions.loadTickets, (state) => ({
    ...state,
    loading: true
  })),
  on(SupportActions.loadTicketsSuccess, (state, { tickets }) => ({
    ...state,
    tickets,
    loading: false
  })),
  on(SupportActions.loadTicketsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(SupportActions.addTicket, (state, { ticket }) => ({
    ...state,
    tickets: [...state.tickets, ticket]
  })),
  on(SupportActions.updateTicket, (state, { ticket }) => ({
    ...state,
    tickets: state.tickets.map(t => t.id === ticket.id ? ticket : t)
  }))
);
