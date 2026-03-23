import { Injectable, signal } from '@angular/core';
import { CanvasReservation } from './canvas.models';
import { GridSelection } from './buy-region-selection';

export interface ReservationDetailsDialogData {
    kind: 'reservation-details';
    reservation: CanvasReservation;
}

export interface BuyRegionSummaryDialogData {
    kind: 'buy-region-summary';
    selection: GridSelection;
}

export type DialogState = ReservationDetailsDialogData | BuyRegionSummaryDialogData;

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

    public openBuyRegionSummary(selection: GridSelection): void {
        this.activeDialogState.set({
            kind: 'buy-region-summary',
            selection,
        });
    }

    public close(): void {
        this.activeDialogState.set(null);
    }
}
