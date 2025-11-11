import { createAction, props } from '@ngrx/store';

export const loadTickets = createAction('[Support] Load Tickets');
export const loadTicketsSuccess = createAction('[Support] Load Tickets Success', props<{ tickets: any[] }>());
export const loadTicketsFailure = createAction('[Support] Load Tickets Failure', props<{ error: string }>());
export const addTicket = createAction('[Support] Add Ticket', props<{ ticket: any }>());
export const createTicket = createAction('[Support] Create Ticket', props<{ ticket: any }>());
export const updateTicket = createAction('[Support] Update Ticket', props<{ ticket: any }>());
export const closeTicket = createAction('[Support] Close Ticket', props<{ id: string }>());
