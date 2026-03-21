import { Component, computed, input, output, signal } from '@angular/core';
import { UiOption } from './ui.types';

@Component({
    selector: 'ui-combobox',
    template: `
        <label class="field">
            <span class="field__label">{{ label() }}</span>

            <div class="combobox" (focusin)="cancelClose()" (focusout)="closeSoon()">
                <input
                    class="combobox__input"
                    [value]="displayValue()"
                    [placeholder]="placeholder()"
                    autocomplete="off"
                    (focus)="openPanel()"
                    (input)="onQueryInput($event)"
                    (keydown)="onKeydown($event)"
                />

                @if (isOpen()) {
                    <div class="combobox__panel">
                        @if (filteredOptions().length) {
                            @for (option of filteredOptions(); track option.value; let index = $index) {
                                <button
                                    type="button"
                                    class="combobox__option"
                                    [class.combobox__option--selected]="option.value === value()"
                                    [class.combobox__option--highlighted]="index === highlightedIndex()"
                                    (mouseenter)="setHighlightedIndex(index)"
                                    (mousedown)="selectOption(option.value)"
                                >
                                    <span class="combobox__option-label">{{ option.label }}</span>
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
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.38), transparent),
                    var(--color-surface);
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
                transition:
                    transform var(--duration-fast) var(--easing-standard),
                    background-color var(--duration-fast) var(--easing-standard);
            }

            .combobox__option-label {
                font-family: var(--font-family-display);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-bold);
            }

            .combobox__option--highlighted {
                background: var(--color-accent);
                transform: translate(-1px, -1px);
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
    protected readonly query = signal('');
    protected readonly highlightedIndex = signal(0);

    private closeTimeout?: ReturnType<typeof setTimeout>;

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
        this.highlightedIndex.set(0);
    }

    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            this.openPanel();
            this.moveHighlight(1);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.openPanel();
            this.moveHighlight(-1);
            return;
        }

        if (event.key === 'Enter') {
            const option = this.filteredOptions()[this.highlightedIndex()] ?? this.filteredOptions()[0];
            if (option) {
                event.preventDefault();
                this.selectOption(option.value);
            }
            return;
        }

        if (event.key === 'Escape') {
            this.query.set('');
            this.isOpen.set(false);
            this.highlightedIndex.set(0);
        }
    }

    protected setHighlightedIndex(index: number): void {
        this.highlightedIndex.set(index);
    }

    protected selectOption(nextValue: string): void {
        this.valueChange.emit(nextValue);
        this.query.set('');
        this.isOpen.set(false);
        this.highlightedIndex.set(0);
    }

    protected openPanel(): void {
        this.cancelClose();
        if (!this.isOpen()) {
            this.isOpen.set(true);
            this.highlightedIndex.set(this.initialHighlightedIndex());
        }
    }

    protected cancelClose(): void {
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = undefined;
        }
    }

    protected closeSoon(): void {
        this.cancelClose();
        this.closeTimeout = setTimeout(() => {
            this.query.set('');
            this.isOpen.set(false);
            this.highlightedIndex.set(0);
        }, 120);
    }

    private moveHighlight(direction: 1 | -1): void {
        const options = this.filteredOptions();
        if (!options.length) {
            return;
        }

        const nextIndex =
            (this.highlightedIndex() + direction + options.length) % options.length;
        this.highlightedIndex.set(nextIndex);
    }

    private initialHighlightedIndex(): number {
        const selectedIndex = this.filteredOptions().findIndex((option) => option.value === this.value());
        return selectedIndex >= 0 ? selectedIndex : 0;
    }
}
