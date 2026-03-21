import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Component, input, output } from '@angular/core';
import { UiToast } from './ui.types';

@Component({
    selector: 'ui-toast-stack',
    imports: [FontAwesomeModule],
    template: `
        <aside class="toast-stack" aria-live="polite">
            @for (toast of toasts(); track toast.id) {
                <article
                    class="toast"
                    [class.toast--neutral]="toast.tone === 'neutral'"
                    [class.toast--secondary]="toast.tone === 'secondary'"
                    [class.toast--tertiary]="toast.tone === 'tertiary'"
                    [class.toast--success]="toast.tone === 'success'"
                    [class.toast--warning]="toast.tone === 'warning'"
                    [class.toast--danger]="toast.tone === 'danger'"
                >
                    <div class="toast__copy">
                        <h4>{{ toast.title }}</h4>
                        <p>{{ toast.message }}</p>
                    </div>

                    <button
                        type="button"
                        class="toast__dismiss"
                        aria-label="Dismiss notification"
                        (click)="dismiss.emit(toast.id)"
                    >
                        <fa-icon [icon]="closeIcon" />
                    </button>
                </article>
            }
        </aside>
    `,
    styles: [
        `
            .toast-stack {
                position: fixed;
                right: var(--space-6);
                bottom: var(--space-6);
                z-index: 20;
                display: grid;
                gap: var(--space-3);
                width: min(22rem, calc(100vw - 2rem));
            }

            .toast {
                display: flex;
                align-items: start;
                justify-content: space-between;
                gap: var(--space-4);
                padding: 1rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-lg);
                background: var(--color-primary);
                box-shadow: var(--shadow-neo-md);
            }

            .toast--neutral {
                background: var(--color-neutral);
            }
            .toast--secondary {
                background: var(--color-secondary);
            }
            .toast--tertiary {
                background: var(--color-tertiary);
            }
            .toast--success {
                background: var(--color-success);
            }
            .toast--warning {
                background: var(--color-warning);
            }
            .toast--danger {
                background: var(--color-danger);
            }

            .toast__copy h4,
            .toast__copy p {
                margin: 0;
            }

            .toast__copy h4 {
                font-family: var(--font-family-display);
                font-size: var(--font-size-sm);
            }

            .toast__copy p {
                margin-top: var(--space-2);
                color: var(--token-text-secondary);
                font-size: var(--font-size-xs);
            }

            .toast__dismiss {
                display: grid;
                place-items: center;
                flex: 0 0 auto;
                width: 2rem;
                height: 2rem;
                padding: 0;
                border: var(--border-thin) solid var(--token-border-strong);
                border-radius: 50%;
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
                cursor: pointer;
                line-height: 1;
                text-align: center;
                font-weight: var(--font-weight-bold);
            }

            .toast__dismiss fa-icon {
                font-size: 0.95rem;
            }
        `,
    ],
})
export class UiToastStackComponent {
    protected readonly closeIcon = faXmark;
    public readonly toasts = input<UiToast[]>([]);
    public readonly dismiss = output<number>();
}
