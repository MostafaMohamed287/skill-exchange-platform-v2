import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { Register } from './pages/register/register';
import { ProfileComponent } from './pages/profile/profile';
import { Skills } from './pages/skills/skills';
import { ExchangeRequests } from './pages/exchange-requests/exchange-requests';
import { ReviewComponent } from './pages/reviews/reviews';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: Register },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  { path: 'skills', component: Skills },

  { path: 'exchange', component: ExchangeRequests, canActivate: [authGuard] },

  { path: 'reviews', component: ReviewComponent },

  { path: '**', component: NotFound }
];
