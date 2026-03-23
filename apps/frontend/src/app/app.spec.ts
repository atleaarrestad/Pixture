import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { DialogService } from './dialog.service';

describe('App', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
            providers: [provideRouter(routes)],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render primary navigation', async () => {
        const fixture = TestBed.createComponent(App);
        await fixture.whenStable();
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.topbar__brand')?.textContent).toContain('Pixture');
        expect(compiled.querySelectorAll('.topbar__link').length).toBe(2);
    });

    it('should render and close the reservation dialog', async () => {
        const fixture = TestBed.createComponent(App);
        const dialogService = TestBed.inject(DialogService);

        dialogService.openReservationDetails({
            reservationId: 'reservation-1',
            title: 'Pixel Garden',
            ownerDisplayName: 'Pixture Team',
            linkUrl: 'https://example.com/pixel-garden',
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            accentColor: '#8a5cff',
            isReserved: true,
        });

        fixture.detectChanges();

        let compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.app-dialog')).toBeTruthy();
        expect(compiled.textContent).toContain('Pixel Garden');
        expect(compiled.textContent).toContain('https://example.com/pixel-garden');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.app-dialog')).toBeNull();
    });
});
