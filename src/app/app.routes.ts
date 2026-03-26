import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { DashboardUser } from './pages/dashboard-user/dashboard-user';


export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'dashboard', component: Dashboard},
    {path: 'dashboard-user', component: DashboardUser}
];
