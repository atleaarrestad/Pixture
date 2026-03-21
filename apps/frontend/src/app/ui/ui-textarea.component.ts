import { Component, input, output } from '@angular/core';

@Component({
    selector: 'ui-textarea',
    template: `
        <label class="field">
            <span class="field__label">{{ label() }}</span>
            <textarea
                class="field__control field__control--textarea"
                [placeholder]="placeholder()"
                [value]="value()"
                [disabled]="disabled()"
                (input)="onInput($event)"
            ></textarea>
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
                min-height: 8rem;
                padding: 0.95rem 1rem;
                resize: vertical;
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
export class UiTextareaComponent {
    public readonly label = input('');
    public readonly value = input('');
    public readonly placeholder = input('');
    public readonly hint = input('');
    public readonly disabled = input(false);
    public readonly valueChange = output<string>();

    protected onInput(event: Event): void {
        const element = event.target as HTMLTextAreaElement | null;
        this.valueChange.emit(element?.value ?? '');
    }
}
