import { Routes } from '@angular/router';
import { Login } from './pages/general/auth/login/login';
import { Register } from './pages/general/auth/register/register';
import { DashboardAdmin } from './pages/admin/dashboard-admin/dashboard-admin';
import { DashboardUser } from './pages/user/dashboard-user/dashboard-user';
import { PacientesAdmin } from './pages/admin/pacientes-admin/pacientes-admin';
import { LandingComponent } from './pages/general/landing/landing';
import { CitasAdmin } from './pages/admin/citas-admin/citas-admin';



export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'dashboard', component: DashboardAdmin},
    {path: 'dashboard-user', component: DashboardUser},
    {path: 'pacientes', component: PacientesAdmin},
    {path: 'citas', component: CitasAdmin}
];
