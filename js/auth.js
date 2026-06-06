/* ============================================
   MoodSync Auth — Server API + localStorage Fallback
   ============================================ */

const AUTH_KEY = 'moodsync_user';
const SESSIONS_KEY = 'moodsync_sessions';

// Track whether API is available
let _apiAvailable = null;

async function checkApiAvailable() {
  if (_apiAvailable !== null) return _apiAvailable;
  _apiAvailable = await apiHealthCheck();
  return _apiAvailable;
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return getUser() !== null;
}

async function signup(name, email, password) {
  const online = await checkApiAvailable();

  if (online) {
    // Use server API
    const result = await apiSignup(name, email, password);
    if (result.success) {
      return { success: true, user: result.data.user };
    }
    return { success: false, message: result.error };
  }

  // Fallback to localStorage
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
    totalStudyMinutes: 0,
    sessionsCompleted: 0
  };

  users.push(user);
  localStorage.setItem('moodsync_users', JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { success: true, user };
}

async function login(email, password) {
  const online = await checkApiAvailable();

  if (online) {
    const result = await apiLogin(email, password);
    if (result.success) {
      return { success: true, user: result.data.user };
    }
    return { success: false, message: result.error };
  }

  // Fallback
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { success: true, user };
}

async function logout() {
  const online = await checkApiAvailable();
  if (online) {
    await apiLogout();
  }
  localStorage.removeItem(AUTH_KEY);
  removeToken();
  router.navigate('/');
  setTimeout(() => window.dispatchEvent(new CustomEvent('authChanged')), 100);
}

function updateUser(updates) {
  const user = getUser();
  if (!user) return;
  const updated = { ...user, ...updates };
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated));

  // Also update in users list (localStorage fallback)
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    users[idx] = updated;
    localStorage.setItem('moodsync_users', JSON.stringify(users));
  }

  // Sync to server if available
  checkApiAvailable().then(online => {
    if (online && updates.name !== undefined && updates.email !== undefined) {
      apiUpdateProfile(updates.name, updates.email);
    }
  });

  return updated;
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('moodsync_users') || '[]');
  } catch {
    return [];
  }
}

async function deleteAccount() {
  const online = await checkApiAvailable();
  if (online) {
    await apiDeleteAccount();
  }

  const user = getUser();
  if (user) {
    const users = getUsers().filter(u => u.id !== user.id);
    localStorage.setItem('moodsync_users', JSON.stringify(users));
  }
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('moodsync_mood_history');
  localStorage.removeItem(SESSIONS_KEY);
  removeToken();
  router.navigate('/');
  setTimeout(() => window.dispatchEvent(new CustomEvent('authChanged')), 100);
}

// ---- Session tracking ----
async function addStudySession(minutes) {
  const user = getUser();
  if (!user) return;

  // Log to server
  const online = await checkApiAvailable();
  if (online) {
    await apiLogSession(minutes, getCurrentMood());
  }

  // Also update localStorage
  const sessions = getStudySessions();
  sessions.push({
    date: new Date().toISOString(),
    minutes,
    mood: getCurrentMood()
  });
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

  updateUser({
    totalStudyMinutes: (user.totalStudyMinutes || 0) + minutes,
    sessionsCompleted: (user.sessionsCompleted || 0) + 1
  });
}

function getStudySessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
