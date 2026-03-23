import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CanvasApiService } from './canvas-api.service';
import {
    MAX_RESERVATION_SIZE,
    type GridCell,
    type SelectionValidation,
    RESERVATION_GRID_SIZE,
    buildSelectionFromCells,
    validateSelection,
} from './buy-region-selection';
import { CanvasReservation, CanvasSummary } from './canvas.models';
import { DialogService } from './dialog.service';
import { UiCardComponent } from './ui/ui-card.component';
import { UiSpinnerComponent } from './ui/ui-spinner.component';

@Component({
    selector: 'app-buy-region-page',
    imports: [UiCardComponent, UiSpinnerComponent],
    templateUrl: './buy-region-page.component.html',
    styleUrl: './buy-region-page.component.scss',
})
export class BuyRegionPageComponent {
    @ViewChild('boardStage')
    private boardStage?: ElementRef<HTMLDivElement>;

    private readonly canvasApi = inject(CanvasApiService);
    private readonly dialogService = inject(DialogService);

    protected readonly canvas = signal<CanvasSummary | null>(null);
    protected readonly reservations = signal<CanvasReservation[]>([]);
    protected readonly selectionPreview = signal<SelectionValidation | null>(null);
    protected readonly isLoading = signal(true);
    protected readonly loadError = signal<string | null>(null);
    protected readonly gridSize = RESERVATION_GRID_SIZE;
    protected readonly maxReservationSize = MAX_RESERVATION_SIZE;
    protected readonly imageUrl = computed(() => {
        const canvas = this.canvas();
        return canvas ? this.canvasApi.toAbsoluteUrl(canvas.imageUrl) : '';
    });
    protected readonly selectionStatus = computed(() => {
        const selection = this.selectionPreview();
        if (!selection) {
            return 'Drag across the board to choose a rectangle snapped to 10x10 chunks.';
        }

        return selection.isValid
            ? `Ready to reserve ${selection.width}x${selection.height} pixels (${selection.chunkCount} chunks). Release to review it.`
            : selection.reason ?? 'This selection is not available.';
    });

    private dragAnchor: GridCell | null = null;
    private isDragging = false;
    private lastResolvedCell: GridCell | null = null;

    public constructor() {
        void this.loadBoard();
    }

    @HostListener('document:mousemove', ['$event'])
    protected continueSelection(event: MouseEvent): void {
        if (!this.isDragging) {
            return;
        }

        const cell = this.resolveGridCell(event);
        if (cell) {
            this.updateSelection(cell);
        }
    }

    @HostListener('document:mouseup', ['$event'])
    protected finishSelection(event: MouseEvent): void {
        if (!this.isDragging) {
            return;
        }

        const cell = this.resolveGridCell(event) ?? this.lastResolvedCell;
        if (cell) {
            this.updateSelection(cell);
        }

        this.isDragging = false;
        this.dragAnchor = null;

        const selection = this.selectionPreview();
        if (selection?.isValid) {
            this.dialogService.openBuyRegionSummary(selection);
        }
    }

    protected beginSelection(event: MouseEvent): void {
        if (event.button !== 0) {
            return;
        }

        const cell = this.resolveGridCell(event);
        if (!cell) {
            return;
        }

        event.preventDefault();
        this.dragAnchor = cell;
        this.isDragging = true;
        this.updateSelection(cell);
    }

    protected rectangleLeft(rectangle: Pick<CanvasReservation, 'x'> | Pick<SelectionValidation, 'x'>): number {
        const canvas = this.canvas();
        return canvas ? (rectangle.x / canvas.width) * 100 : 0;
    }

    protected rectangleTop(rectangle: Pick<CanvasReservation, 'y'> | Pick<SelectionValidation, 'y'>): number {
        const canvas = this.canvas();
        return canvas ? (rectangle.y / canvas.height) * 100 : 0;
    }

    protected rectangleWidth(
        rectangle: Pick<CanvasReservation, 'width'> | Pick<SelectionValidation, 'width'>,
    ): number {
        const canvas = this.canvas();
        return canvas ? (rectangle.width / canvas.width) * 100 : 0;
    }

    protected rectangleHeight(
        rectangle: Pick<CanvasReservation, 'height'> | Pick<SelectionValidation, 'height'>,
    ): number {
        const canvas = this.canvas();
        return canvas ? (rectangle.height / canvas.height) * 100 : 0;
    }

    private async loadBoard(): Promise<void> {
        try {
            const [canvas, reservations] = await Promise.all([
                firstValueFrom(this.canvasApi.getCanvas()),
                firstValueFrom(this.canvasApi.getReservations()),
            ]);

            this.canvas.set(canvas);
            this.reservations.set(reservations);
        } catch {
            this.loadError.set('Could not load the board availability right now.');
        } finally {
            this.isLoading.set(false);
        }
    }

    private updateSelection(cell: GridCell): void {
        if (!this.dragAnchor) {
            return;
        }

        this.selectionPreview.set(
            validateSelection(buildSelectionFromCells(this.dragAnchor, cell), this.reservations()),
        );
    }

    private resolveGridCell(event: MouseEvent): GridCell | null {
        const canvas = this.canvas();
        const stage = this.boardStage?.nativeElement;
        if (!canvas || !stage) {
            return null;
        }

        const rect = stage.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
            return null;
        }

        const relativeX = this.clamp(event.clientX - rect.left, 0, rect.width);
        const relativeY = this.clamp(event.clientY - rect.top, 0, rect.height);
        const pixelX = Math.min(Math.floor((relativeX / rect.width) * canvas.width), canvas.width - 1);
        const pixelY = Math.min(Math.floor((relativeY / rect.height) * canvas.height), canvas.height - 1);

        const cell = {
            column: Math.floor(pixelX / RESERVATION_GRID_SIZE),
            row: Math.floor(pixelY / RESERVATION_GRID_SIZE),
        };

        this.lastResolvedCell = cell;
        return cell;
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
