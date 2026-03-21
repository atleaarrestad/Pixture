import { signal } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { UiTone } from './ui/ui.types';

export interface ExplorationSwatch {
    label: string;
    color: string;
    code: string;
}

export interface ExplorationAccordionItem {
    title: string;
    content: string;
}

export interface ExplorationTab {
    label: string;
    title: string;
    body: string;
}

export interface ExplorationConfig {
    routeName: string;
    eyebrow: string;
    title: string;
    lead: string;
    paletteTitle: string;
    paletteSubtitle: string;
    formsTitle: string;
    formsSubtitle: string;
    actionTitle: string;
    actionSubtitle: string;
    previewTitle: string;
    previewSubtitle: string;
    guidanceTitle: string;
    guidanceSubtitle: string;
    swatches: ExplorationSwatch[];
    accordionItems: ExplorationAccordionItem[];
    tabs: ExplorationTab[];
    guidancePoints: string[];
}

export abstract class StyleExplorationBase {
    protected abstract readonly config: ExplorationConfig;

    protected readonly closeIcon = faXmark;
    protected readonly projectName = signal('Pixture Studio');
    protected readonly notes = signal('Use this page to judge whether the mood still supports a practical UI.');
    protected readonly selectedIntent = signal('gallery');
    protected readonly selectedComponent = signal('accordion');
    protected readonly keepShortlist = signal(true);
    protected readonly activeTab = signal(0);
    protected readonly toasts = signal([
        {
            id: 1,
            title: 'Route preview ready',
            message: 'This page uses custom style-specific components instead of the neobrutalist shared ones.',
            tone: 'success' as UiTone,
        },
    ]);

    private nextToastId = 2;

    protected readonly intentOptions = ['gallery', 'editor', 'marketplace'];
    protected readonly componentOptions = ['accordion', 'tabs', 'toast', 'form controls'];

    protected showToast(tone: UiTone): void {
        const messages: Record<UiTone, string> = {
            primary: 'Primary actions should feel native to this route, not borrowed from another style system.',
            secondary: 'Secondary actions should support the route without flattening its mood.',
            tertiary: 'Tertiary actions can carry some ornament if readability stays strong.',
            success: 'Success feedback should remain clear even in a more stylized interface.',
            warning: 'Warnings should stand out without collapsing the route’s personality.',
            danger: 'Danger actions still need unmistakable caution.',
            neutral: 'Neutral toasts are useful for lightweight status updates.',
        };

        this.toasts.update((current) => [
            ...current,
            {
                id: this.nextToastId++,
                title: `${this.config.routeName} ${tone} toast`,
                message: messages[tone],
                tone,
            },
        ]);
    }

    protected dismissToast(id: number): void {
        this.toasts.update((current) => current.filter((toast) => toast.id !== id));
    }

    protected updateProjectName(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        this.projectName.set(element?.value ?? '');
    }

    protected updateSelectedIntent(event: Event): void {
        const element = event.target as HTMLSelectElement | null;
        this.selectedIntent.set(element?.value ?? '');
    }

    protected updateSelectedComponent(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        this.selectedComponent.set(element?.value ?? '');
    }

    protected updateNotes(event: Event): void {
        const element = event.target as HTMLTextAreaElement | null;
        this.notes.set(element?.value ?? '');
    }

    protected updateKeepShortlist(event: Event): void {
        const element = event.target as HTMLInputElement | null;
        this.keepShortlist.set(element?.checked ?? false);
    }
}
