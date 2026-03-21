import { Component, input, signal } from '@angular/core';

@Component({
    selector: 'ui-tooltip',
    template: `
        <span
            class="tooltip"
            (mouseenter)="visible.set(true)"
            (mouseleave)="visible.set(false)"
            (focusin)="visible.set(true)"
            (focusout)="visible.set(false)"
        >
            <span class="tooltip__trigger">
                <ng-content />
            </span>

            @if (visible()) {
                <span class="tooltip__content">{{ content() }}</span>
            }
        </span>
    `,
    styles: [
        `
            .tooltip {
                position: relative;
                display: inline-flex;
            }

            .tooltip__content {
                position: absolute;
                left: 50%;
                bottom: calc(100% + var(--space-2));
                transform: translateX(-50%);
                min-width: 12rem;
                padding: 0.7rem 0.9rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-md);
                background: var(--color-accent);
                box-shadow: var(--shadow-neo-sm);
                color: var(--token-text-primary);
                font-size: var(--font-size-2xs);
                white-space: normal;
                z-index: 10;
            }
        `,
    ],
})
export class UiTooltipComponent {
    public readonly content = input('');
    protected readonly visible = signal(false);
}
