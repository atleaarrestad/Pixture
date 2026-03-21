import { Routes } from '@angular/router';
import { ComponentsPageComponent } from './components-page.component';
import { HomePageComponent } from './home-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'components', component: ComponentsPageComponent },
];
