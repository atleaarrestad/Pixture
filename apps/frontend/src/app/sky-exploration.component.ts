import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StyleExplorationBase } from './style-exploration.base';

@Component({
    selector: 'app-sky-exploration',
    imports: [FontAwesomeModule],
    templateUrl: './style-exploration.template.html',
    styleUrl: './sky-exploration.component.scss',
})
export class SkyExplorationComponent extends StyleExplorationBase {
    protected readonly config = {
        routeName: 'Sky',
        eyebrow: 'Airy direction / soft sky, cloud light, float',
        title: 'Pixture Breeze',
        lead: 'This version aims for a softer and more buoyant product feeling. Surfaces feel lighter, edges feel lifted, and the whole page should read as calm rather than heavy.',
        paletteTitle: 'Cloud and horizon palette',
        paletteSubtitle: 'Cloud white, sky blues, sunrise warmth, and pale lilac make the interface feel open and light.',
        formsTitle: 'Soft landing forms',
        formsSubtitle: 'Inputs and selectors feel airy and cushioned, with much less visual weight than the neobrutalist baseline.',
        actionTitle: 'Floating action set',
        actionSubtitle: 'Buttons, badges, toasts, and micro-feedback should feel gentle, lifted, and breathable.',
        previewTitle: 'Breeze summary',
        previewSubtitle: 'Live values shown in a lighter, cloud-like presentation.',
        guidanceTitle: 'Why this route may work',
        guidanceSubtitle: 'Best for calm productivity, wellness, creativity, dreamy storytelling, or any product that wants a gentle emotional tone.',
        swatches: [
            { label: 'Sky', color: '#a7d8ff', code: '#a7d8ff' },
            { label: 'Cloud', color: '#f8fbff', code: '#f8fbff' },
            { label: 'Mist', color: '#dfeaff', code: '#dfeaff' },
            { label: 'Sunrise', color: '#ffd7c7', code: '#ffd7c7' },
            { label: 'Lilac', color: '#d9d2ff', code: '#d9d2ff' },
            { label: 'Deep sky', color: '#5e86cc', code: '#5e86cc' },
        ],
        accordionItems: [
            {
                title: 'What makes this feel airy?',
                content: 'Lower visual weight, softer shadows, larger spacing, cloud-like surfaces, and a brighter vertical rhythm all contribute.',
            },
            {
                title: 'What should remain stable?',
                content: 'Readability and hierarchy still matter. The UI should feel lighter, not vague or washed out.',
            },
            {
                title: 'Where would this fit best?',
                content: 'Great for creativity tools, journaling, wellness, soft social products, and any experience that should feel safe and uplifting.',
            },
        ],
        tabs: [
            { label: 'Lift', title: 'Lift and softness', body: 'The route should feel buoyant, calm, and open.' },
            { label: 'Clarity', title: 'Clarity in lightness', body: 'Even very light interfaces still need strong readability and action hierarchy.' },
            { label: 'Mood', title: 'Emotional tone', body: 'This direction is best when emotional softness is part of the product value.' },
        ],
        guidancePoints: [
            'Use softness and space more than hard decoration.',
            'Keep contrast high enough for practical use.',
            'Let cards and toasts feel floated instead of boxed in.',
            'Aim for calm, not vague or overly washed out.',
        ],
    };
}
