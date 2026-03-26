import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { DashboardUser } from './pages/dashboard-user/dashboard-user';
import { Pacientes } from './pages/pacientes/pacientes';
import { Citas } from './pages/citas/citas';


export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'dashboard', component: Dashboard},
    {path: 'dashboard-user', component: DashboardUser},
    {path: 'pacientes', component: Pacientes},
    {path: 'citas', component: Citas}
];
