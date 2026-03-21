import { Component, input } from '@angular/core';

@Component({
    selector: 'ui-card',
    template: `
        <article
            class="ui-card"
            [class.ui-card--secondary]="tone() === 'secondary'"
            [class.ui-card--tertiary]="tone() === 'tertiary'"
            [class.ui-card--accent]="tone() === 'accent'"
        >
            @if (eyebrow() || title() || subtitle()) {
                <header class="ui-card__header">
                    @if (eyebrow()) {
                        <p class="ui-card__eyebrow">{{ eyebrow() }}</p>
                    }
                    @if (title()) {
                        <h3 class="ui-card__title">{{ title() }}</h3>
                    }
                    @if (subtitle()) {
                        <p class="ui-card__subtitle">{{ subtitle() }}</p>
                    }
                </header>
            }
            <div class="ui-card__body">
                <ng-content />
            </div>
        </article>
    `,
    styles: [
        `
            .ui-card {
                display: grid;
                gap: var(--space-4);
                min-width: 0;
                padding: var(--space-6);
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-xl);
                background: var(--token-bg-panel);
                box-shadow: var(--shadow-neo-md);
            }

            .ui-card--secondary {
                background: var(--color-surface-secondary);
            }
            .ui-card--tertiary {
                background: var(--color-surface-tertiary);
            }
            .ui-card--accent {
                background: var(--color-canvas-alt);
            }

            .ui-card__header {
                display: grid;
                gap: var(--space-2);
            }

            .ui-card__body {
                min-width: 0;
            }

            .ui-card__eyebrow {
                margin: 0;
                font-family: var(--font-family-display);
                font-size: var(--font-size-2xs);
                font-weight: var(--font-weight-bold);
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: var(--token-text-secondary);
            }

            .ui-card__title {
                margin: 0;
                font-family: var(--font-family-display);
                font-size: var(--font-size-lg);
                line-height: var(--line-height-snug);
            }

            .ui-card__subtitle {
                margin: 0;
                color: var(--token-text-secondary);
                line-height: var(--line-height-base);
            }
        `,
    ],
})
export class UiCardComponent {
    public readonly eyebrow = input('');
    public readonly title = input('');
    public readonly subtitle = input('');
    public readonly tone = input<'default' | 'secondary' | 'tertiary' | 'accent'>('default');
}
