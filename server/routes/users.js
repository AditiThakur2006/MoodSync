/* ============================================
   MoodSync — User Routes
   GET    /api/users/profile
   PUT    /api/users/profile
   PUT    /api/users/password
   PUT    /api/users/preferences
   DELETE /api/users/account
   ============================================ */

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth, destroySession } = require('../session');

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

// ---- Get Profile ----
router.get('/profile', (req, res) => {
  const user = db.findById('users', req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { password, ...safeUser } = user;

  // Get additional stats
  const sessions = db.findMany('sessions', s => s.userId === req.userId);
  const moodHistory = db.findMany('moods', m => m.userId === req.userId);

  res.json({
    user: safeUser,
    stats: {
      totalStudyMinutes: user.totalStudyMinutes || 0,
      sessionsCompleted: user.sessionsCompleted || 0,
      totalSessions: sessions.length,
      moodHistory: moodHistory.slice(-20) // last 20
    }
  });
});

// ---- Update Profile ----
router.put('/profile', (req, res) => {
  const { name, email } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  // Check if email is taken by another user
  const emailLower = email.toLowerCase().trim();
  const existing = db.findOne('users', u => u.email === emailLower && u.id !== req.userId);
  if (existing) {
    return res.status(409).json({ error: 'This email is already in use by another account.' });
  }

  const updated = db.update('users', req.userId, {
    name: name.trim(),
    email: emailLower
  });

  if (!updated) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { password, ...safeUser } = updated;
  res.json({ message: 'Profile updated successfully.', user: safeUser });
});

// ---- Change Password ----
router.put('/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const user = db.findById('users', req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  db.update('users', req.userId, { password: hashedPassword });
  res.json({ message: 'Password changed successfully.' });
});

// ---- Update Preferences ----
router.put('/preferences', (req, res) => {
  const { theme, defaultTimer, defaultMood, notificationSound } = req.body;

  const user = db.findById('users', req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const preferences = {
    ...(user.preferences || {}),
    ...(theme !== undefined && { theme }),
    ...(defaultTimer !== undefined && { defaultTimer: parseInt(defaultTimer, 10) }),
    ...(defaultMood !== undefined && { defaultMood }),
    ...(notificationSound !== undefined && { notificationSound: Boolean(notificationSound) })
  };

  db.update('users', req.userId, { preferences });
  res.json({ message: 'Preferences saved.', preferences });
});

// ---- Delete Account ----
router.delete('/account', (req, res) => {
  // Delete user's sessions
  const sessions = db.findMany('sessions', s => s.userId === req.userId);
  sessions.forEach(s => db.remove('sessions', s.id));

  // Delete user's mood history
  const moods = db.findMany('moods', m => m.userId === req.userId);
  moods.forEach(m => db.remove('moods', m.id));

  // Delete user
  db.remove('users', req.userId);

  // Destroy session
  if (req.sessionToken) {
    destroySession(req.sessionToken);
  }

  res.json({ message: 'Account deleted successfully.' });
});

module.exports = router;
