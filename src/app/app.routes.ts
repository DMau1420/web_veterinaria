import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing';
import { Login } from './features/auth/login/login';


export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'login', component: Login}
];
