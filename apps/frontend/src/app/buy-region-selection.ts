import { CanvasReservation } from './canvas.models';

export interface GridCell {
    column: number;
    row: number;
}

export interface GridSelection {
    x: number;
    y: number;
    width: number;
    height: number;
    widthInChunks: number;
    heightInChunks: number;
    chunkCount: number;
}

export interface SelectionValidation extends GridSelection {
    isValid: boolean;
    reason: string | null;
}

export const RESERVATION_GRID_SIZE = 10;
export const MAX_RESERVATION_SIZE = 100;

export function buildSelectionFromCells(
    anchor: GridCell,
    current: GridCell,
    gridSize = RESERVATION_GRID_SIZE,
): GridSelection {
    const left = Math.min(anchor.column, current.column);
    const top = Math.min(anchor.row, current.row);
    const widthInChunks = Math.abs(anchor.column - current.column) + 1;
    const heightInChunks = Math.abs(anchor.row - current.row) + 1;

    return {
        x: left * gridSize,
        y: top * gridSize,
        width: widthInChunks * gridSize,
        height: heightInChunks * gridSize,
        widthInChunks,
        heightInChunks,
        chunkCount: widthInChunks * heightInChunks,
    };
}

export function validateSelection(
    selection: GridSelection,
    reservations: Pick<CanvasReservation, 'x' | 'y' | 'width' | 'height'>[],
    maxReservationSize = MAX_RESERVATION_SIZE,
): SelectionValidation {
    if (selection.width > maxReservationSize || selection.height > maxReservationSize) {
        return {
            ...selection,
            isValid: false,
            reason: `Selection can be at most ${maxReservationSize}x${maxReservationSize} pixels.`,
        };
    }

    if (reservations.some(reservation => rectanglesOverlap(selection, reservation))) {
        return {
            ...selection,
            isValid: false,
            reason: 'Selection overlaps an existing reserved region.',
        };
    }

    return {
        ...selection,
        isValid: true,
        reason: null,
    };
}

function rectanglesOverlap(
    left: Pick<GridSelection, 'x' | 'y' | 'width' | 'height'>,
    right: Pick<CanvasReservation, 'x' | 'y' | 'width' | 'height'>,
): boolean {
    return left.x < right.x + right.width
        && left.x + left.width > right.x
        && left.y < right.y + right.height
        && left.y + left.height > right.y;
}
