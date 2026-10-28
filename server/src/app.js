const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');

const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');
const { getTheme } = require('./utils/themeCache');

const app = express();

// Trust reverse proxy (e.g. Render, Railway, Heroku, Nginx, Cloudflare)
// Required for secure cookies, correct client IP behind proxies, and rate limiting
app.set('trust proxy', 1);

// Static uploads serving with cross-origin headers
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, '../uploads'))
);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'https:', 'http:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...clientUrls,
  'https://ranjit-sharma.onrender.com',
  process.env.RENDER_EXTERNAL_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:4173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any localhost/127.0.0.1 port in non-production
      const isLocalhost =
        process.env.NODE_ENV !== 'production' &&
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      // Allow Render domains (*.onrender.com)
      const isRender = /^https:\/\/[a-zA-Z0-9-]+\.onrender\.com$/.test(origin);

      if (allowedOrigins.includes(origin) || isLocalhost || isRender) {
        return callback(null, true);
      }

      // Check if origin matches host
      try {
        const originUrl = new URL(origin);
        if (
          process.env.RENDER_EXTERNAL_HOSTNAME &&
          originUrl.hostname === process.env.RENDER_EXTERNAL_HOSTNAME
        ) {
          return callback(null, true);
        }
      } catch (e) {}

      // Reject without throwing a 500 server error
      return callback(null, false);
    },
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// NoSQL injection sanitization
app.use(mongoSanitize());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// General rate limit
app.use('/api', generalLimiter);

// Database connection check - do not serve requests or dummy data if DB is disconnected
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is currently unavailable. No data can be retrieved.',
      data: null,
    });
  }
  next();
});

// Routes
app.use('/api/v1', publicRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Serve production client build if client/dist exists (Unified Render Web Service)
const fs = require('fs');
const possibleDistPaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), 'dist'),
];
const clientDistPath = possibleDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

if (clientDistPath) {
  console.log(`📦 Serving static client from: ${clientDistPath}`);
  // Use index: false so all root and page HTML requests are injected with active theme attributes
  app.use(express.static(clientDistPath, { index: false }));

  let cachedIndexHtml = null;

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache');

    try {
      if (!cachedIndexHtml || process.env.NODE_ENV !== 'production') {
        cachedIndexHtml = fs.readFileSync(path.join(clientDistPath, 'index.html'), 'utf8');
      }

      const { themeMode, accentColor } = getTheme();
      const currentMode = themeMode || 'dark';
      const currentColor = accentColor || 'emerald';

      let html = cachedIndexHtml;

      // Inject data-theme and data-color directly into <html ...> from the very first byte
      html = html.replace(/<html([^>]*)>/i, (match, attrs) => {
        const cleanAttrs = attrs
          .replace(/\s*data-theme=["'][^"']*["']/gi, '')
          .replace(/\s*data-color=["'][^"']*["']/gi, '');
        return `<html${cleanAttrs} data-theme="${currentMode}" data-color="${currentColor}">`;
      });

      // Inject window.__INITIAL_THEME__ right after <head>
      const themeScript = `<script>window.__INITIAL_THEME__ = ${JSON.stringify({
        themeMode: currentMode,
        accentColor: currentColor,
      })};</script>`;

      html = html.replace(/<head>/i, `<head>\n    ${themeScript}`);

      res.status(200).contentType('text/html').send(html);
    } catch (err) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
} else {
  console.warn('⚠️  client/dist/index.html not found! Checked locations:', possibleDistPaths);
  app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Portfolio API Live</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B0D0C; color: #F5F7F5; padding: 3rem 1.5rem; text-align: center; }
            .card { max-width: 580px; margin: 0 auto; background: #151916; border: 1px solid #29342F; border-radius: 16px; padding: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
            h1 { color: #00D6A0; margin-top: 0; }
            code { background: #1B201D; padding: 0.2rem 0.5rem; border-radius: 4px; color: #00D6A0; border: 1px solid #29342F; font-size: 0.95em; }
            pre { background: #1B201D; padding: 0.85rem; border-radius: 8px; color: #00D6A0; border: 1px solid #29342F; overflow-x: auto; text-align: left; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🚀 Backend API is Live</h1>
            <p>Database connected. API endpoints at <code>/api/v1/profile</code>, <code>/api/v1/projects</code>, etc. are responding.</p>
            <p>To serve the visual portfolio on this domain, update Render's <strong>Build Command</strong> to:</p>
            <pre>npm install --include=dev && npm run build</pre>
          </div>
        </body>
      </html>
    `);
  });
}

// Centralized error handler
app.use(errorHandler);

module.exports = app;
