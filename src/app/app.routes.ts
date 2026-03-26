import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { DashboardUser } from './features/dashboard-user/dashboard-user';


export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'dashboard', component: Dashboard},
    {path: 'dashboard-user', component: DashboardUser}
];
