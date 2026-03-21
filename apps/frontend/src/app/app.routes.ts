import { Routes } from '@angular/router';
import { ApothecaryExplorationComponent } from './apothecary-exploration.component';
import { ArtDecoExplorationComponent } from './art-deco-exploration.component';
import { ExperimentalExplorationComponent } from './experimental-exploration.component';
import { IndustrialExplorationComponent } from './industrial-exploration.component';
import { MedievalExplorationComponent } from './medieval-exploration.component';
import { ShowcasePageComponent, showcaseThemes } from './showcase-page.component';
import { SkyExplorationComponent } from './sky-exploration.component';
import { SynthwaveExplorationComponent } from './synthwave-exploration.component';

export const routes: Routes = [
    {
        path: '',
        component: ShowcasePageComponent,
        data: { theme: showcaseThemes['default'], bodyTheme: 'default' },
    },
    { path: 'medieval', component: MedievalExplorationComponent, data: { bodyTheme: 'medieval' } },
    {
        path: 'industrial',
        component: IndustrialExplorationComponent,
        data: { bodyTheme: 'industrial' },
    },
    { path: 'sky', component: SkyExplorationComponent, data: { bodyTheme: 'sky' } },
    { path: 'art-deco', component: ArtDecoExplorationComponent, data: { bodyTheme: 'art-deco' } },
    {
        path: 'apothecary',
        component: ApothecaryExplorationComponent,
        data: { bodyTheme: 'apothecary' },
    },
    { path: 'synthwave', component: SynthwaveExplorationComponent, data: { bodyTheme: 'synthwave' } },
    {
        path: 'noir',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'noir', explorationKey: 'noir' },
    },
    {
        path: 'candy',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'candy', explorationKey: 'candy' },
    },
    {
        path: 'zen-garden',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'zen-garden', explorationKey: 'zen-garden' },
    },
    {
        path: 'deep-sea',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'deep-sea', explorationKey: 'deep-sea' },
    },
    {
        path: 'bio-lab',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'bio-lab', explorationKey: 'bio-lab' },
    },
    {
        path: 'volcanic',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'volcanic', explorationKey: 'volcanic' },
    },
    {
        path: 'paper-cut',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'paper-cut', explorationKey: 'paper-cut' },
    },
    {
        path: 'terminal',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'terminal', explorationKey: 'terminal' },
    },
    {
        path: 'lunar',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'lunar', explorationKey: 'lunar' },
    },
    {
        path: 'gemstone',
        component: ExperimentalExplorationComponent,
        data: { bodyTheme: 'gemstone', explorationKey: 'gemstone' },
    },
];
