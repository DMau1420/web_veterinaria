import { Routes } from '@angular/router';
import { Login } from './pages/general/auth/login/login';
import { Register } from './pages/general/auth/register/register';
import { DashboardAdmin } from './pages/admin/dashboard-admin/dashboard-admin';
import { DashboardUser } from './pages/user/dashboard-user/dashboard-user';
import { PacientesAdmin } from './pages/admin/pacientes-admin/pacientes-admin';
import { LandingComponent } from './pages/general/landing/landing';
import { CitasAdmin } from './pages/admin/citas-admin/citas-admin';
import { Miscitas } from './pages/user/miscitas/miscitas';
import { Mismascotas } from './pages/user/mismascotas/mismascotas';



export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'dashboard', component: DashboardAdmin},
    {path: 'pacientes', component: PacientesAdmin},
    {path: 'citas', component: CitasAdmin},
    {path: 'dashboard-user', component: DashboardUser},
    {path: 'mismascotas', component: Mismascotas},
    {path: 'miscitas', component: Miscitas}
];
