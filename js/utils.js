/* ============================================
   MoodSync Utilities
   ============================================ */

// ---- Motivational Quotes ----
const motivationalQuotes = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Focus on being productive instead of busy. — Tim Ferriss",
  "It's not about having time. It's about making time. — Unknown",
  "Your future is created by what you do today. — Robert Kiyosaki",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Music gives a soul to the universe, wings to the mind. — Plato",
  "Study hard, for the well is deep, and our brains are shallow. — Richard Baxter",
  "Success is the sum of small efforts repeated day in and day out. — Robert Collier",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "You don't have to be great to start, but you have to start to be great. — Zig Ziglar",
  "Productivity is never an accident. It is the result of commitment to excellence. — Paul J. Meyer",
  "Where words fail, music speaks. — Hans Christian Andersen",
  "The beautiful thing about learning is nobody can take it away from you. — B.B. King",
  "Motivation is what gets you started. Habit is what keeps you going. — Jim Ryun"
];

function getRandomQuote() {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

function getDailyQuote() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return motivationalQuotes[dayOfYear % motivationalQuotes.length];
}

// ---- Form Validation ----
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateRequired(value) {
  return value.trim().length > 0;
}

function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + '-error');
  if (input) {
    input.classList.add('error');
  }
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + '-error');
  if (input) {
    input.classList.remove('error');
  }
  if (errorEl) {
    errorEl.classList.remove('show');
  }
}

function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.form-input').forEach(input => {
    input.classList.remove('error');
  });
  form.querySelectorAll('.form-error').forEach(err => {
    err.classList.remove('show');
  });
}

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
  // Remove existing toasts
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

// ---- Format Time ----
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ---- Debounce ----
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ---- Date Formatting ----
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---- Mood Data ----
const moodData = {
  happy: {
    emoji: '😊',
    name: 'Happy',
    description: 'Upbeat, energizing playlists to match your joyful vibe.',
    gradient: 'var(--mood-happy)',
    color: '#FFD700',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC',
    songs: [
      { title: 'Happy', artist: 'Pharrell Williams', emoji: '🌞' },
      { title: 'Good as Hell', artist: 'Lizzo', emoji: '💃' },
      { title: 'Walking on Sunshine', artist: 'Katrina & The Waves', emoji: '☀️' },
      { title: 'Uptown Funk', artist: 'Bruno Mars', emoji: '🕺' },
      { title: "Can't Stop the Feeling", artist: 'Justin Timberlake', emoji: '🎶' },
      { title: 'Best Day of My Life', artist: 'American Authors', emoji: '🌈' },
      { title: 'Shake It Off', artist: 'Taylor Swift', emoji: '💫' },
      { title: 'On Top of the World', artist: 'Imagine Dragons', emoji: '🏔️' }
    ]
  },
  relaxing: {
    emoji: '😌',
    name: 'Relaxing',
    description: 'Lo-fi and calm background music for peaceful focus.',
    gradient: 'var(--mood-relaxing)',
    color: '#6DD5FA',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn',
    songs: [
      { title: 'Weightless', artist: 'Marconi Union', emoji: '🌊' },
      { title: 'Clair de Lune', artist: 'Debussy', emoji: '🌙' },
      { title: 'Lo-Fi Study Beats', artist: 'Chilled Cow', emoji: '📚' },
      { title: 'Sunset Lover', artist: 'Petit Biscuit', emoji: '🌅' },
      { title: 'Intro', artist: 'The xx', emoji: '💤' },
      { title: 'Electric Feel', artist: 'MGMT', emoji: '✨' },
      { title: 'Breathe Me', artist: 'Sia', emoji: '🍃' },
      { title: 'Saturn', artist: 'Sleeping At Last', emoji: '🪐' }
    ]
  },
  sad: {
    emoji: '😢',
    name: 'Sad',
    description: 'Soft, soothing tracks to comfort and heal.',
    gradient: 'var(--mood-sad)',
    color: '#667EEA',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1',
    songs: [
      { title: 'Someone Like You', artist: 'Adele', emoji: '💔' },
      { title: 'Fix You', artist: 'Coldplay', emoji: '🩹' },
      { title: 'Skinny Love', artist: 'Bon Iver', emoji: '🥀' },
      { title: 'The Night We Met', artist: 'Lord Huron', emoji: '🌧️' },
      { title: 'Liability', artist: 'Lorde', emoji: '😔' },
      { title: 'Hurt', artist: 'Johnny Cash', emoji: '💧' },
      { title: 'All I Want', artist: 'Kodaline', emoji: '🕊️' },
      { title: 'Let Her Go', artist: 'Passenger', emoji: '🍂' }
    ]
  },
  energetic: {
    emoji: '⚡',
    name: 'Energetic',
    description: 'High-energy, motivating beats to power through.',
    gradient: 'var(--mood-energetic)',
    color: '#FF2D9B',
    spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
    songs: [
      { title: 'Stronger', artist: 'Kanye West', emoji: '💪' },
      { title: 'Eye of the Tiger', artist: 'Survivor', emoji: '🐯' },
      { title: 'Thunderstruck', artist: 'AC/DC', emoji: '⚡' },
      { title: 'Believer', artist: 'Imagine Dragons', emoji: '🔥' },
      { title: 'Lose Yourself', artist: 'Eminem', emoji: '🎤' },
      { title: "Don't Stop Me Now", artist: 'Queen', emoji: '🚀' },
      { title: 'Power', artist: 'Kanye West', emoji: '👑' },
      { title: 'Run the World', artist: 'Beyoncé', emoji: '🌍' }
    ]
  }
};

// ---- Get stored mood ----
function getCurrentMood() {
  return localStorage.getItem('moodsync_current_mood') || 'happy';
}

function setCurrentMood(mood) {
  localStorage.setItem('moodsync_current_mood', mood);

  // Add to mood history
  const history = getMoodHistory();
  history.push({ mood, date: new Date().toISOString() });
  if (history.length > 20) history.shift();
  localStorage.setItem('moodsync_mood_history', JSON.stringify(history));
}

function getMoodHistory() {
  try {
    return JSON.parse(localStorage.getItem('moodsync_mood_history') || '[]');
  } catch {
    return [];
  }
}

function getFavoriteMood() {
  const history = getMoodHistory();
  if (!history.length) return 'happy';
  const counts = {};
  history.forEach(h => {
    counts[h.mood] = (counts[h.mood] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}
