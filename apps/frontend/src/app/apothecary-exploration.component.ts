import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleExplorationBase } from './style-exploration.base';

@Component({
    selector: 'app-apothecary-exploration',
    imports: [FontAwesomeModule],
    templateUrl: './style-exploration.template.html',
    styleUrl: './apothecary-exploration.component.scss',
})
export class ApothecaryExplorationComponent extends StyleExplorationBase {
    protected readonly config = {
        routeName: 'Apothecary',
        eyebrow: 'Apothecary / botanical / herbal cabinet',
        title: 'Pixture Herbarium',
        lead: 'This route is softer and more handcrafted than industrial, but less theatrical than medieval. It borrows from labels, glass jars, herbal books, and old cabinet drawers.',
        paletteTitle: 'Botanical cabinet palette',
        paletteSubtitle: 'Sage, amber, cream, bark, and dark label ink create a more grounded and organic atmosphere.',
        formsTitle: 'Apothecary forms',
        formsSubtitle: 'Fields feel labeled and tangible, like working with specimens, notes, and recipes rather than pure interface chrome.',
        actionTitle: 'Botanical action set',
        actionSubtitle: 'Buttons, badges, and surfaces feel crafted, paper-labeled, and shelf-ready.',
        previewTitle: 'Cabinet summary',
        previewSubtitle: 'Live values shown as if they belonged in a catalog of ingredients, notes, or remedies.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Best for journaling, curation, craft, ritual, nature themes, wellness-adjacent concepts, or slow and thoughtful tools.',
        swatches: [
            { label: 'Sage', color: '#98a48b', code: '#98a48b' },
            { label: 'Amber', color: '#c99852', code: '#c99852' },
            { label: 'Cream', color: '#f2ead8', code: '#f2ead8' },
            { label: 'Bark', color: '#7a5c46', code: '#7a5c46' },
            { label: 'Herb', color: '#647557', code: '#647557' },
            { label: 'Label ink', color: '#2f2b28', code: '#2f2b28' },
        ],
        accordionItems: [
            {
                title: 'What makes this different from medieval?',
                content: 'This route feels more domestic, natural, and catalog-based rather than ceremonial or stone-built.',
            },
            {
                title: 'What feels strongest here?',
                content: 'Labels, drawers, soft paper panels, and bottle-or-journal energy make the route feel specific without becoming noisy.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Great for botanical tools, journaling, curation, crafting, alchemy-lite ideas, and slower reflective products.',
            },
        ],
        tabs: [
            { label: 'Shelf', title: 'Cabinet mood', body: 'The route should feel organized, warm, and tactile.' },
            { label: 'Note', title: 'Label clarity', body: 'The product still needs clear labels, readable fields, and tidy actions.' },
            { label: 'Craft', title: 'Craft identity', body: 'This direction works well when the product benefits from a thoughtful handmade atmosphere.' },
        ],
        guidancePoints: [
            'Use botanical cues through palette and material, not novelty leaf decorations.',
            'Keep form controls calm and readable.',
            'Let labels, sections, and small accents do most of the theming work.',
            'Aim for cabinet and journal, not fantasy potion clutter.',
        ],
    };
}
