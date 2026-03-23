import { Injectable, signal } from '@angular/core';
import { CanvasReservation } from './canvas.models';

export interface ReservationDetailsDialogData {
    kind: 'reservation-details';
    reservation: CanvasReservation;
}

export type DialogState = ReservationDetailsDialogData;

@Injectable({ providedIn: 'root' })
export class DialogService {
    private readonly activeDialogState = signal<DialogState | null>(null);

    public readonly activeDialog = this.activeDialogState.asReadonly();

    public openReservationDetails(reservation: CanvasReservation): void {
        this.activeDialogState.set({
            kind: 'reservation-details',
            reservation,
        });
    }

    public close(): void {
        this.activeDialogState.set(null);
    }
}
