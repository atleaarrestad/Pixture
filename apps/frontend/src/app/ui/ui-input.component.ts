import { Component, input, output } from '@angular/core';

@Component({
    selector: 'ui-input',
    template: `
        <label class="field">
            <span class="field__label">{{ label() }}</span>
            <input
                class="field__control"
                [attr.type]="type()"
                [placeholder]="placeholder()"
                [value]="value()"
                [disabled]="disabled()"
                (input)="onInput($event)"
            />
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
export class UiInputComponent {
    public readonly label = input('');
    public readonly value = input('');
    public readonly placeholder = input('');
    public readonly hint = input('');
    public readonly type = input('text');
    public readonly disabled = input(false);
    public readonly valueChange = output<string>();

    protected onInput(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        this.valueChange.emit(element?.value ?? '');
    }
}
