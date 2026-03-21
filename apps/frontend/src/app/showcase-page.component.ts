import { NgStyle } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { UiAccordionComponent } from './ui/ui-accordion.component';
import { UiBadgeComponent } from './ui/ui-badge.component';
import { UiButtonComponent } from './ui/ui-button.component';
import { UiCardComponent } from './ui/ui-card.component';
import { UiCheckboxComponent } from './ui/ui-checkbox.component';
import { UiComboboxComponent } from './ui/ui-combobox.component';
import { UiInputComponent } from './ui/ui-input.component';
import { UiSelectComponent } from './ui/ui-select.component';
import { UiSpinnerComponent } from './ui/ui-spinner.component';
import { UiTabsComponent } from './ui/ui-tabs.component';
import { UiTextareaComponent } from './ui/ui-textarea.component';
import { UiToastStackComponent } from './ui/ui-toast-stack.component';
import { UiTooltipComponent } from './ui/ui-tooltip.component';
import { UiAccordionItem, UiOption, UiTabItem, UiToast, UiTone } from './ui/ui.types';

interface ShowcaseSwatch {
    label: string;
    color: string;
    code: string;
}

interface ShowcaseTheme {
    slug: string;
    eyebrow: string;
    title: string;
    lead: string;
    paletteTitle: string;
    paletteSubtitle: string;
    actionTitle: string;
    actionSubtitle: string;
    formsTitle: string;
    formsSubtitle: string;
    disclosureTitle: string;
    disclosureSubtitle: string;
    tabsTitle: string;
    tabsSubtitle: string;
    previewTitle: string;
    previewSubtitle: string;
    guidanceTitle: string;
    guidanceSubtitle: string;
    swatches: ShowcaseSwatch[];
}

export const showcaseThemes = {
    default: {
        slug: 'default',
        eyebrow: 'Pastel neobrutalist design system',
        title: 'Pixture',
        lead: 'A reusable Angular UI kit powered by centralized design tokens. Everything on this page is built to become the baseline for the rest of the product.',
        paletteTitle: 'Core token colors',
        paletteSubtitle: 'Primary, secondary, tertiary, accent, and semantic tones all come from a single token file.',
        actionTitle: 'Buttons, badges, tooltip, spinner, toast',
        actionSubtitle: 'Reusable feedback and interaction primitives with shared shapes, borders, and shadows.',
        formsTitle: 'Inputs and selectors',
        formsSubtitle: 'Common form components wired with consistent padding, borders, type scale, and helper text.',
        disclosureTitle: 'Accordion',
        disclosureSubtitle: 'Useful for FAQ sections, sidebars, and expandable detail panels.',
        tabsTitle: 'Tabs',
        tabsSubtitle: 'A compact way to switch between related content.',
        previewTitle: 'Current state snapshot',
        previewSubtitle: 'These values are live examples of the reusable components above.',
        guidanceTitle: 'How to extend this',
        guidanceSubtitle: 'The next components should follow the same rule set.',
        swatches: [
            { label: 'Primary', color: '#b9b2ff', code: '#b9b2ff' },
            { label: 'Secondary', color: '#8ed8f8', code: '#8ed8f8' },
            { label: 'Tertiary', color: '#b9f2cf', code: '#b9f2cf' },
            { label: 'Accent', color: '#ffe38f', code: '#ffe38f' },
            { label: 'Danger', color: '#ff8d8d', code: '#ff8d8d' },
            { label: 'Surface', color: '#fffdf8', code: '#fffdf8' },
        ],
    },
    medieval: {
        slug: 'medieval',
        eyebrow: 'Theme study: medieval parchment and stone',
        title: 'Pixture Chronicle',
        lead: 'A cleaner medieval-inspired direction with parchment surfaces, stonework neutrals, and restrained heraldic accents. The inputs stay practical while larger surfaces carry more atmosphere.',
        paletteTitle: 'Parchment and masonry palette',
        paletteSubtitle: 'Warm paper tones, worn stone neutrals, and muted banners shape the interface without becoming costume design.',
        actionTitle: 'Controls with crafted edges',
        actionSubtitle: 'Buttons and feedback stay usable, but larger containers hint at carved stone and illuminated manuscript framing.',
        formsTitle: 'Scribe-friendly forms',
        formsSubtitle: 'Inputs keep clean proportions and readable contrast while feeling grounded in parchment and ink.',
        disclosureTitle: 'Scroll sections',
        disclosureSubtitle: 'Accordions feel like folded records or chapters inside an archive ledger.',
        tabsTitle: 'Guild tabs',
        tabsSubtitle: 'Tabs borrow from engraved plaques and orderly chapter navigation.',
        previewTitle: 'Court summary',
        previewSubtitle: 'Live values shown in the medieval direction for side-by-side comparison.',
        guidanceTitle: 'When this style works',
        guidanceSubtitle: 'Strong if you want worldbuilding, archives, maps, lore, or heritage-inspired product storytelling.',
        swatches: [
            { label: 'Parchment', color: '#efe1be', code: '#efe1be' },
            { label: 'Stone', color: '#b7b0a3', code: '#b7b0a3' },
            { label: 'Timber', color: '#8a6441', code: '#8a6441' },
            { label: 'Moss', color: '#8da26d', code: '#8da26d' },
            { label: 'Brick', color: '#8d5d50', code: '#8d5d50' },
            { label: 'Ink', color: '#32261f', code: '#32261f' },
        ],
    },
    industrial: {
        slug: 'industrial',
        eyebrow: 'Theme study: industrial age with steampunk influence',
        title: 'Pixture Foundry',
        lead: 'A heavier direction built from iron, brass, soot, leather, and workshop glass. This keeps the component shapes familiar but gives the larger surfaces more engineered character.',
        paletteTitle: 'Foundry materials',
        paletteSubtitle: 'Smoked metal, brass highlights, and pressure-gauge warmth push the UI toward industrial craft.',
        actionTitle: 'Mechanical interactions',
        actionSubtitle: 'Buttons feel riveted and deliberate while status elements borrow from machine panels and dials.',
        formsTitle: 'Workshop controls',
        formsSubtitle: 'Inputs stay clean and legible, with darker housings and brighter brass contrast points.',
        disclosureTitle: 'Panel compartments',
        disclosureSubtitle: 'Accordions behave like tool drawers or instrument compartments.',
        tabsTitle: 'Control rails',
        tabsSubtitle: 'Tabs echo labeled machine rails and switchboard groupings.',
        previewTitle: 'Workshop telemetry',
        previewSubtitle: 'Current state shown as if it were surfaced on a control bench.',
        guidanceTitle: 'When this style works',
        guidanceSubtitle: 'Strong for machinery, strategy, crafting, simulation, or eccentric invention-oriented experiences.',
        swatches: [
            { label: 'Brass', color: '#cfa35d', code: '#cfa35d' },
            { label: 'Copper', color: '#a66a4d', code: '#a66a4d' },
            { label: 'Iron', color: '#6f737c', code: '#6f737c' },
            { label: 'Smoke', color: '#40464f', code: '#40464f' },
            { label: 'Steam', color: '#d8d2c4', code: '#d8d2c4' },
            { label: 'Coal', color: '#27282d', code: '#27282d' },
        ],
    },
    sky: {
        slug: 'sky',
        eyebrow: 'Theme study: airy, soft, floating sky',
        title: 'Pixture Breeze',
        lead: 'A gentler direction built from cloud whites, sky blues, feather-light lilac, and a floating spacious layout. It aims for softness without losing structure.',
        paletteTitle: 'Cloud and horizon palette',
        paletteSubtitle: 'Soft skies, vapor-light surfaces, and breezy contrast create a calmer and more uplifting interface.',
        actionTitle: 'Lightweight interactions',
        actionSubtitle: 'Buttons and feedback feel soft and buoyant, with subtle lift instead of hard weight.',
        formsTitle: 'Soft landing forms',
        formsSubtitle: 'Inputs stay very readable, but the overall impression is lighter and more floating than grounded.',
        disclosureTitle: 'Cloud layers',
        disclosureSubtitle: 'Accordions open like layered sky panels instead of heavy containers.',
        tabsTitle: 'Horizon tabs',
        tabsSubtitle: 'Tabs feel like calm navigation rails drifting across the top of a page.',
        previewTitle: 'Breeze summary',
        previewSubtitle: 'Live values shown in the airy sky direction for comparison.',
        guidanceTitle: 'When this style works',
        guidanceSubtitle: 'Strong for wellness, creativity, calm productivity, dreamy storytelling, and gentle consumer products.',
        swatches: [
            { label: 'Sky', color: '#a7d8ff', code: '#a7d8ff' },
            { label: 'Cloud', color: '#f8fbff', code: '#f8fbff' },
            { label: 'Mist', color: '#dfeaff', code: '#dfeaff' },
            { label: 'Sunrise', color: '#ffd7c7', code: '#ffd7c7' },
            { label: 'Lilac', color: '#d9d2ff', code: '#d9d2ff' },
            { label: 'Deep sky', color: '#5e86cc', code: '#5e86cc' },
        ],
    },
} satisfies Record<'default' | 'medieval' | 'industrial' | 'sky', ShowcaseTheme>;

@Component({
    selector: 'app-showcase-page',
    imports: [
        NgStyle,
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
    templateUrl: './showcase-page.component.html',
    styleUrl: './showcase-page.component.scss',
})
export class ShowcasePageComponent {
    private readonly route = inject(ActivatedRoute);

    protected readonly theme = toSignal(
        this.route.data.pipe(
            map((data) => (data['theme'] as ShowcaseTheme | undefined) ?? showcaseThemes['default']),
        ),
        { initialValue: showcaseThemes['default'] },
    );

    protected readonly projectName = signal('Pixture Studio');
    protected readonly notes = signal(
        'A style exploration page that reuses the same component library with local theme overrides.',
    );
    protected readonly wantsUpdates = signal(true);
    protected readonly selectedIntent = signal('gallery');
    protected readonly selectedComponent = signal('accordion');
    protected readonly toasts = signal<UiToast[]>([
        {
            id: 1,
            title: 'Style route ready',
            message: 'This page reuses the same components but overrides the theme locally.',
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
            title: 'How should I read this page?',
            badge: 'Preview',
            content:
                'This route reuses the same component set as the main design system page, but with a different local visual treatment applied through CSS variable overrides.',
        },
        {
            title: 'What is changing here?',
            badge: 'Theme',
            content:
                'Color, typography emphasis, shadows, borders, backgrounds, and overall atmosphere shift between each route while the shared components stay structurally the same.',
        },
        {
            title: 'What stays stable?',
            badge: 'Reuse',
            content:
                'The same reusable buttons, cards, inputs, selectors, tabs, and toasts are still being exercised so the comparison remains fair.',
        },
    ];

    protected readonly tabItems: UiTabItem[] = [
        {
            label: 'Mood',
            caption: 'Core impression',
            content:
                'Judge the emotional feel first: does the style match the product direction and narrative you want to build?',
        },
        {
            label: 'Readability',
            caption: 'Practical usage',
            content:
                'Check headings, buttons, body copy, form controls, and status elements to make sure the style still supports day-to-day product use.',
        },
        {
            label: 'Scalability',
            caption: 'Future product fit',
            content:
                'Think about whether the visual language can scale across settings pages, dashboards, flows, and more content-heavy areas.',
        },
    ];

    protected showToast(tone: UiTone): void {
        const messages: Record<UiTone, string> = {
            primary: 'Primary actions should feel confident and aligned with the chosen route.',
            secondary: 'Secondary actions should support the flow without stealing the scene.',
            tertiary: 'Tertiary actions can help soften or ornament the overall interaction model.',
            success: 'Success feedback should still feel clear in every style.',
            warning: 'Warnings need to stand out even when the mood changes.',
            danger: 'Danger actions need caution and contrast in every direction.',
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
