import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleExplorationBase } from './style-exploration.base';

@Component({
    selector: 'app-synthwave-exploration',
    imports: [FontAwesomeModule],
    templateUrl: './style-exploration.template.html',
    styleUrl: './synthwave-exploration.component.scss',
})
export class SynthwaveExplorationComponent extends StyleExplorationBase {
    protected readonly config = {
        routeName: 'Synthwave',
        eyebrow: 'Synthwave / neon dusk / retro-futurist glow',
        title: 'Pixture Afterglow',
        lead: 'This route trades softness for nightlife energy: glowing rails, neon gradients, deep twilight surfaces, and retro-futurist panels that still behave like a product UI.',
        paletteTitle: 'Neon dusk palette',
        paletteSubtitle: 'Magenta, cyan, violet, electric blue, and dark night surfaces define the route.',
        formsTitle: 'Retro-future controls',
        formsSubtitle: 'Inputs look like luminous interfaces instead of brutalist slabs or mechanical panels.',
        actionTitle: 'Neon action set',
        actionSubtitle: 'Buttons and feedback should feel powered, luminous, and kinetic without becoming unreadable.',
        previewTitle: 'Afterglow summary',
        previewSubtitle: 'Live values shown as if they belonged in a glowing retro-future console.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Best for entertainment, creative tools, music-adjacent products, game-like experiences, or bold expressive branding.',
        swatches: [
            { label: 'Night', color: '#140f2f', code: '#140f2f' },
            { label: 'Magenta', color: '#ff4fd8', code: '#ff4fd8' },
            { label: 'Cyan', color: '#4be3ff', code: '#4be3ff' },
            { label: 'Violet', color: '#8e6bff', code: '#8e6bff' },
            { label: 'Sunset', color: '#ff9a62', code: '#ff9a62' },
            { label: 'Laser blue', color: '#4f83ff', code: '#4f83ff' },
        ],
        accordionItems: [
            {
                title: 'What sells the synthwave vibe?',
                content: 'Glow, contrast, horizon-like gradients, thin luminous edges, and darker panel depth do most of the work.',
            },
            {
                title: 'What should stay under control?',
                content: 'Typography and form fields still need strong readability, or the route turns into decoration instead of interface.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Great for creative tools, games, media products, music culture, and brands that want a more energetic visual signature.',
            },
        ],
        tabs: [
            { label: 'Glow', title: 'Glow intensity', body: 'The page should feel lit from within, not simply colorful.' },
            { label: 'Focus', title: 'Functional contrast', body: 'Neon is only good if inputs, labels, and action states remain unmistakable.' },
            { label: 'Identity', title: 'Identity value', body: 'This route works best when bold style is an actual part of the product promise.' },
        ],
        guidancePoints: [
            'Use glow and contrast strategically, not everywhere at once.',
            'Keep the forms practical and readable even in dark surfaces.',
            'Let gradients and edge lighting create the strongest personality.',
            'Aim for stylish retro-future, not chaotic arcade overload.',
        ],
    };
}
