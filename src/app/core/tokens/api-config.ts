import { InjectionToken, StateKey, makeStateKey } from '@angular/core';

/**
 * Web app API key sent as the `X-api-key` header on every backend call.
 *
 * In prod/test it comes from the Jenkins credential `web_app_api_key_for_orgId-1`
 * (see Jenkinsfile), injected into the SSR process as the `WEB_APP_API_KEY`
 * environment variable. The server render reads it from `process.env`, ships it
 * to the browser via `TransferState`, and the client picks it up from there.
 *
 * Locally (no env var set) it falls back to `DEV_API_KEY` so `npm start` keeps
 * working against the proxied backend.
 */
export const WEB_APP_API_KEY = new InjectionToken<string>('WEB_APP_API_KEY');

/** TransferState slot used to hand the key from the server render to the client. */
export const WEB_APP_API_KEY_STATE: StateKey<string> = makeStateKey<string>('WEB_APP_API_KEY');

/** Fallback key for local development only. */
export const DEV_API_KEY = '123abc';
