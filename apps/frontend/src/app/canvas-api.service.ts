import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    CanvasReservation,
    CanvasSummary,
    ReservationEditorData,
    UpdateReservationPixelsRequest,
    UpdateReservationPixelsResponse,
} from './canvas.models';

@Injectable({ providedIn: 'root' })
export class CanvasApiService {
    private readonly document = inject(DOCUMENT);
    private readonly http = inject(HttpClient);
    private readonly apiOrigin =
        this.document.defaultView?.location.port === '4200'
            ? 'http://localhost:5168'
            : this.document.defaultView?.location.origin ?? '';

    public getCanvas(): Observable<CanvasSummary> {
        return this.http.get<CanvasSummary>(this.buildUrl('/api/canvas'));
    }

    public getReservations(): Observable<CanvasReservation[]> {
        return this.http.get<CanvasReservation[]>(this.buildUrl('/api/canvas/reservations'));
    }

    public getReservationEditor(reservationId: string): Observable<ReservationEditorData> {
        return this.http.get<ReservationEditorData>(
            this.buildUrl(`/api/reservations/${reservationId}/editor`),
        );
    }

    public updateReservationPixels(
        reservationId: string,
        request: UpdateReservationPixelsRequest,
    ): Observable<UpdateReservationPixelsResponse> {
        return this.http.put<UpdateReservationPixelsResponse>(
            this.buildUrl(`/api/reservations/${reservationId}/pixels`),
            request,
        );
    }

    public toAbsoluteUrl(url: string): string {
        return url.startsWith('http') ? url : this.buildUrl(url);
    }

    private buildUrl(path: string): string {
        return `${this.apiOrigin}${path}`;
    }
}
