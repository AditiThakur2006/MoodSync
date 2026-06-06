/* ============================================
   MoodSync — Session & Mood Routes
   POST /api/sessions       — Log a study session
   GET  /api/sessions       — Get study sessions
   GET  /api/sessions/stats — Get study stats
   POST /api/moods          — Log a mood selection
   GET  /api/moods          — Get mood history
   GET  /api/moods/favorite — Get favorite mood
   ============================================ */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../session');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// ==================== STUDY SESSIONS ====================

// ---- Log a study session ----
router.post('/sessions', (req, res) => {
  const { minutes, mood } = req.body;

  if (!minutes || minutes < 1) {
    return res.status(400).json({ error: 'Session duration in minutes is required.' });
  }

  const validMoods = ['happy', 'relaxing', 'sad', 'energetic'];
  const sessionMood = validMoods.includes(mood) ? mood : 'happy';

  const session = {
    id: uuidv4(),
    userId: req.userId,
    minutes: parseInt(minutes, 10),
    mood: sessionMood,
    completedAt: new Date().toISOString()
  };

  db.create('sessions', session);

  // Update user stats
  const user = db.findById('users', req.userId);
  if (user) {
    db.update('users', req.userId, {
      totalStudyMinutes: (user.totalStudyMinutes || 0) + session.minutes,
      sessionsCompleted: (user.sessionsCompleted || 0) + 1
    });
  }

  res.status(201).json({ message: 'Study session logged!', session });
});

// ---- Get study sessions ----
router.get('/sessions', (req, res) => {
  const sessions = db.findMany('sessions', s => s.userId === req.userId);

  // Sort by most recent
  sessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // Optional limit
  const limit = parseInt(req.query.limit, 10) || 50;
  res.json({ sessions: sessions.slice(0, limit) });
});

// ---- Get study stats ----
router.get('/sessions/stats', (req, res) => {
  const user = db.findById('users', req.userId);
  const sessions = db.findMany('sessions', s => s.userId === req.userId);

  // Calculate stats
  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const totalSessions = sessions.length;
  const averageSession = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Sessions by mood
  const sessionsByMood = {};
  sessions.forEach(s => {
    sessionsByMood[s.mood] = (sessionsByMood[s.mood] || 0) + 1;
  });

  // Last 7 days breakdown
  const now = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const daySessions = sessions.filter(s => s.completedAt.startsWith(dateStr));
    last7Days.push({
      date: dateStr,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: daySessions.length,
      minutes: daySessions.reduce((sum, s) => sum + s.minutes, 0)
    });
  }

  res.json({
    totalMinutes,
    totalHours: (totalMinutes / 60).toFixed(1),
    totalSessions,
    averageSession,
    sessionsCompleted: user?.sessionsCompleted || totalSessions,
    sessionsByMood,
    last7Days
  });
});

// ==================== MOOD HISTORY ====================

// ---- Log a mood selection ----
router.post('/moods', (req, res) => {
  const { mood } = req.body;
  const validMoods = ['happy', 'relaxing', 'sad', 'energetic'];

  if (!mood || !validMoods.includes(mood)) {
    return res.status(400).json({ error: 'Valid mood required: happy, relaxing, sad, or energetic.' });
  }

  const moodEntry = {
    id: uuidv4(),
    userId: req.userId,
    mood,
    selectedAt: new Date().toISOString()
  };

  db.create('moods', moodEntry);
  res.status(201).json({ message: 'Mood logged!', mood: moodEntry });
});

// ---- Get mood history ----
router.get('/moods', (req, res) => {
  const moods = db.findMany('moods', m => m.userId === req.userId);
  moods.sort((a, b) => new Date(b.selectedAt) - new Date(a.selectedAt));

  const limit = parseInt(req.query.limit, 10) || 20;
  res.json({ moods: moods.slice(0, limit) });
});

// ---- Get favorite mood ----
router.get('/moods/favorite', (req, res) => {
  const moods = db.findMany('moods', m => m.userId === req.userId);

  if (moods.length === 0) {
    return res.json({ favorite: 'happy', counts: {} });
  }

  const counts = {};
  moods.forEach(m => {
    counts[m.mood] = (counts[m.mood] || 0) + 1;
  });

  const favorite = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  res.json({ favorite, counts });
});

module.exports = router;
