import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    computed,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CanvasApiService } from './canvas-api.service';
import { ReservationEditorData } from './canvas.models';
import { UiButtonComponent } from './ui/ui-button.component';
import { UiCardComponent } from './ui/ui-card.component';
import { UiSliderComponent } from './ui/ui-slider.component';
import { UiSpinnerComponent } from './ui/ui-spinner.component';

interface RecentColorEntry {
    id: number;
    color: string;
}

type DrawTool = 'brush' | 'bucket' | 'line';

@Component({
    selector: 'app-reservation-editor-page',
    imports: [FormsModule, RouterLink, UiButtonComponent, UiCardComponent, UiSliderComponent, UiSpinnerComponent],
    templateUrl: './reservation-editor-page.component.html',
    styleUrl: './reservation-editor-page.component.scss',
})
export class ReservationEditorPageComponent implements AfterViewInit {
    @ViewChild('editorCanvas')
    private set editorCanvasRef(value: ElementRef<HTMLCanvasElement> | undefined) {
        this.editorCanvas = value;
        this.renderCanvas();
    }

    @ViewChild('customColorPicker')
    private customColorPicker?: ElementRef<HTMLInputElement>;

    private readonly route = inject(ActivatedRoute);
    private readonly canvasApi = inject(CanvasApiService);

    protected readonly editor = signal<ReservationEditorData | null>(null);
    protected readonly pixels = signal<string[]>([]);
    protected readonly selectedColor = signal('#ff7eb6');
    protected readonly linkUrl = signal('');
    protected readonly zoom = signal(30);
    protected readonly selectedTool = signal<DrawTool>('brush');
    protected readonly palette = ['#1f1633', '#fffdf8', '#ff7eb6', '#b9b2ff', '#8ed8f8', '#b9f2cf', '#ffd37a'];
    protected readonly recentColors = signal<RecentColorEntry[]>([]);
    protected readonly isLoading = signal(true);
    protected readonly isSaving = signal(false);
    protected readonly loadError = signal<string | null>(null);
    protected readonly saveMessage = signal<string | null>(null);
    protected readonly hasUnsavedChanges = computed(() => {
        const editor = this.editor();
        if (!editor) {
            return false;
        }

        const normalizedCurrentLink = this.normalizeLinkUrl(this.linkUrl());
        const normalizedSavedLink = this.normalizeLinkUrl(editor.linkUrl ?? '');

        return this.dirtyPixelCount() > 0 || normalizedCurrentLink !== normalizedSavedLink;
    });
    protected readonly dirtyPixelCount = computed(() => {
        const editor = this.editor();
        if (!editor) {
            return 0;
        }

        return this.pixels().reduce((count, color, index) => {
            return color === editor.pixels[index] ? count : count + 1;
        }, 0);
    });
    protected readonly toolStatus = computed(() => {
        const lineStart = this.lineStart();
        if (this.selectedTool() === 'line' && lineStart) {
            return `Line start ${lineStart.x}, ${lineStart.y}`;
        }

        switch (this.selectedTool()) {
            case 'bucket':
                return 'Bucket fill';
            case 'line':
                return 'Line tool';
            default:
                return 'Brush tool';
        }
    });

    private isPainting = false;
    private hasPendingStrokeSnapshot = false;
    private hasViewInitialized = false;
    private editorCanvas?: ElementRef<HTMLCanvasElement>;
    private readonly pixelHistory = signal<string[][]>([]);
    private readonly lineStart = signal<{ x: number; y: number } | null>(null);
    private nextRecentColorId = 1;

    public async ngAfterViewInit(): Promise<void> {
        this.hasViewInitialized = true;
        await this.loadEditor();
    }

    protected async save(): Promise<void> {
        const editor = this.editor();
        if (!editor || !this.hasUnsavedChanges() || this.isSaving()) {
            return;
        }

        const changes = this.pixels()
            .map((color, index) => ({ color, index }))
            .filter(item => item.color !== editor.pixels[item.index])
            .map(item => ({
                x: item.index % editor.width,
                y: Math.floor(item.index / editor.width),
                colorHex: item.color,
            }));

        this.isSaving.set(true);
        this.saveMessage.set(null);

        try {
            const response = await firstValueFrom(
                this.canvasApi.updateReservationPixels(editor.reservationId, {
                    changes,
                    linkUrl: this.normalizeLinkUrl(this.linkUrl()),
                }),
            );

            this.editor.set({
                ...editor,
                linkUrl: response.linkUrl ?? null,
                renderVersion: response.renderVersion,
                pixels: [...this.pixels()],
            });
            this.linkUrl.set(response.linkUrl ?? '');
            this.saveMessage.set(`Saved ${response.appliedChanges} pixel updates.`);
        } catch {
            this.saveMessage.set('Could not save this reservation right now.');
        } finally {
            this.isSaving.set(false);
        }
    }

    protected setZoom(zoom: number): void {
        this.zoom.set(zoom);
        this.renderCanvas();
    }

    protected selectTool(tool: DrawTool): void {
        this.selectedTool.set(tool);
        if (tool !== 'line') {
            this.lineStart.set(null);
        }
    }

    protected selectColor(color: string, remember = true): void {
        const normalizedColor = this.normalizeColor(color);
        this.selectedColor.set(normalizedColor);
        if (remember) {
            this.rememberRecentColor(normalizedColor);
        }
    }

    protected useRecentColor(color: string): void {
        this.selectColor(color, false);
    }

    protected openCustomColorPicker(): void {
        this.customColorPicker?.nativeElement.click();
    }

    protected applyCustomColor(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        if (element?.value) {
            this.selectColor(element.value);
        }
    }

    protected hasExternalLink(editor: ReservationEditorData): boolean {
        return !!editor.linkUrl;
    }

    protected canUndo(): boolean {
        return this.pixelHistory().length > 0;
    }

    protected undoLastStroke(): void {
        const history = this.pixelHistory();
        const previousPixels = history.at(-1);
        if (!previousPixels) {
            return;
        }

        this.pixelHistory.set(history.slice(0, -1));
        this.pixels.set([...previousPixels]);
        this.renderCanvas();
        this.saveMessage.set(null);
    }

    protected beginPaint(event: MouseEvent): void {
        const point = this.resolveCanvasPoint(event);
        if (!point) {
            return;
        }

        switch (this.selectedTool()) {
            case 'bucket':
                this.applyBucketFill(point.x, point.y);
                break;
            case 'line':
                this.applyLineTool(point.x, point.y);
                break;
            default:
                this.isPainting = true;
                this.hasPendingStrokeSnapshot = false;
                this.applyBrush(point.x, point.y);
                break;
        }
    }

    protected paintWhileDragging(event: MouseEvent): void {
        if (this.selectedTool() === 'brush' && this.isPainting && event.buttons === 1) {
            const point = this.resolveCanvasPoint(event);
            if (point) {
                this.applyBrush(point.x, point.y);
            }
        }
    }

    protected endPaint(): void {
        this.isPainting = false;
        this.hasPendingStrokeSnapshot = false;
    }

    private async loadEditor(): Promise<void> {
        const reservationId = this.route.snapshot.paramMap.get('reservationId');
        if (!reservationId) {
            this.loadError.set('Missing reservation id.');
            this.isLoading.set(false);
            return;
        }

        try {
            const editor = await firstValueFrom(this.canvasApi.getReservationEditor(reservationId));
            this.editor.set(editor);
            this.pixels.set([...editor.pixels]);
            this.linkUrl.set(editor.linkUrl ?? '');
            this.pixelHistory.set([]);
            this.recentColors.set([]);
            this.nextRecentColorId = 1;
            this.renderCanvas();
        } catch {
            this.loadError.set('Could not load this reservation editor.');
        } finally {
            this.isLoading.set(false);
        }
    }

    private resolveCanvasPoint(event: MouseEvent): { x: number; y: number } | null {
        const editor = this.editor();
        const canvas = this.editorCanvas?.nativeElement;
        if (!editor || !canvas) {
            return null;
        }

        const rect = canvas.getBoundingClientRect();
        const zoom = this.zoom();
        const x = Math.floor((event.clientX - rect.left) / zoom);
        const y = Math.floor((event.clientY - rect.top) / zoom);

        if (x < 0 || x >= editor.width || y < 0 || y >= editor.height) {
            return null;
        }

        return { x, y };
    }

    private applyBrush(x: number, y: number): void {
        const editor = this.editor();
        if (!editor) {
            return;
        }

        const pixelIndex = (y * editor.width) + x;
        if (this.pixels()[pixelIndex] === this.selectedColor()) {
            return;
        }

        if (!this.hasPendingStrokeSnapshot) {
            this.pushUndoSnapshot();
            this.hasPendingStrokeSnapshot = true;
        }

        const nextPixels = [...this.pixels()];
        nextPixels[pixelIndex] = this.selectedColor();
        this.pixels.set(nextPixels);
        this.renderCanvas();
    }

    private applyBucketFill(startX: number, startY: number): void {
        const editor = this.editor();
        if (!editor) {
            return;
        }

        const sourcePixels = this.pixels();
        const startIndex = (startY * editor.width) + startX;
        const targetColor = sourcePixels[startIndex];
        const replacementColor = this.selectedColor();

        if (targetColor === replacementColor) {
            return;
        }

        const nextPixels = [...sourcePixels];
        const queue: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];
        let changed = false;

        while (queue.length > 0) {
            const point = queue.pop();
            if (!point) {
                continue;
            }

            const index = (point.y * editor.width) + point.x;
            if (nextPixels[index] !== targetColor) {
                continue;
            }

            nextPixels[index] = replacementColor;
            changed = true;

            if (point.x > 0) {
                queue.push({ x: point.x - 1, y: point.y });
            }
            if (point.x < editor.width - 1) {
                queue.push({ x: point.x + 1, y: point.y });
            }
            if (point.y > 0) {
                queue.push({ x: point.x, y: point.y - 1 });
            }
            if (point.y < editor.height - 1) {
                queue.push({ x: point.x, y: point.y + 1 });
            }
        }

        if (!changed) {
            return;
        }

        this.pushUndoSnapshot();
        this.pixels.set(nextPixels);
        this.renderCanvas();
        this.saveMessage.set(null);
    }

    private applyLineTool(x: number, y: number): void {
        const editor = this.editor();
        if (!editor) {
            return;
        }

        const start = this.lineStart();
        if (!start) {
            this.lineStart.set({ x, y });
            return;
        }

        const linePoints = this.getLinePoints(start.x, start.y, x, y);
        const nextPixels = [...this.pixels()];
        let changed = false;

        for (const point of linePoints) {
            const index = (point.y * editor.width) + point.x;
            if (nextPixels[index] !== this.selectedColor()) {
                nextPixels[index] = this.selectedColor();
                changed = true;
            }
        }

        this.lineStart.set(null);

        if (!changed) {
            return;
        }

        this.pushUndoSnapshot();
        this.pixels.set(nextPixels);
        this.renderCanvas();
        this.saveMessage.set(null);
    }

    private renderCanvas(): void {
        const editor = this.editor();
        const canvas = this.editorCanvas?.nativeElement;
        if (!editor || !canvas || !this.hasViewInitialized) {
            return;
        }

        const zoom = this.zoom();
        canvas.width = editor.width * zoom;
        canvas.height = editor.height * zoom;

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const pixels = this.pixels();
        for (let y = 0; y < editor.height; y++) {
            for (let x = 0; x < editor.width; x++) {
                context.fillStyle = pixels[(y * editor.width) + x];
                context.fillRect(x * zoom, y * zoom, zoom, zoom);

                if (zoom >= 12) {
                    context.strokeStyle = 'rgba(31, 22, 51, 0.18)';
                    context.lineWidth = 1;
                    context.strokeRect((x * zoom) + 0.5, (y * zoom) + 0.5, zoom - 1, zoom - 1);
                }
            }
        }
    }

    private normalizeLinkUrl(value: string): string | null {
        const trimmedValue = value.trim();
        return trimmedValue.length > 0 ? trimmedValue : null;
    }

    private normalizeColor(color: string): string {
        return color.trim().toLowerCase();
    }

    private pushUndoSnapshot(): void {
        const currentPixels = this.pixels();
        this.pixelHistory.update(history => [...history.slice(-19), [...currentPixels]]);
    }

    private rememberRecentColor(color: string): void {
        this.recentColors.update(currentColors => {
            const normalizedColor = this.normalizeColor(color);
            const nextColors = [
                { id: this.nextRecentColorId++, color: normalizedColor },
                ...currentColors.filter(existingColor => this.normalizeColor(existingColor.color) !== normalizedColor),
            ];
            return nextColors.slice(0, 5);
        });
    }

    private getLinePoints(startX: number, startY: number, endX: number, endY: number): Array<{ x: number; y: number }> {
        const points: Array<{ x: number; y: number }> = [];
        let currentX = startX;
        let currentY = startY;
        const deltaX = Math.abs(endX - startX);
        const deltaY = Math.abs(endY - startY);
        const stepX = startX < endX ? 1 : -1;
        const stepY = startY < endY ? 1 : -1;
        let error = deltaX - deltaY;

        while (true) {
            points.push({ x: currentX, y: currentY });
            if (currentX === endX && currentY === endY) {
                return points;
            }

            const doubledError = 2 * error;
            if (doubledError > -deltaY) {
                error -= deltaY;
                currentX += stepX;
            }
            if (doubledError < deltaX) {
                error += deltaX;
                currentY += stepY;
            }
        }
    }
}
