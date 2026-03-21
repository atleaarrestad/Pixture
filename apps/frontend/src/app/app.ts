import { DOCUMENT } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private readonly document = inject(DOCUMENT);
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    private readonly bodyTheme = toSignal(
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            startWith(null),
            map(() => this.getDeepestRoute(this.activatedRoute).snapshot.data['bodyTheme'] ?? 'default'),
        ),
        { initialValue: 'default' },
    );

    public constructor() {
        effect(() => {
            this.document.body.dataset['theme'] = this.bodyTheme();
        });
    }

    private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
        let current = route;

        while (current.firstChild) {
            current = current.firstChild;
        }

        return current;
    }
}
