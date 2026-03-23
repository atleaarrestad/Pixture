import { type CanvasReservation } from './canvas.models';
import { buildSelectionFromCells, validateSelection } from './buy-region-selection';

describe('buy-region-selection', () => {
    const reservations: CanvasReservation[] = [
        {
            reservationId: 'reservation-1',
            title: 'Reserved block',
            ownerDisplayName: 'Pixture Team',
            x: 20,
            y: 20,
            width: 20,
            height: 20,
            accentColor: '#8a5cff',
            isReserved: true,
        },
    ];

    it('builds a snapped rectangle from two grid cells', () => {
        const selection = buildSelectionFromCells({ column: 1, row: 2 }, { column: 3, row: 4 });

        expect(selection).toEqual({
            x: 10,
            y: 20,
            width: 30,
            height: 30,
            widthInChunks: 3,
            heightInChunks: 3,
            chunkCount: 9,
        });
    });

    it('rejects selections that overlap an existing reservation', () => {
        const selection = validateSelection(
            buildSelectionFromCells({ column: 2, row: 2 }, { column: 3, row: 3 }),
            reservations,
        );

        expect(selection.isValid).toBe(false);
        expect(selection.reason).toContain('overlaps');
    });

    it('rejects selections larger than the 100x100 pixel limit', () => {
        const selection = validateSelection(
            buildSelectionFromCells({ column: 0, row: 0 }, { column: 24, row: 20 }),
            reservations,
        );

        expect(selection.isValid).toBe(false);
        expect(selection.reason).toContain('50,000');
    });

    it('allows large selections that stay within the 50,000 pixel pricing cap', () => {
        const selection = validateSelection(
            buildSelectionFromCells({ column: 0, row: 0 }, { column: 19, row: 19 }),
            [],
        );

        expect(selection.isValid).toBe(true);
        expect(selection.width * selection.height).toBe(40_000);
    });

    it('allows selections that only touch a reserved region edge', () => {
        const selection = validateSelection(
            buildSelectionFromCells({ column: 4, row: 2 }, { column: 4, row: 3 }),
            reservations,
        );

        expect(selection.isValid).toBe(true);
        expect(selection.reason).toBeNull();
    });
});
