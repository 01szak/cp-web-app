import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { rxResource } from '@angular/core/rxjs-interop';
import { CamperPlaceDTO } from './app/features/reservation/components/reservation-form/reservation-form';
import { HttpHeaders } from '@angular/common/http';
import { async } from 'rxjs';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

const API_URL: string = process.env['WEB_APP_API_URL'] || 'http://localhost:8080';
//TODO this should be taken from jenkins credentials
const ORG_ID = process.env['WEB_APP_ORG_ID'] || '1';
const API_KEY = process.env['WEB_APP_API_KEY'] || 'abc123';
const API_REQUEST_HEADERS: HeadersInit = {
  'Accept': 'application/json',
  'X-org-id': ORG_ID,
  'X-api-key': API_KEY
}
const API_RESPONSE_HEADERS: HeadersInit = {
  'Content-Type': 'application/json'
};

async function parceoFetch(path: string, options: RequestInit = {}){
  return fetch(`${API_URL}/${path}`, {
      ...options,
    headers: API_REQUEST_HEADERS
  })
}

app.get('api/camperPlace', async(req, res) => {
  const response = await parceoFetch('api/camperPlace');
  const data = response.json();
  res.status(response.status).json(data);
})

app.get('/api/camperPlace/occupancy/:id', async (req, res) => {
  const response = await parceoFetch(`/camperPlace/occupancy/${req.params.id}`);
  const data = await response.json();
  res.status(response.status).json(data);
});

app.get('/api/camperPlace/calcPrice/:id/:checkin/:checkout', async (req, res) => {
  const { id, checkin, checkout } = req.params;
  const response = await parceoFetch(`/camperPlace/calcPrice/${id}/${checkin}/${checkout}`);
  const data = await response.json();
  res.status(response.status).json(data);
});

app.post('/api/web/reservation/init', async (req, res) => {
  const response = await parceoFetch('/web/reservation/init', {
    method: 'POST',
    headers: API_RESPONSE_HEADERS,
    body: JSON.stringify(req.body),
  });

  const data = await response.json();

  res.status(response.status).json(data);
});

app.post('/api/web/reservation/verify/:targetId', async (req, res) => {
  const params: { targetId: string } = req.params;
  const response = await parceoFetch(`/web/reservation/verify/${params.targetId}`, {
    method: 'POST',
    headers: API_RESPONSE_HEADERS,
    body: JSON.stringify(req.body),
  });

  const data = await response.json();

  res.status(response.status).json(data);
});
