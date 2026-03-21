import { Component, input, output } from '@angular/core';

@Component({
    selector: 'ui-button',
    template: `
        <button
            class="ui-button"
            [class.ui-button--secondary]="variant() === 'secondary'"
            [class.ui-button--tertiary]="variant() === 'tertiary'"
            [class.ui-button--ghost]="variant() === 'ghost'"
            [class.ui-button--danger]="variant() === 'danger'"
            [class.ui-button--sm]="size() === 'sm'"
            [class.ui-button--lg]="size() === 'lg'"
            [class.ui-button--block]="block()"
            [disabled]="disabled()"
            [attr.type]="type()"
            (click)="handleClick($event)"
        >
            <ng-content />
        </button>
    `,
    styles: [
        `
            .ui-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-2);
                min-height: 3rem;
                padding: 0.85rem 1.2rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-pill);
                background: var(--color-primary);
                color: var(--token-text-primary);
                box-shadow: var(--shadow-neo-sm);
                font-family: var(--font-family-display);
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-bold);
                line-height: 1;
                cursor: pointer;
                transition:
                    transform var(--duration-fast) var(--easing-standard),
                    box-shadow var(--duration-fast) var(--easing-standard),
                    background var(--duration-fast) var(--easing-standard);
            }

            .ui-button:hover:not(:disabled) {
                transform: translate(-2px, -2px);
                box-shadow: var(--shadow-neo-md);
            }

            .ui-button:active:not(:disabled) {
                transform: translate(2px, 2px);
                box-shadow: var(--shadow-neo-xs);
            }

            .ui-button:disabled {
                cursor: not-allowed;
                opacity: 0.6;
                box-shadow: none;
            }

            .ui-button--secondary {
                background: var(--color-secondary);
            }
            .ui-button--tertiary {
                background: var(--color-tertiary);
            }
            .ui-button--danger {
                background: var(--color-danger);
            }
            .ui-button--ghost {
                background: var(--color-surface);
            }

            .ui-button--sm {
                min-height: 2.5rem;
                padding: 0.65rem 1rem;
                font-size: var(--font-size-xs);
            }

            .ui-button--lg {
                min-height: 3.5rem;
                padding: 1rem 1.5rem;
                font-size: var(--font-size-md);
            }

            .ui-button--block {
                width: 100%;
            }
        `,
    ],
})
export class UiButtonComponent {
    public readonly variant = input<'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'>(
        'primary',
    );
    public readonly size = input<'sm' | 'md' | 'lg'>('md');
    public readonly type = input<'button' | 'submit' | 'reset'>('button');
    public readonly disabled = input(false);
    public readonly block = input(false);
    public readonly pressed = output<MouseEvent>();

    protected handleClick(event: MouseEvent): void {
        if (!this.disabled()) {
            this.pressed.emit(event);
        }
    }
}
