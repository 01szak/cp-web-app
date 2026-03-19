import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/pages/landing-page.component')
      .then(m => m.LandingPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
