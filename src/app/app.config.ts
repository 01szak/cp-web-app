import {
  ApplicationConfig,
  PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
 import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';

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
    provideHttpClient(withFetch()),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({ includePostRequests: true }),
    ),
  ],
};
