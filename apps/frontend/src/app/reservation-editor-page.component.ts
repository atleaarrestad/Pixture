import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBrush, faFillDrip, faImage, faRotateLeft, faSlash } from '@fortawesome/free-solid-svg-icons';
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
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
type ImportMode = 'cover' | 'contain' | 'stretch';

const EMPTY_PIXEL_COLOR = '#fffdf8';

@Component({
    selector: 'app-reservation-editor-page',
    imports: [
        FontAwesomeModule,
        FormsModule,
        RouterLink,
        UiButtonComponent,
        UiCardComponent,
        UiSliderComponent,
        UiSpinnerComponent,
    ],
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

    @ViewChild('imageUploadInput')
    private imageUploadInput?: ElementRef<HTMLInputElement>;

    @ViewChild('editorStage')
    private set editorStageRef(value: ElementRef<HTMLDivElement> | undefined) {
        this.editorStage = value;
        this.scheduleStageLayout();
        this.scheduleRecommendedZoom();
    }

    @ViewChild('importPreviewCanvas')
    private set importPreviewCanvasRef(value: ElementRef<HTMLCanvasElement> | undefined) {
        this.importPreviewCanvas = value;
        this.renderImportPreview();
    }

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
    protected readonly editorStageHeight = signal<number | null>(null);
    protected readonly isLoading = signal(true);
    protected readonly isSaving = signal(false);
    protected readonly isImporting = signal(false);
    protected readonly loadError = signal<string | null>(null);
    protected readonly saveMessage = signal<string | null>(null);
    protected readonly importImageName = signal<string | null>(null);
    protected readonly importImageSize = signal<{ width: number; height: number } | null>(null);
    protected readonly importMode = signal<ImportMode>('cover');
    protected readonly importFocusX = signal(50);
    protected readonly importFocusY = signal(50);
    protected readonly importZoom = signal(100);
    protected readonly importTargetWidth = signal(100);
    protected readonly importTargetHeight = signal(100);
    protected readonly importPositionX = signal(0);
    protected readonly importPositionY = signal(0);
    protected readonly hasStagedImport = computed(() => this.importImageName() !== null);
    protected readonly importModeSummary = computed(() => {
        switch (this.importMode()) {
            case 'contain':
                return 'Fit the whole image without distortion.';
            case 'stretch':
                return 'Fill the reservation exactly, even if it distorts the image.';
            default:
                return 'Fill the reservation without distortion, cropping the overflow.';
        }
    });
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
        const linePreviewEnd = this.linePreviewEnd();
        if (this.selectedTool() === 'line' && lineStart && linePreviewEnd) {
            return `Line ${lineStart.x}, ${lineStart.y} → ${linePreviewEnd.x}, ${linePreviewEnd.y}`;
        }

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
    private editorStage?: ElementRef<HTMLDivElement>;
    private importPreviewCanvas?: ElementRef<HTMLCanvasElement>;
    private stagedImportImage: HTMLImageElement | null = null;
    private hasAppliedRecommendedZoom = false;
    private importDragState:
        | {
            startClientX: number;
            startClientY: number;
            startTargetX: number;
            startTargetY: number;
        }
        | null = null;
    private readonly pixelHistory = signal<string[][]>([]);
    private readonly lineStart = signal<{ x: number; y: number } | null>(null);
    private readonly linePreviewEnd = signal<{ x: number; y: number } | null>(null);
    private nextRecentColorId = 1;
    protected readonly brushIcon = faBrush;
    protected readonly bucketIcon = faFillDrip;
    protected readonly lineIcon = faSlash;
    protected readonly undoIcon = faRotateLeft;
    protected readonly imageIcon = faImage;

    public async ngAfterViewInit(): Promise<void> {
        this.hasViewInitialized = true;
        await this.loadEditor();
    }

    @HostListener('window:resize')
    protected onWindowResize(): void {
        this.scheduleStageLayout();
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
            this.linePreviewEnd.set(null);
            this.isPainting = false;
        }
        this.renderCanvas();
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

    protected openImageUpload(): void {
        const input = this.imageUploadInput?.nativeElement;
        if (!input || this.isImporting()) {
            return;
        }

        input.value = '';
        input.click();
    }

    protected applyCustomColor(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        if (element?.value) {
            this.selectColor(element.value);
        }
    }

    protected async importImageFromFile(event: Event): Promise<void> {
        const element = event.target as HTMLInputElement | null;
        const file = element?.files?.item(0);
        if (!file) {
            return;
        }

        await this.stageImageImport(file);
        if (element) {
            element.value = '';
        }
    }

    protected setImportMode(mode: ImportMode): void {
        this.importMode.set(mode);
        this.renderImportPreview();
    }

    protected setImportFocusX(value: number): void {
        this.importFocusX.set(value);
        this.renderImportPreview();
    }

    protected setImportFocusY(value: number): void {
        this.importFocusY.set(value);
        this.renderImportPreview();
    }

    protected setImportZoom(value: number): void {
        this.importZoom.set(value);
        this.renderImportPreview();
    }

    protected setImportTargetWidth(value: number): void {
        this.importTargetWidth.set(value);
        this.renderImportPreview();
    }

    protected setImportTargetHeight(value: number): void {
        this.importTargetHeight.set(value);
        this.renderImportPreview();
    }

    protected setImportPositionX(value: number): void {
        this.importPositionX.set(value);
        this.renderImportPreview();
    }

    protected setImportPositionY(value: number): void {
        this.importPositionY.set(value);
        this.renderImportPreview();
    }

    protected clearImageImport(): void {
        this.clearImageImportState();
        this.saveMessage.set(null);
    }

    protected applyStagedImageImport(): void {
        const editor = this.editor();
        if (!editor || !this.stagedImportImage) {
            return;
        }

        const currentPixels = this.pixels();
        const importedPixels = this.createImportedPixels(editor.width, editor.height, currentPixels);
        const changedCount = importedPixels.reduce((count, color, index) => {
            return color === currentPixels[index] ? count : count + 1;
        }, 0);

        if (changedCount === 0) {
            this.saveMessage.set('The current import preview already matches the reservation pixels.');
            return;
        }

        this.pushUndoSnapshot();
        this.pixels.set(importedPixels);
        this.renderCanvas();
        this.saveMessage.set(`Applied imported image to ${changedCount} pixels. Review it, then save changes.`);
    }

    protected beginImportPlacementDrag(event: MouseEvent): void {
        const editor = this.editor();
        if (!this.stagedImportImage || !editor) {
            return;
        }

        event.preventDefault();
        const targetRect = this.getImportTargetRect(editor.width, editor.height);
        this.importDragState = {
            startClientX: event.clientX,
            startClientY: event.clientY,
            startTargetX: targetRect.x,
            startTargetY: targetRect.y,
        };
    }

    protected dragImportPlacement(event: MouseEvent): void {
        const dragState = this.importDragState;
        const editor = this.editor();
        const previewCanvas = this.importPreviewCanvas?.nativeElement;
        if (!dragState || !editor || !previewCanvas) {
            return;
        }

        const targetRect = this.getImportTargetRect(editor.width, editor.height);
        const rect = previewCanvas.getBoundingClientRect();
        const availableWidth = Math.max(editor.width - targetRect.width, 0);
        const availableHeight = Math.max(editor.height - targetRect.height, 0);
        const deltaX = ((event.clientX - dragState.startClientX) / rect.width) * editor.width;
        const deltaY = ((event.clientY - dragState.startClientY) / rect.height) * editor.height;

        if (availableWidth > 0) {
            const normalizedPositionX = ((dragState.startTargetX + deltaX) / availableWidth) * 100;
            this.importPositionX.set(this.clamp(normalizedPositionX, 0, 100));
        }

        if (availableHeight > 0) {
            const normalizedPositionY = ((dragState.startTargetY + deltaY) / availableHeight) * 100;
            this.importPositionY.set(this.clamp(normalizedPositionY, 0, 100));
        }

        this.renderImportPreview();
    }

    protected endImportPlacementDrag(): void {
        this.importDragState = null;
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
                this.isPainting = true;
                this.lineStart.set(point);
                this.linePreviewEnd.set(point);
                this.renderCanvas();
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
            return;
        }

        if (this.selectedTool() === 'line' && this.isPainting) {
            const point = this.resolveCanvasPoint(event);
            if (point) {
                this.linePreviewEnd.set(point);
                this.renderCanvas();
            }
        }
    }

    protected endPaint(): void {
        if (this.selectedTool() === 'line' && this.isPainting) {
            this.commitLinePreview();
        }
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
            this.hasAppliedRecommendedZoom = false;
            this.scheduleStageLayout();
            this.scheduleRecommendedZoom();
            this.renderCanvas();
        } catch {
            this.loadError.set('Could not load this reservation editor.');
        } finally {
            this.isLoading.set(false);
        }
    }

    private async stageImageImport(file: File): Promise<void> {
        if (!file.type.startsWith('image/')) {
            this.saveMessage.set('Please choose an image file to import.');
            return;
        }

        this.isImporting.set(true);
        this.saveMessage.set(null);
        this.isPainting = false;
        this.hasPendingStrokeSnapshot = false;
        this.lineStart.set(null);
        this.linePreviewEnd.set(null);

        try {
            const image = await this.loadImageFile(file);
            this.stagedImportImage = image;
            this.importImageName.set(file.name);
            this.importImageSize.set({ width: image.naturalWidth, height: image.naturalHeight });
            this.importMode.set('cover');
            this.importFocusX.set(50);
            this.importFocusY.set(50);
            this.importZoom.set(100);
            this.importTargetWidth.set(100);
            this.importTargetHeight.set(100);
            this.importPositionX.set(0);
            this.importPositionY.set(0);
            this.renderImportPreview();
            this.saveMessage.set('Preview the import below, adjust the crop if needed, then apply it.');
        } catch (error: unknown) {
            this.saveMessage.set(this.getImageImportErrorMessage(error));
        } finally {
            this.isImporting.set(false);
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

    private commitLinePreview(): void {
        const editor = this.editor();
        if (!editor) {
            return;
        }

        const start = this.lineStart();
        const end = this.linePreviewEnd();
        if (!start || !end) {
            this.lineStart.set(null);
            this.linePreviewEnd.set(null);
            this.renderCanvas();
            return;
        }

        const linePoints = this.getLinePoints(start.x, start.y, end.x, end.y);
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
        this.linePreviewEnd.set(null);

        if (!changed) {
            this.renderCanvas();
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

        this.renderLinePreview(context, editor.width, editor.height, zoom);
    }

    private createImportedPixels(width: number, height: number, currentPixels: string[]): string[] {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
            throw new Error('Could not prepare the image importer.');
        }

        this.renderImportLayerToContext(context, width, height, false);

        const imageData = context.getImageData(0, 0, width, height).data;
        const nextPixels = [...currentPixels];

        for (let index = 0; index < width * height; index++) {
            const offset = index * 4;
            const alpha = imageData[offset + 3] / 255;
            if (alpha <= 0) {
                continue;
            }

            const sourceRed = imageData[offset];
            const sourceGreen = imageData[offset + 1];
            const sourceBlue = imageData[offset + 2];

            if (alpha >= 1) {
                nextPixels[index] = this.rgbToHex(sourceRed, sourceGreen, sourceBlue);
                continue;
            }

            const baseColor = this.hexToRgb(EMPTY_PIXEL_COLOR);
            const red = Math.round((sourceRed * alpha) + (baseColor.red * (1 - alpha)));
            const green = Math.round((sourceGreen * alpha) + (baseColor.green * (1 - alpha)));
            const blue = Math.round((sourceBlue * alpha) + (baseColor.blue * (1 - alpha)));
            nextPixels[index] = this.rgbToHex(red, green, blue);
        }

        return nextPixels;
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

    private async loadImageFile(file: File): Promise<HTMLImageElement> {
        return await new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            const objectUrl = URL.createObjectURL(file);

            image.onload = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(image);
            };

            image.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Could not read that image file.'));
            };

            image.src = objectUrl;
        });
    }

    private renderImportPreview(): void {
        const editor = this.editor();
        const previewCanvas = this.importPreviewCanvas?.nativeElement;
        if (!editor || !previewCanvas || !this.stagedImportImage) {
            return;
        }

        previewCanvas.width = editor.width;
        previewCanvas.height = editor.height;

        const context = previewCanvas.getContext('2d');
        if (!context) {
            return;
        }

        this.drawPixelsToContext(context, editor.width, editor.height, this.pixels());
        this.renderImportLayerToContext(context, editor.width, editor.height, true);
    }

    private renderImportLayerToContext(
        context: CanvasRenderingContext2D,
        targetWidth: number,
        targetHeight: number,
        showOutline: boolean,
    ): void {
        const image = this.stagedImportImage;
        if (!image) {
            return;
        }

        const targetRect = this.getImportTargetRect(targetWidth, targetHeight);
        context.save();
        context.fillStyle = EMPTY_PIXEL_COLOR;
        context.fillRect(targetRect.x, targetRect.y, targetRect.width, targetRect.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        context.beginPath();
        context.rect(targetRect.x, targetRect.y, targetRect.width, targetRect.height);
        context.clip();

        const placement = this.getImportPlacement(
            image.naturalWidth,
            image.naturalHeight,
            targetRect.width,
            targetRect.height,
        );
        context.drawImage(
            image,
            targetRect.x + placement.offsetX,
            targetRect.y + placement.offsetY,
            placement.drawWidth,
            placement.drawHeight,
        );
        context.restore();

        if (showOutline) {
            context.save();
            context.strokeStyle = 'rgba(31, 22, 51, 0.65)';
            context.setLineDash([2, 2]);
            context.lineWidth = 1;
            context.strokeRect(targetRect.x + 0.5, targetRect.y + 0.5, targetRect.width - 1, targetRect.height - 1);
            context.restore();
        }
    }

    private getImportPlacement(
        sourceWidth: number,
        sourceHeight: number,
        targetWidth: number,
        targetHeight: number,
    ): {
        drawWidth: number;
        drawHeight: number;
        offsetX: number;
        offsetY: number;
    } {
        if (this.importMode() === 'stretch') {
            return {
                drawWidth: targetWidth,
                drawHeight: targetHeight,
                offsetX: 0,
                offsetY: 0,
            };
        }

        const baseScale = this.importMode() === 'contain'
            ? Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight)
            : Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
        const zoomFactor = this.importZoom() / 100;
        const scale = baseScale * zoomFactor;
        const drawWidth = sourceWidth * scale;
        const drawHeight = sourceHeight * scale;
        const offsetX = (targetWidth - drawWidth) * (this.importFocusX() / 100);
        const offsetY = (targetHeight - drawHeight) * (this.importFocusY() / 100);

        return {
            drawWidth,
            drawHeight,
            offsetX,
            offsetY,
        };
    }

    private getImportTargetRect(targetWidth: number, targetHeight: number): {
        x: number;
        y: number;
        width: number;
        height: number;
    } {
        const width = Math.max(1, Math.round(targetWidth * (this.importTargetWidth() / 100)));
        const height = Math.max(1, Math.round(targetHeight * (this.importTargetHeight() / 100)));
        const availableX = Math.max(targetWidth - width, 0);
        const availableY = Math.max(targetHeight - height, 0);

        return {
            x: Math.round(availableX * (this.importPositionX() / 100)),
            y: Math.round(availableY * (this.importPositionY() / 100)),
            width,
            height,
        };
    }

    private clearImageImportState(): void {
        this.stagedImportImage = null;
        this.importDragState = null;
        this.importImageName.set(null);
        this.importImageSize.set(null);
        this.importMode.set('cover');
        this.importFocusX.set(50);
        this.importFocusY.set(50);
        this.importZoom.set(100);
        this.importTargetWidth.set(100);
        this.importTargetHeight.set(100);
        this.importPositionX.set(0);
        this.importPositionY.set(0);
    }

    private drawPixelsToContext(
        context: CanvasRenderingContext2D,
        width: number,
        height: number,
        pixels: string[],
    ): void {
        context.clearRect(0, 0, width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                context.fillStyle = pixels[(y * width) + x];
                context.fillRect(x, y, 1, 1);
            }
        }
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.min(Math.max(value, minimum), maximum);
    }

    private hexToRgb(color: string): { red: number; green: number; blue: number } {
        const normalizedColor = this.normalizeColor(color);
        if (!/^#[0-9a-f]{6}$/.test(normalizedColor)) {
            throw new Error(`Unsupported color format: ${color}`);
        }

        return {
            red: Number.parseInt(normalizedColor.slice(1, 3), 16),
            green: Number.parseInt(normalizedColor.slice(3, 5), 16),
            blue: Number.parseInt(normalizedColor.slice(5, 7), 16),
        };
    }

    private rgbToHex(red: number, green: number, blue: number): string {
        return `#${[red, green, blue]
            .map(value => value.toString(16).padStart(2, '0'))
            .join('')}`;
    }

    private getImageImportErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        return 'Could not import that image right now.';
    }

    private scheduleRecommendedZoom(): void {
        if (this.hasAppliedRecommendedZoom) {
            return;
        }

        requestAnimationFrame(() => {
            this.applyRecommendedZoom();
        });
    }

    private scheduleStageLayout(): void {
        requestAnimationFrame(() => {
            this.applyStageLayout();
        });
    }

    private applyStageLayout(): void {
        const stage = this.editorStage?.nativeElement;
        if (!stage) {
            return;
        }

        if (window.innerWidth <= 900) {
            this.editorStageHeight.set(null);
            return;
        }

        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const availableHeight = Math.floor(viewportHeight - stage.getBoundingClientRect().top - 24);
        this.editorStageHeight.set(this.clamp(availableHeight, 240, 640));
    }

    private applyRecommendedZoom(): void {
        const editor = this.editor();
        const stage = this.editorStage?.nativeElement;
        if (!editor || !stage || this.hasAppliedRecommendedZoom) {
            return;
        }

        const stageRect = stage.getBoundingClientRect();
        if (stageRect.width <= 0 || stageRect.height <= 0) {
            return;
        }

        const stageStyles = window.getComputedStyle(stage);
        const horizontalPadding = Number.parseFloat(stageStyles.paddingLeft) + Number.parseFloat(stageStyles.paddingRight);
        const verticalPadding = Number.parseFloat(stageStyles.paddingTop) + Number.parseFloat(stageStyles.paddingBottom);
        const availableWidth = Math.max(stageRect.width - horizontalPadding - 8, 1);
        const availableHeight = Math.max(stageRect.height - verticalPadding - 8, 1);
        const widthZoom = Math.floor(availableWidth / editor.width);
        const heightZoom = Math.floor(availableHeight / editor.height);
        const recommendedZoom = this.clamp(Math.min(widthZoom, heightZoom), 1, 50);

        this.zoom.set(recommendedZoom);
        this.hasAppliedRecommendedZoom = true;
        this.renderCanvas();
    }

    private renderLinePreview(
        context: CanvasRenderingContext2D,
        editorWidth: number,
        editorHeight: number,
        zoom: number,
    ): void {
        if (this.selectedTool() !== 'line' || !this.isPainting) {
            return;
        }

        const start = this.lineStart();
        const end = this.linePreviewEnd();
        if (!start || !end) {
            return;
        }

        const previewPoints = this.getLinePoints(start.x, start.y, end.x, end.y);
        for (const point of previewPoints) {
            if (point.x < 0 || point.x >= editorWidth || point.y < 0 || point.y >= editorHeight) {
                continue;
            }

            context.save();
            context.fillStyle = this.selectedColor();
            context.globalAlpha = 0.55;
            context.fillRect(point.x * zoom, point.y * zoom, zoom, zoom);

            if (zoom >= 12) {
                context.strokeStyle = 'rgba(31, 22, 51, 0.35)';
                context.lineWidth = 1;
                context.strokeRect((point.x * zoom) + 0.5, (point.y * zoom) + 0.5, zoom - 1, zoom - 1);
            }
            context.restore();
        }
    }
}
