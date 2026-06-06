/* ============================================
   MoodSync — Auth Routes
   POST /api/auth/signup
   POST /api/auth/login
   POST /api/auth/logout
   GET  /api/auth/me
   ============================================ */

const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { createSession, destroySession, requireAuth } = require('../session');

const router = express.Router();

// ---- Sign Up ----
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists
    const existingUser = db.findOne('users', u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      totalStudyMinutes: 0,
      sessionsCompleted: 0,
      preferences: {
        theme: 'dark',
        defaultTimer: 25,
        defaultMood: 'happy',
        notificationSound: true
      }
    };

    db.create('users', user);

    // Create session
    const token = createSession(user.id);

    // Return user (without password)
    const { password: _, ...safeUser } = user;
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ---- Log In ----
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = db.findOne('users', u => u.email === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create session
    const token = createSession(user.id);

    const { password: _, ...safeUser } = user;
    res.json({
      message: 'Welcome back!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ---- Log Out ----
router.post('/logout', (req, res) => {
  if (req.sessionToken) {
    destroySession(req.sessionToken);
  }
  res.json({ message: 'Logged out successfully.' });
});

// ---- Get Current User ----
router.get('/me', requireAuth, (req, res) => {
  const user = db.findById('users', req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
