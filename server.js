/* ============================================
   MoodSync — Express Server
   ============================================ */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { authMiddleware } = require('./server/session');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session/auth middleware for all routes
app.use(authMiddleware);

// ---- Request Logger ----
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  // Only log API requests
  if (url.startsWith('/api')) {
    console.log(`[${timestamp}] ${method} ${url}`);
  }

  next();
});

// ---- Health Check (before auth-protected routes) ----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    name: 'MoodSync API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ---- API Routes ----
const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/users');
const sessionRoutes = require('./server/routes/sessions');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', sessionRoutes); // /api/sessions and /api/moods

// ---- Serve Static Files ----
// Serve frontend static files (css, js, assets, index.html)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve index.html for root and SPA fallback
app.use((req, res, next) => {
  // Skip API routes
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found.' });
  }
  // Serve index.html for all other non-file requests (SPA routing)
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ---- Error Handler ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║                                          ║');
  console.log('  ║   🎵  MoodSync Server is running!  🎵    ║');
  console.log('  ║                                          ║');
  console.log(`  ║   Local:  http://localhost:${PORT}          ║`);
  console.log('  ║                                          ║');
  console.log('  ║   API:    /api/health                    ║');
  console.log('  ║   Auth:   /api/auth/signup               ║');
  console.log('  ║           /api/auth/login                ║');
  console.log('  ║   Users:  /api/users/profile             ║');
  console.log('  ║   Data:   /api/sessions                  ║');
  console.log('  ║           /api/moods                     ║');
  console.log('  ║                                          ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
