import { Component, input, output } from '@angular/core';
import { UiOption } from './ui.types';

@Component({
    selector: 'ui-select',
    template: `
        <label class="field">
            <span class="field__label">{{ label() }}</span>
            <select class="field__control" [value]="value()" (change)="onChange($event)">
                @if (placeholder()) {
                    <option value="">{{ placeholder() }}</option>
                }
                @for (option of options(); track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                }
            </select>
            @if (hint()) {
                <span class="field__hint">{{ hint() }}</span>
            }
        </label>
    `,
    styles: [
        `
            .field {
                display: grid;
                gap: var(--space-2);
            }

            .field__label {
                font-family: var(--font-family-display);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-bold);
            }

            .field__control {
                width: 100%;
                min-height: 3.25rem;
                padding: 0.9rem 1rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-lg);
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
                color: var(--token-text-primary);
            }

            .field__hint {
                color: var(--token-text-secondary);
                font-size: var(--font-size-2xs);
            }
        `,
    ],
})
export class UiSelectComponent {
    public readonly label = input('');
    public readonly hint = input('');
    public readonly placeholder = input('');
    public readonly value = input('');
    public readonly options = input<UiOption[]>([]);
    public readonly valueChange = output<string>();

    protected onChange(event: Event): void {
        const element = event.target as HTMLSelectElement | null;
        this.valueChange.emit(element?.value ?? '');
    }
}
