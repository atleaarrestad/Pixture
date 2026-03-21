import { Component, input, signal } from '@angular/core';
import { UiTabItem } from './ui.types';

@Component({
    selector: 'ui-tabs',
    template: `
        <div class="tabs">
            <div class="tabs__list" role="tablist">
                @for (tab of items(); track tab.label; let index = $index) {
                    <button
                        type="button"
                        class="tabs__trigger"
                        [class.tabs__trigger--active]="activeIndex() === index"
                        [attr.aria-selected]="activeIndex() === index"
                        (click)="activeIndex.set(index)"
                    >
                        {{ tab.label }}
                    </button>
                }
            </div>

            @if (activeTab()) {
                <div class="tabs__panel">
                    <h4>{{ activeTab()!.label }}</h4>
                    @if (activeTab()!.caption) {
                        <p class="tabs__caption">{{ activeTab()!.caption }}</p>
                    }
                    <p>{{ activeTab()!.content }}</p>
                </div>
            }
        </div>
    `,
    styles: [
        `
            .tabs {
                display: grid;
                gap: var(--space-4);
            }

            .tabs__list {
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-3);
            }

            .tabs__trigger {
                padding: 0.8rem 1rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-pill);
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
                font-family: var(--font-family-display);
                font-weight: var(--font-weight-bold);
                cursor: pointer;
            }

            .tabs__trigger--active {
                background: var(--color-primary);
            }

            .tabs__panel {
                padding: 1rem 1.15rem;
                border: var(--border-medium) solid var(--token-border-strong);
                border-radius: var(--radius-lg);
                background: var(--color-surface);
                box-shadow: var(--shadow-neo-xs);
            }

            .tabs__panel h4,
            .tabs__panel p {
                margin: 0;
            }

            .tabs__panel h4 {
                font-family: var(--font-family-display);
                font-size: var(--font-size-md);
            }

            .tabs__caption {
                margin-top: var(--space-2) !important;
                color: var(--token-text-secondary);
                font-size: var(--font-size-xs);
            }

            .tabs__panel p:last-child {
                margin-top: var(--space-3);
                line-height: var(--line-height-base);
                color: var(--token-text-secondary);
            }
        `,
    ],
})
export class UiTabsComponent {
    public readonly items = input<UiTabItem[]>([]);
    protected readonly activeIndex = signal(0);

    protected activeTab(): UiTabItem | undefined {
        return this.items()[this.activeIndex()];
    }
}
