import { mergeApplicationConfig, ApplicationConfig, TransferState, inject } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { DEV_API_KEY, WEB_APP_API_KEY, WEB_APP_API_KEY_STATE } from './core/tokens/api-config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      // Read the key from the environment (set by PM2 from the Jenkins credential)
      // and stash it in TransferState so the hydrated client can read it too.
      provide: WEB_APP_API_KEY,
      useFactory: () => {
        const key = process.env['WEB_APP_API_KEY'] || DEV_API_KEY;
        inject(TransferState).set(WEB_APP_API_KEY_STATE, key);
        return key;
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
