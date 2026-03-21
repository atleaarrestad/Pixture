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
import { UiSpinnerComponent } from './ui/ui-spinner.component';

@Component({
    selector: 'app-reservation-editor-page',
    imports: [FormsModule, RouterLink, UiButtonComponent, UiCardComponent, UiSpinnerComponent],
    templateUrl: './reservation-editor-page.component.html',
    styleUrl: './reservation-editor-page.component.scss',
})
export class ReservationEditorPageComponent implements AfterViewInit {
    @ViewChild('editorCanvas')
    private set editorCanvasRef(value: ElementRef<HTMLCanvasElement> | undefined) {
        this.editorCanvas = value;
        this.renderCanvas();
    }

    private readonly route = inject(ActivatedRoute);
    private readonly canvasApi = inject(CanvasApiService);

    protected readonly editor = signal<ReservationEditorData | null>(null);
    protected readonly pixels = signal<string[]>([]);
    protected readonly selectedColor = signal('#ff7eb6');
    protected readonly linkUrl = signal('');
    protected readonly zoom = signal(18);
    protected readonly palette = ['#1f1633', '#fffdf8', '#ff7eb6', '#b9b2ff', '#8ed8f8', '#b9f2cf', '#ffd37a'];
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

    private isPainting = false;
    private hasViewInitialized = false;
    private editorCanvas?: ElementRef<HTMLCanvasElement>;

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

    protected selectColor(color: string): void {
        this.selectedColor.set(color);
    }

    protected hasExternalLink(editor: ReservationEditorData): boolean {
        return !!editor.linkUrl;
    }

    protected beginPaint(event: MouseEvent): void {
        this.isPainting = true;
        this.paintFromEvent(event);
    }

    protected paintWhileDragging(event: MouseEvent): void {
        if (this.isPainting && event.buttons === 1) {
            this.paintFromEvent(event);
        }
    }

    protected endPaint(): void {
        this.isPainting = false;
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
            this.renderCanvas();
        } catch {
            this.loadError.set('Could not load this reservation editor.');
        } finally {
            this.isLoading.set(false);
        }
    }

    private paintFromEvent(event: MouseEvent): void {
        const editor = this.editor();
        const canvas = this.editorCanvas?.nativeElement;
        if (!editor || !canvas) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const zoom = this.zoom();
        const x = Math.floor((event.clientX - rect.left) / zoom);
        const y = Math.floor((event.clientY - rect.top) / zoom);

        if (x < 0 || x >= editor.width || y < 0 || y >= editor.height) {
            return;
        }

        const nextPixels = [...this.pixels()];
        nextPixels[(y * editor.width) + x] = this.selectedColor();
        this.pixels.set(nextPixels);
        this.renderCanvas();
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
}
