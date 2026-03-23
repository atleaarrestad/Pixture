import { Routes } from '@angular/router';
import { BuyRegionPageComponent } from './buy-region-page.component';
import { ComponentsPageComponent } from './components-page.component';
import { HomePageComponent } from './home-page.component';
import { ReservationEditorPageComponent } from './reservation-editor-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'buy-region', component: BuyRegionPageComponent },
    { path: 'reservations/:reservationId/edit', component: ReservationEditorPageComponent },
    { path: 'components', component: ComponentsPageComponent },
];
