import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleExplorationBase } from './style-exploration.base';

@Component({
    selector: 'app-medieval-exploration',
    imports: [FontAwesomeModule],
    templateUrl: './style-exploration.template.html',
    styleUrl: './medieval-exploration.component.scss',
})
export class MedievalExplorationComponent extends StyleExplorationBase {
    protected readonly config = {
        routeName: 'Medieval',
        eyebrow: 'Medieval direction / parchment, stone, timber',
        title: 'Pixture Chronicle',
        lead: 'This version treats the interface more like an illuminated archive: parchment fields, carved panels, restrained heraldry, and masonry-weight containers without making the inputs impractical.',
        paletteTitle: 'Parchment and masonry palette',
        paletteSubtitle: 'Scroll-paper warmth and stone neutrals carry the mood, while timber and moss only appear as accents.',
        formsTitle: 'Scribe-friendly forms',
        formsSubtitle: 'Fields are quieter and cleaner than the larger containers so the page still feels usable, not theatrical.',
        actionTitle: 'Crafted action set',
        actionSubtitle: 'Buttons and feedback are shaped to feel made, carved, or bound rather than printed from the neobrutal system.',
        previewTitle: 'Court summary',
        previewSubtitle: 'Live values shown as if they belonged in a ledger, court archive, or guild registry.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Best when you want atmosphere, lore, archive energy, or a sense of handcrafted worldbuilding.',
        swatches: [
            { label: 'Parchment', color: '#efe1be', code: '#efe1be' },
            { label: 'Stone', color: '#b7b0a3', code: '#b7b0a3' },
            { label: 'Timber', color: '#8a6441', code: '#8a6441' },
            { label: 'Moss', color: '#8da26d', code: '#8da26d' },
            { label: 'Brick', color: '#8d5d50', code: '#8d5d50' },
            { label: 'Ink', color: '#32261f', code: '#32261f' },
        ],
        accordionItems: [
            {
                title: 'How far should the fantasy go?',
                content: 'This route works best when the larger surfaces carry the mood and the controls stay sensible and readable.',
            },
            {
                title: 'What feels strongest here?',
                content: 'Cards, tabs, headers, and section containers can take on manuscript or carved-stone details more confidently than text inputs should.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Great for archives, maps, stories, strategy, lore-heavy products, or historically flavored creative tools.',
            },
        ],
        tabs: [
            { label: 'Archive', title: 'Archive mood', body: 'The route feels stored, preserved, and ceremonial.' },
            { label: 'Guild', title: 'Guild utility', body: 'Controls still need to feel practical enough for regular product use.' },
            { label: 'Lore', title: 'Lore potential', body: 'This direction can carry rich storytelling without changing the product structure.' },
        ],
        guidancePoints: [
            'Let the larger surfaces hold the strongest medieval cues.',
            'Keep the fields readable and less ornamental.',
            'Use carved or framed shapes instead of cartoon fantasy assets.',
            'Aim for manuscript and masonry, not costume drama.',
        ],
    };
}
