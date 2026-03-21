import { Component, signal } from '@angular/core';
import { UiAccordionComponent } from './ui/ui-accordion.component';
import { UiBadgeComponent } from './ui/ui-badge.component';
import { UiButtonComponent } from './ui/ui-button.component';
import { UiCardComponent } from './ui/ui-card.component';
import { UiCheckboxComponent } from './ui/ui-checkbox.component';
import { UiComboboxComponent } from './ui/ui-combobox.component';
import { UiInputComponent } from './ui/ui-input.component';
import { UiSelectComponent } from './ui/ui-select.component';
import { UiSpinnerComponent, UiSpinnerVariant } from './ui/ui-spinner.component';
import { UiTabsComponent } from './ui/ui-tabs.component';
import { UiTextareaComponent } from './ui/ui-textarea.component';
import { UiToastStackComponent } from './ui/ui-toast-stack.component';
import { UiTooltipComponent } from './ui/ui-tooltip.component';
import { UiAccordionItem, UiOption, UiTabItem, UiToast, UiTone } from './ui/ui.types';

@Component({
    selector: 'app-root',
    imports: [
        UiAccordionComponent,
        UiBadgeComponent,
        UiButtonComponent,
        UiCardComponent,
        UiCheckboxComponent,
        UiComboboxComponent,
        UiInputComponent,
        UiSelectComponent,
        UiSpinnerComponent,
        UiTabsComponent,
        UiTextareaComponent,
        UiToastStackComponent,
        UiTooltipComponent,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal('Pixture');
    protected readonly projectName = signal('Pixture Studio');
    protected readonly notes = signal(
        'A pastel neobrutalist design system with reusable Angular components and centralized style tokens.',
    );
    protected readonly wantsUpdates = signal(true);
    protected readonly selectedIntent = signal('gallery');
    protected readonly selectedComponent = signal('accordion');
    protected readonly toasts = signal<UiToast[]>([
        {
            id: 1,
            title: 'Design system ready',
            message: 'Tokens and reusable components now drive the frontend styling.',
            tone: 'success',
        },
    ]);

    private nextToastId = 2;

    protected readonly showcaseOptions: UiOption[] = [
        { label: 'Gallery', value: 'gallery', description: 'A polished visual browsing flow.' },
        { label: 'Editor', value: 'editor', description: 'A productive workspace with panels.' },
        {
            label: 'Marketplace',
            value: 'marketplace',
            description: 'A storefront with rich filters.',
        },
    ];

    protected readonly componentOptions: UiOption[] = [
        {
            label: 'Accordion',
            value: 'accordion',
            description: 'Progressive disclosure for details.',
        },
        { label: 'Combobox', value: 'combobox', description: 'Searchable selection input.' },
        { label: 'Tabs', value: 'tabs', description: 'Quick context switching.' },
        { label: 'Toast', value: 'toast', description: 'Transient non-blocking feedback.' },
    ];

    protected readonly accordionItems: UiAccordionItem[] = [
        {
            title: 'What style direction is this?',
            badge: 'Core',
            content:
                'Pastel neobrutalism: playful flat color blocks, strong borders, chunky shadows, and friendly typography.',
        },
        {
            title: 'How should new UI be built?',
            badge: 'Rule',
            content:
                'Start with the shared tokens, reuse the existing primitives, and only add new component variants when a reusable pattern emerges.',
        },
        {
            title: 'What should stay centralized?',
            badge: 'Tokens',
            content:
                'Colors, typography, spacing, border widths, radii, and shadows should live in the token file rather than in ad hoc component styles.',
        },
    ];

    protected readonly tabItems: UiTabItem[] = [
        {
            label: 'Tokens',
            caption: 'Single source of truth',
            content:
                'The design token file defines the visual language for colors, typography, spacing, motion, borders, and shadows.',
        },
        {
            label: 'Components',
            caption: 'Reusable building blocks',
            content:
                'Buttons, cards, inputs, selectors, feedback elements, and disclosure/navigation components are all designed to compose together.',
        },
        {
            label: 'Usage',
            caption: 'How future work should behave',
            content:
                'Use shared primitives first. If something is missing, extend the library in a reusable way and document it in the repository instructions.',
        },
    ];

    protected readonly spinnerOptions: Array<{
        label: string;
        variant: UiSpinnerVariant;
        description: string;
    }> = [
        {
            label: 'Tiles',
            variant: 'tiles',
            description: 'Chunky pastel blocks trading places inside a wobbling frame.',
        },
        {
            label: 'Orbit',
            variant: 'orbit',
            description: 'A circular orbit spinner with four little satellites.',
        },
        {
            label: 'Conveyor',
            variant: 'conveyor',
            description: 'Tiles traveling across a chunky loading rail.',
        },
        {
            label: 'Spring',
            variant: 'spring',
            description: 'Four blocks bouncing like a toy spring rack.',
        },
        {
            label: 'Stamps',
            variant: 'stamps',
            description: 'Pastel stamps hopping around the card corners.',
        },
        {
            label: 'Checker',
            variant: 'checker',
            description: 'A mini checkerboard pulsing in alternating beats.',
        },
        {
            label: 'Ladder',
            variant: 'ladder',
            description: 'A rising stair-step loader with chunky bars.',
        },
        {
            label: 'Burst',
            variant: 'burst',
            description: 'A center-packed burst that pops outward and back in.',
        },
        {
            label: 'Satellite',
            variant: 'satellite',
            description: 'A central block with wobbling companions around it.',
        },
        {
            label: 'Pulse',
            variant: 'pulse',
            description: 'A tightening and releasing frame with corner punches.',
        },
    ];

    protected showToast(tone: UiTone): void {
        const messages: Record<UiTone, string> = {
            primary: 'Primary actions should feel confident and friendly.',
            secondary: 'Secondary actions support the flow without disappearing.',
            tertiary: 'Tertiary actions highlight softer supporting paths.',
            success: 'Success feedback should be bright, positive, and easy to scan.',
            warning: 'Warnings should stand out without feeling alarmist.',
            danger: 'Danger actions need the most contrast and caution styling.',
            neutral: 'Neutral toasts are useful for lightweight status updates.',
        };

        this.toasts.update((current) => [
            ...current,
            {
                id: this.nextToastId++,
                title: `${tone.charAt(0).toUpperCase()}${tone.slice(1)} toast`,
                message: messages[tone],
                tone,
            },
        ]);
    }

    protected dismissToast(id: number): void {
        this.toasts.update((current) => current.filter((toast) => toast.id !== id));
    }
}
