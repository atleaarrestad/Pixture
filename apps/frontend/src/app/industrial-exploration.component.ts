import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleExplorationBase } from './style-exploration.base';

@Component({
    selector: 'app-industrial-exploration',
    imports: [FontAwesomeModule],
    templateUrl: './style-exploration.template.html',
    styleUrl: './industrial-exploration.component.scss',
})
export class IndustrialExplorationComponent extends StyleExplorationBase {
    protected readonly config = {
        routeName: 'Industrial',
        eyebrow: 'Industrial age / foundry, brass, pressure glass',
        title: 'Pixture Foundry',
        lead: 'This version leans into engineered housings, brass accents, steel panels, and workshop instrumentation. It should feel heavier and more mechanical without becoming cluttered.',
        paletteTitle: 'Foundry materials',
        paletteSubtitle: 'Brass, copper, smoke, and machine steel form the visual language instead of soft pastel blocks.',
        formsTitle: 'Workshop controls',
        formsSubtitle: 'Form fields resemble practical machine controls and instrument housings rather than decorative ornaments.',
        actionTitle: 'Mechanical action set',
        actionSubtitle: 'Buttons, badges, and toasts are shaped to feel engineered, riveted, and weight-bearing.',
        previewTitle: 'Workshop telemetry',
        previewSubtitle: 'Live values shown as if they belonged on a pressure board or bench instrument panel.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Best when you want machinery, invention, workshop grit, or a more engineered steampunk-adjacent product feel.',
        swatches: [
            { label: 'Brass', color: '#cfa35d', code: '#cfa35d' },
            { label: 'Copper', color: '#a66a4d', code: '#a66a4d' },
            { label: 'Iron', color: '#6f737c', code: '#6f737c' },
            { label: 'Smoke', color: '#40464f', code: '#40464f' },
            { label: 'Steam', color: '#d8d2c4', code: '#d8d2c4' },
            { label: 'Coal', color: '#27282d', code: '#27282d' },
        ],
        accordionItems: [
            {
                title: 'What sells the industrial feeling?',
                content: 'Layered panels, machined edges, brass contrast, and a more instrument-like layout language do most of the work.',
            },
            {
                title: 'What should stay restrained?',
                content: 'Inputs, selectors, and body copy still need strong clarity. The style should feel engineered, not overloaded.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Great for strategy, simulation, crafting, management, mechanical tools, and fiction grounded in invention or machinery.',
            },
        ],
        tabs: [
            { label: 'Machine', title: 'Machine mood', body: 'The route feels heavy, built, and calibrated.' },
            { label: 'Control', title: 'Control clarity', body: 'Controls should stay understandable even when the atmosphere gets more tactile.' },
            { label: 'Steam', title: 'Steampunk edge', body: 'Use atmosphere and material cues more than whimsical props.' },
        ],
        guidancePoints: [
            'Use layered metal and brass framing as the main signature.',
            'Keep the page readable like a real control surface.',
            'Prefer workshop realism over novelty gadgets.',
            'Let contrast and hierarchy feel deliberate and engineered.',
        ],
    };
}
