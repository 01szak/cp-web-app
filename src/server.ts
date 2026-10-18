import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

const API_URL: string = process.env['WEB_APP_API_URL'] || 'http://localhost:8080';
//TODO this should be taken from jenkins credentials
const ORG_ID = process.env['WEB_APP_ORG_ID'] || '2';
const API_KEY = process.env['WEB_APP_API_KEY'] || '123abc';
const API_REQUEST_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-org-id': ORG_ID,
  'X-api-key': API_KEY,
};

app.use((req, res, next) => {
  console.log('REQUEST:', {
    path: req.path,
    method: req.method,
    url: req.originalUrl,
    host: req.headers.host,
    hostname: req.hostname,
    protocol: req.protocol,
    forwardedHost: req.headers['x-forwarded-host'],
    forwardedProto: req.headers['x-forwarded-proto'],
    userAgent: req.headers['user-agent'],
  });
  console.log('API_URL: ' + API_URL);
  console.log('ORG_ID: ' + ORG_ID);
  next()
});

async function parceoFetch(path: string, options: RequestInit = {}) {
  console.log(`SENDING REQUEST TO: ${API_URL}/${path} WITH OPTIONS: ${JSON.stringify(options)}`);
  try {
    return fetch(`${API_URL}/${path}`, {
      ...options,
      headers: API_REQUEST_HEADERS,
    });
  } catch (error) {
    throw error;
  }
}

function proxyGet(route: string, target: (params: Record<string, string>) => string) {
  app.get(route, async (req, res, next) => {
    try {
      const response = await parceoFetch(target(req.params as Record<string, string>));
      res.status(response.status).json(await response.json());
    } catch (error) {
      next(error);
    }
  });
}

function proxyPost(route: string, target: (params: Record<string, string>) => string, withBody: boolean) {
  app.post(route, async (req, res, next) => {
    try {
      const response = await parceoFetch(target(req.params as Record<string, string>), {
        method: 'POST',
        ...(withBody && { body: JSON.stringify(req.body) }),
      });
      res.status(response.status).send(await response.text());
    } catch (error) {
      next(error);
    }
  });
}

proxyGet('/api/camperPlace/occupancy/:cpId', ({ cpId }) => `camperPlace/occupancy/${cpId}`);
proxyGet(
  '/api/camperPlace/calcPrice/:cpId/:checkin/:checkout',
  ({ cpId, checkin, checkout }) => `camperPlace/calcPrice/${cpId}/${checkin}/${checkout}`,
);
proxyGet('/api/camperPlace/available/:from/:to', ({ from, to }) => `camperPlace/available/${from}/${to}`);
proxyPost('/api/camperPlace/findBy', () => 'camperPlace/findBy', true);

// The verify endpoint takes only the path variable; the init endpoint takes a ReservationDTO body.
proxyPost('/api/web/reservation/init', () => 'web/reservation/init', true);
proxyPost('/api/web/reservation/verify/:targetId', ({ targetId }) => `web/reservation/verify/${targetId}`, false);

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
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
