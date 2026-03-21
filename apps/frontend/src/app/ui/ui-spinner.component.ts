import { Component, computed, input } from '@angular/core';

export type UiSpinnerVariant = 'tiles' | 'spring' | 'checker' | 'ladder' | 'pulse';

const defaultSpinnerVariants: UiSpinnerVariant[] = ['spring', 'pulse', 'ladder', 'tiles', 'checker'];

@Component({
    selector: 'ui-spinner',
    template: `
        <span class="spinner-wrap">
            <span
                class="spinner"
                [class]="'spinner spinner--' + activeVariant()"
                [class.spinner--sm]="size() === 'sm'"
                [class.spinner--lg]="size() === 'lg'"
            >
                <span class="spinner__core"></span>
                <span class="spinner__tile spinner__tile--a"></span>
                <span class="spinner__tile spinner__tile--b"></span>
                <span class="spinner__tile spinner__tile--c"></span>
                <span class="spinner__tile spinner__tile--d"></span>
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
                --spinner-size: 2.5rem;
                --tile-size: 0.7rem;
                position: relative;
                display: inline-block;
                width: var(--spinner-size);
                height: var(--spinner-size);
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-md);
                background:
                    linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent),
                    var(--color-surface);
                box-shadow: var(--shadow-neo-sm);
                overflow: hidden;
            }

            .spinner__core,
            .spinner__tile {
                position: absolute;
                border: var(--border-medium) solid var(--token-border-strong);
                box-shadow: var(--shadow-neo-xs);
            }

            .spinner__core {
                inset: 0.45rem;
                border-radius: 0.7rem;
                background: rgba(255, 255, 255, 0.28);
            }

            .spinner__tile {
                width: var(--tile-size);
                height: var(--tile-size);
                border-radius: 0.45rem;
            }

            .spinner__tile--a {
                background: var(--color-primary);
            }

            .spinner__tile--b {
                background: var(--color-secondary);
            }

            .spinner__tile--c {
                background: var(--color-tertiary);
            }

            .spinner__tile--d {
                background: var(--color-accent);
            }

            .spinner--sm {
                --spinner-size: 1.95rem;
                --tile-size: 0.55rem;
            }

            .spinner--lg {
                --spinner-size: 3.1rem;
                --tile-size: 0.88rem;
            }

            .spinner-label {
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-bold);
                color: var(--token-text-secondary);
            }

            .spinner--tiles {
                transform: rotate(-6deg);
                animation: frame-wobble 1s ease-in-out infinite;
            }

            .spinner--tiles .spinner__tile--a {
                top: 0.22rem;
                left: 0.22rem;
                animation: tiles-a 0.95s steps(1, end) infinite;
            }

            .spinner--tiles .spinner__tile--b {
                top: 0.22rem;
                right: 0.22rem;
                animation: tiles-b 0.95s steps(1, end) infinite;
            }

            .spinner--tiles .spinner__tile--c {
                bottom: 0.22rem;
                left: 50%;
                margin-left: calc(var(--tile-size) * -0.5);
                animation: tiles-c 0.95s steps(1, end) infinite;
            }

            .spinner--tiles .spinner__tile--d {
                display: none;
            }

            .spinner--spring .spinner__core {
                inset: auto 0.35rem 0.35rem;
                height: 0.45rem;
                border-radius: var(--radius-pill);
                background: rgba(31, 22, 51, 0.08);
            }

            .spinner--spring .spinner__tile {
                bottom: 0.45rem;
                animation: spring 0.9s ease-in-out infinite;
            }

            .spinner--spring .spinner__tile--a {
                left: 0.22rem;
                animation-delay: 0s;
            }

            .spinner--spring .spinner__tile--b {
                left: 0.8rem;
                animation-delay: -0.12s;
            }

            .spinner--spring .spinner__tile--c {
                right: 0.8rem;
                animation-delay: -0.24s;
            }

            .spinner--spring .spinner__tile--d {
                right: 0.22rem;
                animation-delay: -0.36s;
            }

            .spinner--checker .spinner__core {
                inset: 0.38rem;
                border-style: dashed;
            }

            .spinner--checker .spinner__tile--a {
                top: 0.2rem;
                left: 0.2rem;
                animation: checker-a 0.9s steps(1, end) infinite;
            }

            .spinner--checker .spinner__tile--b {
                top: 0.2rem;
                right: 0.2rem;
                animation: checker-b 0.9s steps(1, end) infinite;
            }

            .spinner--checker .spinner__tile--c {
                bottom: 0.2rem;
                left: 0.2rem;
                animation: checker-b 0.9s steps(1, end) infinite;
            }

            .spinner--checker .spinner__tile--d {
                bottom: 0.2rem;
                right: 0.2rem;
                animation: checker-a 0.9s steps(1, end) infinite;
            }

            .spinner--ladder .spinner__core {
                inset: 0.3rem 0.45rem;
                background: transparent;
            }

            .spinner--ladder .spinner__tile {
                width: 0.75rem;
                height: 0.42rem;
                border-radius: 0.35rem;
                animation: ladder 0.9s ease-in-out infinite;
            }

            .spinner--ladder .spinner__tile--a {
                left: 0.28rem;
                bottom: 0.3rem;
                animation-delay: 0s;
            }

            .spinner--ladder .spinner__tile--b {
                left: 0.75rem;
                bottom: 0.78rem;
                animation-delay: -0.12s;
            }

            .spinner--ladder .spinner__tile--c {
                left: 1.22rem;
                bottom: 1.26rem;
                animation-delay: -0.24s;
            }

            .spinner--ladder .spinner__tile--d {
                left: 1.69rem;
                bottom: 1.74rem;
                animation-delay: -0.36s;
            }

            .spinner--pulse .spinner__core {
                inset: 0.38rem;
                animation: pulse-core 0.9s ease-in-out infinite;
            }

            .spinner--pulse .spinner__tile--a {
                top: 0.24rem;
                left: 0.24rem;
                animation: pulse-a 0.9s ease-in-out infinite;
            }

            .spinner--pulse .spinner__tile--b {
                top: 0.24rem;
                right: 0.24rem;
                animation: pulse-b 0.9s ease-in-out infinite;
            }

            .spinner--pulse .spinner__tile--c {
                bottom: 0.24rem;
                left: 0.24rem;
                animation: pulse-b 0.9s ease-in-out infinite;
            }

            .spinner--pulse .spinner__tile--d {
                bottom: 0.24rem;
                right: 0.24rem;
                animation: pulse-a 0.9s ease-in-out infinite;
            }

            @keyframes frame-wobble {
                0%,
                100% {
                    transform: rotate(-6deg) translateY(0);
                }

                50% {
                    transform: rotate(4deg) translateY(-1px);
                }
            }

            @keyframes tiles-a {
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

            @keyframes tiles-b {
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

            @keyframes tiles-c {
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

            @keyframes spring {
                0%,
                100% {
                    transform: translateY(0) scaleY(1);
                }

                45% {
                    transform: translateY(-1rem) scaleY(1.06);
                }

                65% {
                    transform: translateY(0.1rem) scaleY(0.92);
                }
            }

            @keyframes checker-a {
                0%,
                100% {
                    transform: scale(1);
                }

                50% {
                    transform: scale(0.72);
                }
            }

            @keyframes checker-b {
                0%,
                100% {
                    transform: scale(0.72);
                }

                50% {
                    transform: scale(1);
                }
            }

            @keyframes ladder {
                0%,
                100% {
                    transform: translateY(0) scaleX(1);
                }

                50% {
                    transform: translateY(-0.2rem) scaleX(1.12);
                }
            }

            @keyframes pulse-core {
                0%,
                100% {
                    transform: scale(1);
                    opacity: 0.85;
                }

                50% {
                    transform: scale(0.82);
                    opacity: 0.55;
                }
            }

            @keyframes pulse-a {
                0%,
                100% {
                    transform: translate(0, 0);
                }

                50% {
                    transform: translate(0.22rem, 0.22rem);
                }
            }

            @keyframes pulse-b {
                0%,
                100% {
                    transform: translate(0, 0);
                }

                50% {
                    transform: translate(-0.22rem, -0.22rem);
                }
            }
        `,
    ],
})
export class UiSpinnerComponent {
    public readonly size = input<'sm' | 'md' | 'lg'>('md');
    public readonly variant = input<UiSpinnerVariant | null>(null);
    public readonly label = input('');

    private readonly randomVariant =
        defaultSpinnerVariants[Math.floor(Math.random() * defaultSpinnerVariants.length)];

    protected readonly activeVariant = computed(() => this.variant() ?? this.randomVariant);
}
