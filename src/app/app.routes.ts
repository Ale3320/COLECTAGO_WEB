import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { CampaignComponent } from './components/campaign/campaign';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail';
//import { CampaignCreateComponent } from './components/campaign-create/campaign-create';
import { LoginComponent } from './components/authentication/login/login';
import { SignupComponent } from './components/authentication/signup/signup';

export const routes: Routes = [
    {path: '', component: HomeComponent },
    {path: 'campaigns', component: CampaignComponent},
    { path: 'campaign/:id', component: CampaignDetailComponent },
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
];
