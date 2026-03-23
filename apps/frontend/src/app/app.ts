import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DialogService } from './dialog.service';

@Component({
    selector: 'app-root',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private readonly dialogService = inject(DialogService);

    protected readonly activeDialog = this.dialogService.activeDialog;

    protected reservationLinkHost(url: string): string {
        return this.parseUrl(url)?.hostname.replace(/^www\./, '') ?? url;
    }

    protected reservationLinkOrigin(url: string): string {
        const parsedUrl = this.parseUrl(url);
        return parsedUrl ? `${parsedUrl.protocol}//${parsedUrl.hostname}` : url;
    }

    protected reservationLinkBadge(url: string): string {
        const host = this.reservationLinkHost(url);
        return host.slice(0, 1).toUpperCase();
    }

    protected closeDialog(): void {
        this.dialogService.close();
    }

    @HostListener('document:keydown.escape')
    protected handleEscape(): void {
        if (this.activeDialog()) {
            this.closeDialog();
        }
    }

    private parseUrl(url: string): URL | null {
        try {
            return new URL(url);
        } catch {
            return null;
        }
    }
}
