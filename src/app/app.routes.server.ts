import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Reservation flow is rendered per request so the SSR process can inject the
  // runtime API key (from the Jenkins credential) into TransferState.
  { path: 'reservation', renderMode: RenderMode.Server },
  { path: 'reservation/verify/:targetId', renderMode: RenderMode.Server },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
