import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CanvasApiService } from './canvas-api.service';
import { CanvasReservation, CanvasSummary } from './canvas.models';
import { DialogService } from './dialog.service';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
    const canvas: CanvasSummary = {
        width: 100,
        height: 80,
        imageUrl: '/board.png',
        renderVersion: 'render-123',
        updatedAt: '2026-03-23T00:00:00Z',
        reservationCount: 1,
    };

    const reservations: CanvasReservation[] = [
        {
            reservationId: 'reservation-1',
            title: 'Pixel Garden',
            ownerDisplayName: 'Pixture Team',
            linkUrl: 'https://example.com/pixel-garden',
            linkDisplayName: 'Pixel Garden Studio',
            linkLogoUrl: 'https://cdn.example.com/pixel-garden-logo.svg',
            x: 10,
            y: 12,
            width: 20,
            height: 16,
            accentColor: '#8a5cff',
            isReserved: true,
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomePageComponent],
            providers: [
                provideRouter([]),
                {
                    provide: CanvasApiService,
                    useValue: {
                        getCanvas: () => of(canvas),
                        getReservations: () => of(reservations),
                        toAbsoluteUrl: (url: string) => `https://cdn.example.com${url}`,
                    } satisfies Pick<CanvasApiService, 'getCanvas' | 'getReservations' | 'toAbsoluteUrl'>,
                },
            ],
        }).compileComponents();
    });

    it('renders public-facing board content without developer-only sections', async () => {
        const fixture = TestBed.createComponent(HomePageComponent);
        await fixture.whenStable();
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const headings = Array.from(compiled.querySelectorAll('h1, h2, h3'));

        expect(compiled.textContent).toContain('Pixture board');
        expect(compiled.textContent).toContain('Hover a highlighted region to preview its link.');
        expect(headings).toHaveLength(1);

        expect(compiled.textContent).not.toContain('Public board prototype');
        expect(compiled.textContent).not.toContain('Current board');
        expect(compiled.textContent).not.toContain('Why this split works');
    });

    it('shows region details on hover and hides them again when the hover ends', async () => {
        const fixture = TestBed.createComponent(HomePageComponent);
        await fixture.whenStable();
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const overlay = compiled.querySelector('.board-stage__overlay') as HTMLButtonElement;

        expect(compiled.textContent).not.toContain('https://example.com/pixel-garden');

        overlay.dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();

        expect(compiled.textContent).toContain('Pixel Garden');
        expect(compiled.textContent).not.toContain('Visit link');
        expect(compiled.textContent).not.toContain('Position');
        expect(compiled.textContent).not.toContain('Size');
        expect(compiled.textContent).not.toContain('Status');
        expect(compiled.textContent).toContain('https://example.com/pixel-garden');
        expect(Array.from(compiled.querySelectorAll('.home-page__hover-summary a'))).toHaveLength(0);

        overlay.dispatchEvent(new Event('mouseleave'));
        fixture.detectChanges();

        expect(compiled.textContent).not.toContain('https://example.com/pixel-garden');
        expect(compiled.textContent).toContain('Hover a highlighted region to preview its link.');
    });

    it('opens the reservation details dialog when a region is clicked', async () => {
        const fixture = TestBed.createComponent(HomePageComponent);
        const dialogService = TestBed.inject(DialogService);
        await fixture.whenStable();
        fixture.detectChanges();

        const overlay = fixture.nativeElement.querySelector('.board-stage__overlay') as HTMLButtonElement;

        overlay.click();

        expect(dialogService.activeDialog()).toEqual({
            kind: 'reservation-details',
            reservation: reservations[0],
        });
    });
});
