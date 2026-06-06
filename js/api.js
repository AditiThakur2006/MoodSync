/* ============================================
   MoodSync API Client — Frontend ↔ Server
   ============================================ */

const API_BASE = '/api';
const TOKEN_KEY = 'moodsync_token';

// ---- Token Management ----
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ---- Fetch Wrapper ----
async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status})`);
    }

    return { success: true, data };
  } catch (err) {
    // If it's a network error (server not running), fall back to localStorage
    if (err instanceof TypeError && err.message.includes('fetch')) {
      console.warn('API unavailable, using localStorage fallback.');
      return { success: false, offline: true, error: err.message };
    }
    return { success: false, error: err.message };
  }
}

// ---- Auth API ----
async function apiSignup(name, email, password) {
  const result = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });

  if (result.success) {
    setToken(result.data.token);
    // Also store user in localStorage for UI rendering
    localStorage.setItem(AUTH_KEY, JSON.stringify(result.data.user));
  }

  return result;
}

async function apiLogin(email, password) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (result.success) {
    setToken(result.data.token);
    localStorage.setItem(AUTH_KEY, JSON.stringify(result.data.user));
  }

  return result;
}

async function apiLogout() {
  await apiRequest('/auth/logout', { method: 'POST' });
  removeToken();
  localStorage.removeItem(AUTH_KEY);
}

async function apiGetMe() {
  const result = await apiRequest('/auth/me');
  if (result.success) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(result.data.user));
  }
  return result;
}

// ---- User API ----
async function apiUpdateProfile(name, email) {
  const result = await apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify({ name, email })
  });

  if (result.success) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(result.data.user));
  }

  return result;
}

async function apiChangePassword(currentPassword, newPassword) {
  return apiRequest('/users/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

async function apiUpdatePreferences(prefs) {
  return apiRequest('/users/preferences', {
    method: 'PUT',
    body: JSON.stringify(prefs)
  });
}

async function apiDeleteAccount() {
  const result = await apiRequest('/users/account', { method: 'DELETE' });
  if (result.success) {
    removeToken();
    localStorage.removeItem(AUTH_KEY);
  }
  return result;
}

// ---- Sessions API ----
async function apiLogSession(minutes, mood) {
  return apiRequest('/sessions', {
    method: 'POST',
    body: JSON.stringify({ minutes, mood })
  });
}

async function apiGetSessions(limit = 50) {
  return apiRequest(`/sessions?limit=${limit}`);
}

async function apiGetSessionStats() {
  return apiRequest('/sessions/stats');
}

// ---- Moods API ----
async function apiLogMood(mood) {
  return apiRequest('/moods', {
    method: 'POST',
    body: JSON.stringify({ mood })
  });
}

async function apiGetMoodHistory(limit = 20) {
  return apiRequest(`/moods?limit=${limit}`);
}

async function apiGetFavoriteMood() {
  return apiRequest('/moods/favorite');
}

// ---- Health Check ----
async function apiHealthCheck() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
