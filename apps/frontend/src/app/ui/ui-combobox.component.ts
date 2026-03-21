import { Component, computed, input, output, signal } from '@angular/core';
import { UiOption } from './ui.types';

@Component({
    selector: 'ui-combobox',
    template: `
        <label class="field">
            <span class="field__label">{{ label() }}</span>
            <div class="combobox">
                <input
                    class="combobox__input"
                    [value]="displayValue()"
                    [placeholder]="placeholder()"
                    (focus)="isOpen.set(true)"
                    (input)="onQueryInput($event)"
                    (blur)="closeSoon()"
                />

                @if (isOpen()) {
                    <div class="combobox__panel">
                        @if (filteredOptions().length) {
                            @for (option of filteredOptions(); track option.value) {
                                <button
                                    type="button"
                                    class="combobox__option"
                                    [class.combobox__option--selected]="option.value === value()"
                                    (mousedown)="selectOption(option.value)"
                                >
                                    <span>{{ option.label }}</span>
                                    @if (option.description) {
                                        <small>{{ option.description }}</small>
                                    }
                                </button>
                            }
                        } @else {
                            <div class="combobox__empty">No matches found.</div>
                        }
                    </div>
                }
            </div>
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

            .combobox {
                position: relative;
            }

            .combobox__input {
                width: 100%;
                min-height: 3.25rem;
                padding: 0.9rem 1rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-lg);
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
                color: var(--token-text-primary);
            }

            .combobox__panel {
                position: absolute;
                top: calc(100% + var(--space-2));
                left: 0;
                right: 0;
                z-index: 10;
                display: grid;
                gap: var(--space-2);
                padding: var(--space-3);
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-lg);
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-md);
            }

            .combobox__option {
                display: grid;
                gap: var(--space-1);
                width: 100%;
                padding: 0.85rem 0.9rem;
                border: var(--border-thin) solid var(--token-border-strong);
                border-radius: var(--radius-md);
                background: var(--color-canvas);
                text-align: left;
                cursor: pointer;
            }

            .combobox__option--selected {
                background: var(--color-secondary);
            }

            .combobox__option small,
            .combobox__empty,
            .field__hint {
                color: var(--token-text-secondary);
                font-size: var(--font-size-2xs);
            }
        `,
    ],
})
export class UiComboboxComponent {
    public readonly label = input('');
    public readonly placeholder = input('');
    public readonly hint = input('');
    public readonly value = input('');
    public readonly options = input<UiOption[]>([]);
    public readonly valueChange = output<string>();

    protected readonly isOpen = signal(false);
    private readonly query = signal('');

    protected readonly selectedLabel = computed(
        () => this.options().find((option) => option.value === this.value())?.label ?? '',
    );

    protected readonly displayValue = computed(() =>
        this.query().length > 0 || this.isOpen() ? this.query() : this.selectedLabel(),
    );

    protected readonly filteredOptions = computed(() => {
        const currentQuery = this.query().trim().toLowerCase();
        if (!currentQuery) {
            return this.options();
        }

        return this.options().filter((option) =>
            `${option.label} ${option.description ?? ''}`.toLowerCase().includes(currentQuery),
        );
    });

    protected onQueryInput(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        this.query.set(element?.value ?? '');
        this.isOpen.set(true);
    }

    protected selectOption(nextValue: string): void {
        this.valueChange.emit(nextValue);
        this.query.set('');
        this.isOpen.set(false);
    }

    protected closeSoon(): void {
        setTimeout(() => {
            this.query.set('');
            this.isOpen.set(false);
        }, 120);
    }
}
