/* ============================================
   MoodSync Theme — Dark/Light + Mood Themes
   ============================================ */

const THEME_KEY = 'moodsync_theme';
const DEFAULT_TIMER_KEY = 'moodsync_default_timer';
const DEFAULT_MOOD_KEY = 'moodsync_default_mood';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeToggleIcon();
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function isDarkMode() {
  return (localStorage.getItem(THEME_KEY) || 'dark') === 'dark';
}

function updateThemeToggleIcon() {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = isDarkMode() ? '☀️' : '🌙';
  }
  // Also update settings toggle if present
  const settingsToggle = document.getElementById('settings-theme-toggle');
  if (settingsToggle) {
    settingsToggle.checked = !isDarkMode();
  }
}

// Timer default
function getDefaultTimer() {
  return parseInt(localStorage.getItem(DEFAULT_TIMER_KEY) || '25', 10);
}

function setDefaultTimer(minutes) {
  localStorage.setItem(DEFAULT_TIMER_KEY, String(minutes));
}

// Default mood
function getDefaultMood() {
  return localStorage.getItem(DEFAULT_MOOD_KEY) || 'happy';
}

function setDefaultMood(mood) {
  localStorage.setItem(DEFAULT_MOOD_KEY, mood);
}
