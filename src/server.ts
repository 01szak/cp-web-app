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
  console.log('🔥 REQUEST:', {
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
  console.log(`SENDING REQUEST TO: ${API_URL}/${path} WITH OPTIONS: ${options}`);
  try {
    return fetch(`${API_URL}/${path}`, {
      ...options,
      headers: API_REQUEST_HEADERS,
    });
  } catch (error) {
    throw error;
  }
}

app.get('/api/camperPlace', async (req, res) => {
  const response = await parceoFetch('camperPlace');
  const data = await response.json();
  res.status(response.status).json(data);
});

app.get('/api/camperPlace/occupancy/:id', async (req, res) => {
  const response = await parceoFetch(`camperPlace/occupancy/${req.params.id}`);
  const data = await response.json();
  res.status(response.status).json(data);
});

app.get('/api/camperPlace/calcPrice/:id/:checkin/:checkout', async (req, res) => {
  const { id, checkin, checkout } = req.params;
  const response = await parceoFetch(`camperPlace/calcPrice/${id}/${checkin}/${checkout}`);
  const data = await response.json();
  res.status(response.status).json(data);
});

app.post('/api/web/reservation/init', async (req, res, next) => {
  try {
    const response = await parceoFetch('web/reservation/init', {
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    const text = await response.text();
    res
      .status(response.status)
      .send(text);
  } catch (error) {
    next(error);
  }
});

app.post('/api/web/reservation/verify/:targetId', async (req, res, next) => {
  const params: { targetId: string } = req.params;
  try {
    const response = await parceoFetch(`web/reservation/verify/${params.targetId}`, {
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    next(error);
  }
});

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
