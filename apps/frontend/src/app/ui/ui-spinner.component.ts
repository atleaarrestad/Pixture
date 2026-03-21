import { Component, input } from '@angular/core';

@Component({
    selector: 'ui-spinner',
    template: `
        <span class="spinner-wrap">
            <span
                class="spinner"
                [class.spinner--sm]="size() === 'sm'"
                [class.spinner--lg]="size() === 'lg'"
            ></span>
            @if (label()) {
                <span class="spinner-label">{{ label() }}</span>
            }
        </span>
    `,
    styles: [
        `
            .spinner-wrap {
                display: inline-flex;
                align-items: center;
                gap: var(--space-3);
            }

            .spinner {
                width: 1.5rem;
                height: 1.5rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-right-color: var(--color-primary);
                border-radius: 50%;
                animation: spin 0.9s linear infinite;
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
            }

            .spinner--sm {
                width: 1.1rem;
                height: 1.1rem;
            }

            .spinner--lg {
                width: 2rem;
                height: 2rem;
            }

            .spinner-label {
                font-size: var(--font-size-xs);
                color: var(--token-text-secondary);
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `,
    ],
})
export class UiSpinnerComponent {
    public readonly size = input<'sm' | 'md' | 'lg'>('md');
    public readonly label = input('');
}
