import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleExplorationBase } from './style-exploration.base';

@Component({
    selector: 'app-art-deco-exploration',
    imports: [FontAwesomeModule],
    templateUrl: './style-exploration.template.html',
    styleUrl: './art-deco-exploration.component.scss',
})
export class ArtDecoExplorationComponent extends StyleExplorationBase {
    protected readonly config = {
        routeName: 'Art Deco',
        eyebrow: 'Art deco / gilded noir / cinematic geometry',
        title: 'Pixture Royale',
        lead: 'This route leans into lacquer black, pearl, brass, and stepped geometry. It should feel glamorous, architectural, and premium without becoming hard to use.',
        paletteTitle: 'Gilded noir palette',
        paletteSubtitle: 'Black enamel, champagne gold, ivory, and emerald accents define the overall mood.',
        formsTitle: 'Salon-grade controls',
        formsSubtitle: 'The fields are cleaner than the decorative shells around them, keeping the route usable despite the luxury styling.',
        actionTitle: 'Marquee action set',
        actionSubtitle: 'Buttons and status elements aim to feel like crafted plaques, cinema programs, or hotel signage.',
        previewTitle: 'Lobby summary',
        previewSubtitle: 'Live values shown as if presented on a grand foyer control surface.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Best for premium storytelling, gallery products, hospitality energy, luxury tooling, or anything that wants elegance with structure.',
        swatches: [
            { label: 'Onyx', color: '#191715', code: '#191715' },
            { label: 'Champagne', color: '#d1b06f', code: '#d1b06f' },
            { label: 'Pearl', color: '#f4ead8', code: '#f4ead8' },
            { label: 'Emerald', color: '#295b50', code: '#295b50' },
            { label: 'Bronze', color: '#8c6540', code: '#8c6540' },
            { label: 'Smoke', color: '#4a433d', code: '#4a433d' },
        ],
        accordionItems: [
            {
                title: 'What makes this feel deco instead of generic luxury?',
                content: 'Stepped geometry, strong contrast, metallic framing, and ceremonial symmetry are the key signals.',
            },
            {
                title: 'What needs restraint here?',
                content: 'Inputs and selectors still need to feel modern and usable; the ornament should stay around them, not on top of them.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Strong for portfolio products, creative tools, premium publishing, gallery-like experiences, and cinematic brands.',
            },
        ],
        tabs: [
            { label: 'Luxe', title: 'Luxury mood', body: 'The route should feel polished, dressed, and intentionally staged.' },
            { label: 'Clarity', title: 'Clarity under ornament', body: 'The premium styling still needs firm hierarchy and sharp action affordances.' },
            { label: 'Brand', title: 'Brand potential', body: 'This route can create a memorable premium identity if the product supports it.' },
        ],
        guidancePoints: [
            'Use geometric framing and metallic contrast more than texture overload.',
            'Keep the fields and interaction states crisp and modern.',
            'Let headings and section frames carry the strongest personality.',
            'Aim for elegance and rhythm, not decorative clutter.',
        ],
    };
}
