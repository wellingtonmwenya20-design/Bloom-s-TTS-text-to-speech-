import express from 'express';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LANGUAGES, detectLanguage } from '../public/js/languages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const pkg = JSON.parse(readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// Render assigns the port through the PORT environment variable.
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production';
const MAX_TEXT_LENGTH = 5000;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Render terminates TLS in front of the app.

// Basic security headers (no extra dependency needed).
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; " +
      "connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
  );
  next();
});

app.use(express.json({ limit: '20kb' }));

// Health check used by Render.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: pkg.name,
    version: pkg.version,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Basic app info (the frontend shows this in its status badge).
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Bloom TTS',
    version: pkg.version,
    engine: 'browser-speechsynthesis',
    maxTextLength: MAX_TEXT_LENGTH,
    languages: LANGUAGES.length
  });
});

// Language registry. "engine" tells clients whether speech is realistically available.
app.get('/api/languages', (req, res) => {
  res.json({ languages: LANGUAGES });
});

// Language detection for API clients.
app.post('/api/detect', (req, res) => {
  const text = req.body && req.body.text;
  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Send JSON like {"text": "..."} with non-empty text.' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(413).json({ error: `Text is too long (max ${MAX_TEXT_LENGTH} characters).` });
  }
  const { code, confidence, reliable } = detectLanguage(text);
  return res.json({ code, confidence, reliable });
});

// Unknown API routes return JSON, not HTML.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Frontend.
app.use(
  express.static(publicDir, {
    maxAge: isProduction ? '1h' : 0,
    index: 'index.html'
  })
);

app.use((req, res) => {
  res.status(404).type('text/plain').send('404 - Not found');
});

// Error handler (e.g. malformed JSON bodies).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Bloom TTS v${pkg.version} listening on http://${HOST}:${PORT}`);
});

// Render's proxy keeps connections alive; avoid dropping them early.
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

function shutdown(signal) {
  console.log(`${signal} received, shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
