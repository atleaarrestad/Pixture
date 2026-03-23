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

    protected closeDialog(): void {
        this.dialogService.close();
    }

    @HostListener('document:keydown.escape')
    protected handleEscape(): void {
        if (this.activeDialog()) {
            this.closeDialog();
        }
    }
}
