import {
  ApplicationConfig,
  PLATFORM_ID,
  TransferState,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';
 import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { isPlatformBrowser } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { DEV_API_KEY, WEB_APP_API_KEY, WEB_APP_API_KEY_STATE } from './core/tokens/api-config';

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
    {
      // On the client, pick up the key the server render put into TransferState.
      // Server config overrides this with the env-backed value during SSR.
      provide: WEB_APP_API_KEY,
      useFactory: () => inject(TransferState).get(WEB_APP_API_KEY_STATE, DEV_API_KEY),
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
