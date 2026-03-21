import { Component } from '@angular/core';

@Component({
    selector: 'app-home-page',
    template: `<main class="home-page"></main>`,
    styles: [
        `
            .home-page {
                width: min(var(--container-page), calc(100% - 2rem));
                min-height: 40vh;
                margin: 0 auto;
                padding: var(--space-12) 0;
            }
        `,
    ],
})
export class HomePageComponent {}
