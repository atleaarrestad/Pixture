import { Component, input } from '@angular/core';

@Component({
    selector: 'ui-spinner',
    template: `
        <span class="spinner-wrap">
            <span
                class="spinner"
                [class.spinner--sm]="size() === 'sm'"
                [class.spinner--lg]="size() === 'lg'"
            >
                <span class="spinner__tile spinner__tile--primary"></span>
                <span class="spinner__tile spinner__tile--secondary"></span>
                <span class="spinner__tile spinner__tile--tertiary"></span>
            </span>
            @if (label()) {
                <span class="spinner-label">{{ label() }}</span>
            }
        </span>
    `,
    styles: [
        `
            .spinner-wrap {
                display: inline-flex;
                align-items: center;
                gap: var(--space-3);
            }

            .spinner {
                position: relative;
                width: 2.4rem;
                height: 2.4rem;
                display: inline-block;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-md);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent),
                    var(--color-surface);
                box-shadow: var(--shadow-neo-sm);
                transform: rotate(-6deg);
                animation: wobble 1s ease-in-out infinite;
            }

            .spinner__tile {
                position: absolute;
                width: 0.8rem;
                height: 0.8rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: 0.45rem;
                box-shadow: var(--shadow-neo-xs);
            }

            .spinner__tile--primary {
                top: 0.2rem;
                left: 0.2rem;
                background: var(--color-primary);
                animation: tile-primary 0.95s steps(1, end) infinite;
            }

            .spinner__tile--secondary {
                top: 0.2rem;
                right: 0.2rem;
                background: var(--color-secondary);
                animation: tile-secondary 0.95s steps(1, end) infinite;
            }

            .spinner__tile--tertiary {
                bottom: 0.2rem;
                left: 50%;
                margin-left: -0.4rem;
                background: var(--color-tertiary);
                animation: tile-tertiary 0.95s steps(1, end) infinite;
            }

            .spinner--sm {
                width: 1.8rem;
                height: 1.8rem;
            }

            .spinner--sm .spinner__tile {
                width: 0.56rem;
                height: 0.56rem;
            }

            .spinner--sm .spinner__tile--tertiary {
                margin-left: -0.28rem;
            }

            .spinner--lg {
                width: 3rem;
                height: 3rem;
            }

            .spinner--lg .spinner__tile {
                width: 1rem;
                height: 1rem;
            }

            .spinner--lg .spinner__tile--tertiary {
                margin-left: -0.5rem;
            }

            .spinner-label {
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-bold);
                color: var(--token-text-secondary);
            }

            @keyframes wobble {
                0%,
                100% {
                    transform: rotate(-6deg) translateY(0);
                }

                50% {
                    transform: rotate(4deg) translateY(-1px);
                }
            }

            @keyframes tile-primary {
                0%,
                100% {
                    transform: translate(0, 0) rotate(-6deg);
                }

                33% {
                    transform: translate(1rem, 0.85rem) rotate(6deg);
                }

                66% {
                    transform: translate(0.45rem, 1.1rem) rotate(0deg);
                }
            }

            @keyframes tile-secondary {
                0%,
                100% {
                    transform: translate(0, 0) rotate(6deg);
                }

                33% {
                    transform: translate(-0.95rem, 0.95rem) rotate(-4deg);
                }

                66% {
                    transform: translate(-0.45rem, 1.1rem) rotate(0deg);
                }
            }

            @keyframes tile-tertiary {
                0%,
                100% {
                    transform: translate(0, 0) rotate(0deg);
                }

                33% {
                    transform: translate(-0.6rem, -1.05rem) rotate(-6deg);
                }

                66% {
                    transform: translate(0.6rem, -1.05rem) rotate(6deg);
                }
            }
        `,
    ],
})
export class UiSpinnerComponent {
    public readonly size = input<'sm' | 'md' | 'lg'>('md');
    public readonly label = input('');
}
