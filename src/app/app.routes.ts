import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { CampaignComponent } from './components/campaign/campaign';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail';

export const routes: Routes = [
    {path: '', component: HomeComponent },
    {path: 'campaigns', component: CampaignComponent},
    { path: 'campaign/:id', component: CampaignDetailComponent },
];
