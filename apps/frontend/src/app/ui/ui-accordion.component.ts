import { Component, input, signal } from '@angular/core';
import { UiAccordionItem } from './ui.types';

@Component({
    selector: 'ui-accordion',
    template: `
        <div class="accordion">
            @for (item of items(); track item.title; let index = $index) {
                <section class="accordion__item">
                    <button
                        type="button"
                        class="accordion__trigger"
                        [attr.aria-expanded]="isOpen(index)"
                        (click)="toggle(index)"
                    >
                        <span>{{ item.title }}</span>
                        @if (item.badge) {
                            <span class="accordion__badge">{{ item.badge }}</span>
                        }
                    </button>

                    @if (isOpen(index)) {
                        <div class="accordion__content">
                            <p>{{ item.content }}</p>
                        </div>
                    }
                </section>
            }
        </div>
    `,
    styles: [
        `
            .accordion {
                display: grid;
                gap: var(--space-3);
            }

            .accordion__item {
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-lg);
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
                overflow: hidden;
            }

            .accordion__trigger {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 1rem 1.15rem;
                border: 0;
                background: transparent;
                font-family: var(--font-family-display);
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-bold);
                text-align: left;
                cursor: pointer;
            }

            .accordion__badge {
                padding: 0.25rem 0.6rem;
                border: var(--border-thin) solid var(--token-border-strong);
                border-radius: var(--radius-pill);
                background: var(--color-accent);
                font-size: var(--font-size-2xs);
            }

            .accordion__content {
                padding: 0 1.15rem 1.1rem;
                color: var(--token-text-secondary);
            }

            .accordion__content p {
                margin: 0;
                line-height: var(--line-height-base);
            }
        `,
    ],
})
export class UiAccordionComponent {
    public readonly items = input<UiAccordionItem[]>([]);
    private readonly openIndexes = signal(new Set<number>([0]));

    protected toggle(index: number): void {
        const next = new Set(this.openIndexes());
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        this.openIndexes.set(next);
    }

    protected isOpen(index: number): boolean {
        return this.openIndexes().has(index);
    }
}
