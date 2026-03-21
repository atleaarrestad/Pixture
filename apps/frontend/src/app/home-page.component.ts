import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CanvasApiService } from './canvas-api.service';
import { CanvasReservation, CanvasSummary } from './canvas.models';
import { UiCardComponent } from './ui/ui-card.component';
import { UiSpinnerComponent } from './ui/ui-spinner.component';

@Component({
    selector: 'app-home-page',
    imports: [RouterLink, UiCardComponent, UiSpinnerComponent],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
    private readonly canvasApi = inject(CanvasApiService);

    protected readonly canvas = signal<CanvasSummary | null>(null);
    protected readonly reservations = signal<CanvasReservation[]>([]);
    protected readonly hoveredReservationId = signal<string | null>(null);
    protected readonly selectedReservationId = signal<string | null>(null);
    protected readonly isLoading = signal(true);
    protected readonly loadError = signal<string | null>(null);
    protected readonly selectedReservation = computed(() => {
        const selectedId = this.selectedReservationId() ?? this.hoveredReservationId();
        return this.reservations().find(reservation => reservation.reservationId === selectedId) ?? null;
    });
    protected readonly imageUrl = computed(() => {
        const canvas = this.canvas();
        return canvas ? this.canvasApi.toAbsoluteUrl(canvas.imageUrl) : '';
    });

    public constructor() {
        void this.loadBoard();
    }

    protected reservationLeft(reservation: CanvasReservation): number {
        const canvas = this.canvas();
        return canvas ? (reservation.x / canvas.width) * 100 : 0;
    }

    protected reservationTop(reservation: CanvasReservation): number {
        const canvas = this.canvas();
        return canvas ? (reservation.y / canvas.height) * 100 : 0;
    }

    protected reservationWidth(reservation: CanvasReservation): number {
        const canvas = this.canvas();
        return canvas ? (reservation.width / canvas.width) * 100 : 0;
    }

    protected reservationHeight(reservation: CanvasReservation): number {
        const canvas = this.canvas();
        return canvas ? (reservation.height / canvas.height) * 100 : 0;
    }

    protected highlightReservation(reservationId: string | null): void {
        this.hoveredReservationId.set(reservationId);
    }

    protected selectReservation(reservationId: string): void {
        this.selectedReservationId.set(reservationId);
    }

    protected editorRoute(reservation: CanvasReservation): string {
        return `/reservations/${reservation.reservationId}/edit`;
    }

    protected hasExternalLink(reservation: CanvasReservation): boolean {
        return !!reservation.linkUrl;
    }

    private async loadBoard(): Promise<void> {
        try {
            const [canvas, reservations] = await Promise.all([
                firstValueFrom(this.canvasApi.getCanvas()),
                firstValueFrom(this.canvasApi.getReservations()),
            ]);

            this.canvas.set(canvas);
            this.reservations.set(reservations);
            this.selectedReservationId.set(reservations[0]?.reservationId ?? null);
        } catch {
            this.loadError.set('Could not load the public board yet.');
        } finally {
            this.isLoading.set(false);
        }
    }
}
