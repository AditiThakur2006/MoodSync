/* ============================================
   MoodSync — Simple Session Middleware
   ============================================ */

const { v4: uuidv4 } = require('uuid');

// In-memory session store (for simplicity)
// In production, use Redis or a database
const sessions = new Map();

function createSession(userId) {
  const token = uuidv4();
  sessions.set(token, {
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  });
  return token;
}

function getSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  // Check expiry
  if (new Date(session.expiresAt) < new Date()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function destroySession(token) {
  sessions.delete(token);
}

// Middleware to extract user from session
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.userId = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  const session = getSession(token);

  if (!session) {
    req.userId = null;
    return next();
  }

  req.userId = session.userId;
  req.sessionToken = token;
  next();
}

// Middleware that requires auth
function requireAuth(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

module.exports = {
  createSession,
  getSession,
  destroySession,
  authMiddleware,
  requireAuth
};
