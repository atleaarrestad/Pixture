import { Component, input, output } from '@angular/core';

@Component({
    selector: 'ui-checkbox',
    template: `
        <label class="checkbox" [class.checkbox--checked]="checked()">
            <input
                class="checkbox__native"
                type="checkbox"
                [checked]="checked()"
                (change)="onChange($event)"
            />
            <span class="checkbox__control">
                <span class="checkbox__box">
                    <span class="checkbox__mark" aria-hidden="true"></span>
                </span>
                <span class="checkbox__state">{{ checked() ? 'On' : 'Off' }}</span>
            </span>
            <span class="checkbox__copy">
                <span class="checkbox__label">{{ label() }}</span>
                @if (hint()) {
                    <span class="checkbox__hint">{{ hint() }}</span>
                }
            </span>
        </label>
    `,
    styles: [
        `
            .checkbox {
                display: inline-flex;
                align-items: center;
                gap: var(--space-3);
                width: 100%;
                padding: var(--space-4);
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-lg);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent),
                    var(--color-surface);
                box-shadow: var(--shadow-neo-sm);
                cursor: pointer;
                transition:
                    transform var(--duration-fast) var(--easing-standard),
                    box-shadow var(--duration-fast) var(--easing-standard),
                    background-color var(--duration-fast) var(--easing-standard);
            }

            .checkbox:hover {
                transform: translate(-1px, -1px);
                box-shadow: var(--shadow-neo-md);
            }

            .checkbox__native {
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }

            .checkbox__control {
                display: inline-flex;
                align-items: center;
                gap: var(--space-2);
                flex: 0 0 auto;
            }

            .checkbox__box {
                width: 1.5rem;
                height: 1.5rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-sm);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent),
                    var(--color-canvas-alt);
                box-shadow: var(--shadow-neo-xs);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                transition:
                    transform var(--duration-fast) var(--easing-standard),
                    background-color var(--duration-fast) var(--easing-standard);
            }

            .checkbox__mark {
                width: 0.7rem;
                height: 0.35rem;
                border-left: var(--border-medium) solid var(--color-ink);
                border-bottom: var(--border-medium) solid var(--color-ink);
                transform: rotate(-45deg) scale(0.25);
                opacity: 0.2;
                transform-origin: center;
                transition:
                    transform var(--duration-fast) var(--easing-standard),
                    opacity var(--duration-fast) var(--easing-standard);
            }

            .checkbox__state {
                min-width: 3.25rem;
                padding: 0.35rem 0.6rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-pill);
                background: var(--color-accent);
                box-shadow: var(--shadow-neo-xs);
                font-family: var(--font-family-display);
                font-size: var(--font-size-2xs);
                font-weight: var(--font-weight-bold);
                text-align: center;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }

            .checkbox__copy {
                display: grid;
                gap: var(--space-1);
                min-width: 0;
            }

            .checkbox__label {
                font-family: var(--font-family-display);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-bold);
            }

            .checkbox__hint {
                color: var(--token-text-secondary);
                font-size: var(--font-size-2xs);
            }

            .checkbox--checked {
                background:
                    linear-gradient(180deg, rgba(185, 178, 255, 0.22), transparent),
                    var(--color-surface-tertiary);
            }

            .checkbox--checked .checkbox__box {
                background:
                    linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                transform: rotate(-4deg);
            }

            .checkbox--checked .checkbox__mark {
                transform: rotate(-45deg) scale(1);
                opacity: 1;
            }

            .checkbox--checked .checkbox__state {
                background: var(--color-tertiary);
            }

            .checkbox__native:focus-visible + .checkbox__control .checkbox__box {
                box-shadow:
                    0 0 0 4px rgba(122, 110, 255, 0.18),
                    var(--shadow-neo-xs);
            }
        `,
    ],
})
export class UiCheckboxComponent {
    public readonly label = input('');
    public readonly hint = input('');
    public readonly checked = input(false);
    public readonly checkedChange = output<boolean>();

    protected onChange(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        this.checkedChange.emit(element?.checked ?? false);
    }
}
