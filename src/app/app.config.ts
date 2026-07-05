import { ApplicationConfig, PLATFORM_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { isPlatformBrowser } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (platformId: Object) => {
        if (isPlatformBrowser(platformId)) {
          return localStorage.getItem('locale') || 'pl-PL';
        }
        return 'pl-PL';
      },
      deps: [PLATFORM_ID],
    },
    provideNativeDateAdapter(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};
