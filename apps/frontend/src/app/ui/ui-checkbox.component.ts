import { Component, input, output } from '@angular/core';

@Component({
    selector: 'ui-checkbox',
    template: `
        <label class="checkbox">
            <input
                class="checkbox__native"
                type="checkbox"
                [checked]="checked()"
                (change)="onChange($event)"
            />
            <span class="checkbox__box"></span>
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
                align-items: start;
                gap: var(--space-3);
                cursor: pointer;
            }

            .checkbox__native {
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }

            .checkbox__box {
                width: 1.5rem;
                height: 1.5rem;
                margin-top: 0.1rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-sm);
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
                flex: 0 0 auto;
            }

            .checkbox__native:checked + .checkbox__box {
                background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            }

            .checkbox__copy {
                display: grid;
                gap: var(--space-1);
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
