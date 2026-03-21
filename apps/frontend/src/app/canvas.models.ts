export interface CanvasSummary {
    width: number;
    height: number;
    imageUrl: string;
    renderVersion: string;
    updatedAt: string;
    reservationCount: number;
}

export interface CanvasReservation {
    reservationId: string;
    title: string;
    ownerDisplayName: string;
    x: number;
    y: number;
    width: number;
    height: number;
    accentColor: string;
    isReserved: boolean;
}

export interface ReservationEditorData {
    reservationId: string;
    title: string;
    ownerDisplayName: string;
    canvasWidth: number;
    canvasHeight: number;
    x: number;
    y: number;
    width: number;
    height: number;
    renderVersion: string;
    pixels: string[];
}

export interface PixelChange {
    x: number;
    y: number;
    colorHex: string;
}

export interface UpdateReservationPixelsRequest {
    changes: PixelChange[];
}

export interface UpdateReservationPixelsResponse {
    reservationId: string;
    renderVersion: string;
    updatedAt: string;
    appliedChanges: number;
}
