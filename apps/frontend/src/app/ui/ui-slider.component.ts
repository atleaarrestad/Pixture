import { Component, computed, input, output } from '@angular/core';

@Component({
    selector: 'ui-slider',
    template: `
        <label class="slider">
            <span class="slider__topline">
                <span class="slider__label">{{ label() }}</span>
                <span class="slider__value">{{ displayValue() }}</span>
            </span>

            <input
                class="slider__control"
                type="range"
                [min]="min()"
                [max]="max()"
                [step]="step()"
                [value]="value()"
                [disabled]="disabled()"
                [style.--slider-fill.%]="fillPercent()"
                (input)="onInput($event)"
            />

            @if (hint()) {
                <span class="slider__hint">{{ hint() }}</span>
            }
        </label>
    `,
    styles: [
        `
            .slider {
                display: grid;
                gap: var(--space-2);
            }

            .slider__topline {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--space-3);
            }

            .slider__label,
            .slider__value {
                font-family: var(--font-family-display);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-bold);
            }

            .slider__value {
                padding: 0.25rem 0.6rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-pill);
                background: var(--color-accent);
                box-shadow: var(--shadow-neo-xs);
            }

            .slider__control {
                --slider-fill: 0%;
                appearance: none;
                width: 100%;
                height: 1.4rem;
                padding: 0;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: 999px;
                background:
                    linear-gradient(
                        90deg,
                        var(--color-primary) 0%,
                        var(--color-primary) var(--slider-fill),
                        var(--color-canvas-alt) var(--slider-fill),
                        var(--color-canvas-alt) 100%
                    );
                box-shadow: var(--shadow-neo-xs);
                cursor: pointer;
            }

            .slider__control::-webkit-slider-thumb {
                appearance: none;
                width: 1.6rem;
                height: 1.6rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-md);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent),
                    var(--color-secondary);
                box-shadow: var(--shadow-neo-sm);
            }

            .slider__control::-moz-range-thumb {
                width: 1.6rem;
                height: 1.6rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-md);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.45), transparent),
                    var(--color-secondary);
                box-shadow: var(--shadow-neo-sm);
            }

            .slider__control::-moz-range-track {
                height: 1rem;
                border: none;
                background: transparent;
            }

            .slider__control:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }

            .slider__hint {
                color: var(--token-text-secondary);
                font-size: var(--font-size-2xs);
            }
        `,
    ],
})
export class UiSliderComponent {
    public readonly label = input('');
    public readonly hint = input('');
    public readonly value = input(0);
    public readonly min = input(0);
    public readonly max = input(100);
    public readonly step = input(1);
    public readonly valueSuffix = input('');
    public readonly disabled = input(false);
    public readonly valueChange = output<number>();

    protected readonly fillPercent = computed(() => {
        const span = this.max() - this.min();
        if (span <= 0) {
            return 0;
        }

        return ((this.value() - this.min()) / span) * 100;
    });

    protected readonly displayValue = computed(() => `${this.value()}${this.valueSuffix()}`);

    protected onInput(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        this.valueChange.emit(Number(element?.value ?? this.value()));
    }
}
