import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';
import { CampaignComponent } from './components/campaign/campaign';
import { CampaignDetailComponent } from './components/campaign-detail/campaign-detail';
import { CampaignCreateComponent } from './components/campaign-create/campaign-create';
import { MyCampaigns } from './components/my-campaigns/my-campaigns';
import { InvestmentComponent } from './components/investment/investment';
import { LoginComponent } from './components/authentication/login/login';
import { SignupComponent } from './components/authentication/signup/signup';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns';
import { AdminCampaignEditComponent } from './components/admin-campaign-edit/admin-campaign-edit';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'campaigns', component: CampaignComponent },
    { path: 'campaign/:id', component: CampaignDetailComponent },
    { path: 'campaigns/create', component: CampaignCreateComponent },
    { path: 'my-campaigns', component: MyCampaigns },
    { path: 'investment/:id', component: InvestmentComponent }, // <-- nueva
    { path: 'invest/:id', component: InvestmentComponent },     // opcional: alias
    { path: 'investments', component: InvestmentComponent },    // si la necesitas
    { path: 'admin', component: AdminCampaignsComponent },
    { path: 'admin/campaign/:id', component: AdminCampaignEditComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
];
