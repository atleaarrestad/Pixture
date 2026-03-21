import { Component, input } from '@angular/core';
import { UiTone } from './ui.types';

@Component({
    selector: 'ui-badge',
    template: `
        <span
            class="badge"
            [class.badge--secondary]="tone() === 'secondary'"
            [class.badge--tertiary]="tone() === 'tertiary'"
            [class.badge--success]="tone() === 'success'"
            [class.badge--warning]="tone() === 'warning'"
            [class.badge--danger]="tone() === 'danger'"
        >
            <ng-content />
        </span>
    `,
    styles: [
        `
            .badge {
                display: inline-flex;
                align-items: center;
                padding: 0.35rem 0.75rem;
                border: var(--border-thin) solid var(--token-border-strong);
                border-radius: var(--radius-pill);
                background: var(--color-primary);
                font-family: var(--font-family-display);
                font-size: var(--font-size-2xs);
                font-weight: var(--font-weight-bold);
                box-shadow: var(--shadow-neo-xs);
            }

            .badge--secondary {
                background: var(--color-secondary);
            }
            .badge--tertiary {
                background: var(--color-tertiary);
            }
            .badge--success {
                background: var(--color-success);
            }
            .badge--warning {
                background: var(--color-warning);
            }
            .badge--danger {
                background: var(--color-danger);
            }
        `,
    ],
})
export class UiBadgeComponent {
    public readonly tone = input<UiTone>('primary');
}
