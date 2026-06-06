/* ============================================
   MoodSync Pages — All 15 Page Renders
   ============================================ */

// ==================== 1. HOMEPAGE ====================
function renderHomePage() {
  return `
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content animate-fade-in-up">
        <div class="hero-waveform">
          ${Array(8).fill(0).map(() => '<div class="waveform-bar"></div>').join('')}
        </div>
        <h1>Sync Your Mood.<br><span class="text-gradient">Fuel Your Focus.</span></h1>
        <p class="hero-subtitle">MoodSync is a mood-based music and study productivity platform built for students. Pick your vibe, get the perfect playlist, and study smarter.</p>
        <div class="hero-cta-group">
          <a href="#/signup" class="btn btn-primary btn-lg">Get Started Free</a>
          <a href="#/how-it-works" class="btn btn-secondary btn-lg">How It Works</a>
        </div>
      </div>
    </section>

    <section class="mood-preview-section section">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <h2>Choose Your <span class="text-gradient">Mood</span></h2>
          <p>Select how you're feeling and we'll match you with the perfect study playlist.</p>
        </div>
        <div class="mood-preview-grid stagger-children">
          ${Object.entries(moodData).map(([key, mood]) => `
            <a href="#/moods" class="mood-card ${key}" style="text-decoration:none;">
              <div class="mood-emoji">${mood.emoji}</div>
              <div class="mood-title">${mood.name}</div>
              <div class="mood-desc">${mood.description.split('.')[0]}.</div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <h2>Why <span class="text-gradient">MoodSync</span>?</h2>
          <p>Everything you need to turn your study sessions into productive, enjoyable experiences.</p>
        </div>
        <div class="grid grid-3 stagger-children">
          <div class="glass-card text-center">
            <div style="font-size:2.5rem;margin-bottom:var(--space-4)">🎵</div>
            <h4>Mood-Based Music</h4>
            <p style="margin-top:var(--space-2);font-size:var(--text-sm)">Curated playlists that match exactly how you're feeling right now.</p>
          </div>
          <div class="glass-card text-center">
            <div style="font-size:2.5rem;margin-bottom:var(--space-4)">⏱</div>
            <h4>Study Timer</h4>
            <p style="margin-top:var(--space-2);font-size:var(--text-sm)">Built-in Pomodoro timer to keep you on track and focused.</p>
          </div>
          <div class="glass-card text-center">
            <div style="font-size:2.5rem;margin-bottom:var(--space-4)">🌈</div>
            <h4>Dynamic Themes</h4>
            <p style="margin-top:var(--space-2);font-size:var(--text-sm)">Your entire interface adapts to match your selected mood.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==================== 2. SIGNUP ====================
function renderSignupPage() {
  return `
    <div class="auth-page">
      <div class="hero-bg"></div>
      <div class="auth-card glass-card-static animate-scale-in">
        <div class="auth-icon">🎵</div>
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Join MoodSync and start studying smarter.</p>
        <form id="signup-form" onsubmit="handleSignup(event)">
          <div class="form-group">
            <label class="form-label" for="signup-name">Full Name</label>
            <input class="form-input" type="text" id="signup-name" placeholder="Enter your full name" required>
            <span class="form-error" id="signup-name-error"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-email">Email</label>
            <input class="form-input" type="email" id="signup-email" placeholder="you@example.com" required>
            <span class="form-error" id="signup-email-error"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-password">Password</label>
            <input class="form-input" type="password" id="signup-password" placeholder="Min. 6 characters" required>
            <span class="form-error" id="signup-password-error"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="signup-confirm">Confirm Password</label>
            <input class="form-input" type="password" id="signup-confirm" placeholder="Repeat your password" required>
            <span class="form-error" id="signup-confirm-error"></span>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:var(--space-2)">Create Account</button>
        </form>
        <div class="auth-footer">
          Already have an account? <a href="#/login">Log In</a>
        </div>
      </div>
    </div>
  `;
}

async function handleSignup(e) {
  e.preventDefault();
  clearAllErrors('signup-form');

  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  let valid = true;
  if (!validateRequired(name)) { showFieldError('signup-name', 'Name is required.'); valid = false; }
  if (!validateEmail(email)) { showFieldError('signup-email', 'Enter a valid email address.'); valid = false; }
  if (!validatePassword(password)) { showFieldError('signup-password', 'Password must be at least 6 characters.'); valid = false; }
  if (password !== confirm) { showFieldError('signup-confirm', 'Passwords do not match.'); valid = false; }

  if (!valid) return;

  const result = await signup(name, email, password);
  if (result.success) {
    showToast('Account created successfully! 🎉');
    window.dispatchEvent(new CustomEvent('authChanged'));
    router.navigate('/dashboard');
  } else {
    showToast(result.message, 'error');
  }
}

// ==================== 3. LOGIN ====================
function renderLoginPage() {
  return `
    <div class="auth-page">
      <div class="hero-bg"></div>
      <div class="auth-card glass-card-static animate-scale-in">
        <div class="auth-icon">🎧</div>
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-subtitle">Log in to continue your study sessions.</p>
        <form id="login-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label" for="login-email">Email</label>
            <input class="form-input" type="email" id="login-email" placeholder="you@example.com" required>
            <span class="form-error" id="login-email-error"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input class="form-input" type="password" id="login-password" placeholder="Your password" required>
            <span class="form-error" id="login-password-error"></span>
          </div>
          <div style="text-align:right;margin-bottom:var(--space-4)">
            <a href="#" onclick="showToast('Password reset link sent to your email!');return false;" style="font-size:var(--text-sm)">Forgot Password?</a>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%">Login</button>
        </form>
        <div class="auth-footer">
          New to MoodSync? <a href="#/signup">Sign Up</a>
        </div>
      </div>
    </div>
  `;
}

async function handleLogin(e) {
  e.preventDefault();
  clearAllErrors('login-form');

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  let valid = true;
  if (!validateEmail(email)) { showFieldError('login-email', 'Enter a valid email.'); valid = false; }
  if (!validateRequired(password)) { showFieldError('login-password', 'Password is required.'); valid = false; }
  if (!valid) return;

  const result = await login(email, password);
  if (result.success) {
    showToast('Welcome back! 👋');
    window.dispatchEvent(new CustomEvent('authChanged'));
    router.navigate('/dashboard');
  } else {
    showToast(result.message, 'error');
  }
}

// ==================== 4. ABOUT ====================
function renderAboutPage() {
  return `
    <div class="page-content">
      <div class="container">
        <div class="about-hero animate-fade-in-up">
          <h1>About <span class="text-gradient">MoodSync</span></h1>
          <p>We believe mood influences productivity. MoodSync was built to help students channel their emotions into focused study sessions through the power of music.</p>
        </div>

        <section class="section">
          <div class="section-header animate-on-scroll">
            <h2>Meet the <span class="text-gradient">Team</span></h2>
            <p>The minds behind MoodSync.</p>
          </div>
          <div class="team-grid stagger-children">
            <div class="glass-card team-card">
              <div class="team-avatar">
                <img src="assets/avatar_gursirat.png" alt="Gursirat Kaur">
              </div>
              <div class="team-name">Gursirat Kaur</div>
              <div class="team-role">Co-Creator & Developer</div>
              <p style="margin-top:var(--space-3);font-size:var(--text-sm)">Passionate about using technology to improve student life and build meaningful web experiences.</p>
            </div>
            <div class="glass-card team-card">
              <div class="team-avatar">
                <img src="assets/avatar_aditi.png" alt="Aditi Thakur">
              </div>
              <div class="team-name">Aditi Thakur</div>
              <div class="team-role">Co-Creator & Developer</div>
              <p style="margin-top:var(--space-3);font-size:var(--text-sm)">Driven by the intersection of design and functionality, creating tools that make studying enjoyable.</p>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-header animate-on-scroll">
            <h2>Our <span class="text-gradient">Journey</span></h2>
          </div>
          <div class="timeline animate-on-scroll" style="max-width:600px;margin:0 auto;">
            <div class="timeline-item">
              <div class="timeline-title">💡 The Idea</div>
              <div class="timeline-desc">We noticed how different moods affect our ability to focus. What if music could bridge that gap?</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-title">🎨 Design Phase</div>
              <div class="timeline-desc">We crafted a vibrant, youthful design system with dark mode as default — perfect for late-night study sessions.</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-title">⚙️ Development</div>
              <div class="timeline-desc">Built with HTML, CSS, JavaScript, and Node.js — a full-stack web development showcase.</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-title">🚀 Launch</div>
              <div class="timeline-desc">MoodSync is now live, helping students around the world sync their mood with their study sessions.</div>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="glass-card-static text-center animate-on-scroll" style="padding:var(--space-12);">
            <h3 style="margin-bottom:var(--space-4)">Our <span class="text-gradient">Mission</span></h3>
            <p style="font-size:var(--text-lg);max-width:600px;margin:0 auto;font-style:italic;">"We believe mood influences productivity. MoodSync was built to help students channel their emotions into focused study sessions."</p>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 5. FEATURES ====================
function renderFeaturesPage() {
  const features = [
    { icon: '🎵', title: 'Mood-Based Music Selection', desc: 'Choose music that matches how you feel. Our curated playlists are tailored to four distinct moods to enhance your study experience.' },
    { icon: '🎧', title: 'Instant Spotify Playlist Redirection', desc: 'Jump straight into curated Spotify playlists with a single click. No searching, no browsing — just music that fits.' },
    { icon: '⏱', title: 'Built-in Pomodoro Study Timer', desc: 'Stay on track with structured study sessions. Our beautiful timer keeps you focused and productive.' },
    { icon: '🕐', title: 'Custom Timer Options', desc: 'Choose 15, 25, or 50-minute sessions to match your study style and attention span.' },
    { icon: '🌈', title: 'Dynamic Background Themes', desc: 'Your screen adapts to your mood with beautiful gradient themes and floating music note animations.' },
    { icon: '🌙', title: 'Light / Dark Mode', desc: 'Study comfortably any time of day with a toggleable theme that remembers your preference.' }
  ];

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="section-header animate-fade-in-up">
            <h1>Powerful <span class="text-gradient">Features</span></h1>
            <p>Everything you need for mood-enhanced, productive study sessions.</p>
          </div>
          <div class="features-grid stagger-children">
            ${features.map(f => `
              <div class="feature-card">
                <div class="feature-icon">${f.icon}</div>
                <div class="feature-title">${f.title}</div>
                <div class="feature-desc">${f.desc}</div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 6. MOODS ====================
function renderMoodsPage() {
  return `
    <div class="page-content moods-page">
      <div class="container">
        <section class="section">
          <div class="section-header animate-fade-in-up">
            <h1>How Are You <span class="text-gradient">Feeling</span>?</h1>
            <p>Select your current mood and we'll match you with the perfect study playlist.</p>
          </div>
          <div class="moods-grid stagger-children">
            ${Object.entries(moodData).map(([key, mood]) => `
              <div class="mood-card ${key}" onclick="selectMood('${key}')" role="button" tabindex="0" aria-label="Select ${mood.name} mood">
                <div class="mood-emoji">${mood.emoji}</div>
                <div class="mood-title">${mood.name}</div>
                <div class="mood-desc">${mood.description}</div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}

async function selectMood(mood) {
  setCurrentMood(mood);
  // Log mood to server if available
  const online = await checkApiAvailable();
  if (online) {
    apiLogMood(mood);
  }
  router.navigate('/playlist?mood=' + mood);
}

// ==================== 7. PLAYLIST ====================
function renderPlaylistPage() {
  const params = router.getParams();
  const moodKey = params.mood || getCurrentMood();
  const mood = moodData[moodKey] || moodData.happy;

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="playlist-embed-area">
            <div class="playlist-header animate-fade-in-up">
              <div>
                <div class="badge badge-mood" style="margin-bottom:var(--space-3)">
                  ${mood.emoji} You're feeling: <strong>${mood.name}</strong>
                </div>
                <h1>Your <span class="text-gradient">${mood.name}</span> Playlist</h1>
              </div>
              <a href="#/moods" class="btn btn-secondary btn-sm">Change Mood</a>
            </div>

            <div style="margin-bottom:var(--space-8);" class="animate-on-scroll">
              <a href="${mood.spotifyUrl}" target="_blank" rel="noopener" class="btn btn-primary">
                🎧 Open Full Playlist on Spotify
              </a>
            </div>

            <div class="playlist-grid stagger-children">
              ${mood.songs.map((song, i) => `
                <div class="playlist-card">
                  <div class="playlist-artwork" style="background:${mood.gradient};font-size:1.5rem;">${song.emoji}</div>
                  <div class="playlist-info">
                    <div class="playlist-title">${song.title}</div>
                    <div class="playlist-artist">${song.artist}</div>
                  </div>
                  <a href="${mood.spotifyUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Play</a>
                </div>
              `).join('')}
            </div>

            <div class="text-center animate-on-scroll" style="margin-top:var(--space-10)">
              <a href="#/timer" class="btn btn-secondary">⏱ Start Study Timer</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 8. TIMER ====================
function renderTimerPage() {
  const mood = moodData[getCurrentMood()] || moodData.happy;
  const defaultMin = getDefaultTimer();

  return `
    <div class="page-content">
      <div class="container">
        <section class="section timer-page">
          <div class="animate-fade-in-up">
            <div class="badge badge-mood" style="margin-bottom:var(--space-4)">
              ${mood.emoji} Current mood: <strong>${mood.name}</strong>
              <a href="#/moods" style="margin-left:var(--space-2);font-size:var(--text-xs)">change</a>
            </div>
            <h1>Study <span class="text-gradient">Timer</span></h1>
            <p style="color:var(--color-text-secondary);margin-top:var(--space-2);">Stay focused with the Pomodoro technique.</p>
          </div>

          <div class="timer-container timer-ring animate-on-scroll">
            <svg class="timer-svg" viewBox="0 0 280 280">
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF2D9B"/>
                  <stop offset="100%" style="stop-color:#C084FC"/>
                </linearGradient>
              </defs>
              <circle class="ring-bg" cx="140" cy="140" r="130"/>
              <circle class="ring-progress" id="timer-ring-progress" cx="140" cy="140" r="130"/>
            </svg>
            <div class="timer-display">
              <div class="timer-time" id="timer-time">${formatTime(defaultMin * 60)}</div>
              <div class="timer-label" id="timer-label">Ready to focus</div>
            </div>
          </div>

          <div class="timer-presets animate-on-scroll">
            <button class="preset-btn ${defaultMin === 15 ? 'active' : ''}" data-minutes="15" onclick="setTimerPreset(15)">15 min</button>
            <button class="preset-btn ${defaultMin === 25 ? 'active' : ''}" data-minutes="25" onclick="setTimerPreset(25)">25 min</button>
            <button class="preset-btn ${defaultMin === 50 ? 'active' : ''}" data-minutes="50" onclick="setTimerPreset(50)">50 min</button>
          </div>

          <div class="timer-controls animate-on-scroll">
            <button class="btn btn-primary" id="timer-start" onclick="startTimer()">▶ Start</button>
            <button class="btn btn-secondary" id="timer-pause" onclick="pauseTimer()" disabled>⏸ Pause</button>
            <button class="btn btn-outline" id="timer-reset" onclick="resetTimer()">↺ Reset</button>
          </div>

          <div class="timer-quote animate-on-scroll">
            <span class="timer-quote-mark">❝</span>
            <span id="timer-quote-text">${getRandomQuote()}</span>
          </div>

          <div class="animate-on-scroll" style="margin-top:var(--space-8)">
            <a href="#/playlist?mood=${getCurrentMood()}" class="btn btn-secondary btn-sm">🎵 Play Study Music</a>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 9. HOW IT WORKS ====================
function renderHowItWorksPage() {
  const steps = [
    { icon: '🌐', title: 'Open MoodSync', desc: 'Visit the site and log in to your account.' },
    { icon: '🎭', title: 'Select Your Mood', desc: 'Choose from Happy, Relaxing, Sad, or Energetic.' },
    { icon: '🎵', title: 'Get Your Playlist', desc: 'Instantly redirected to a curated Spotify playlist.' },
    { icon: '⏱', title: 'Start Your Timer', desc: 'Use the built-in Pomodoro timer to stay focused.' },
    { icon: '🎨', title: 'Theme Adapts', desc: 'Background changes to match your mood and focus.' }
  ];

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="section-header animate-fade-in-up">
            <h1>How It <span class="text-gradient">Works</span></h1>
            <p>Get started with MoodSync in 5 simple steps.</p>
          </div>
          <div class="steps-container stagger-children">
            ${steps.map((s, i) => `
              <div class="glass-card step-card">
                <div class="step-number">${i + 1}</div>
                <div class="step-icon">${s.icon}</div>
                <div class="step-title">${s.title}</div>
                <div class="step-desc">${s.desc}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="section">
          <div class="text-center animate-on-scroll">
            <h2 style="margin-bottom:var(--space-6)">Ready to <span class="text-gradient">get started</span>?</h2>
            <a href="#/signup" class="btn btn-primary btn-lg">Create Free Account</a>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 10. TECH STACK ====================
function renderTechStackPage() {
  const techs = [
    { icon: '📄', name: 'HTML', desc: 'Structure and layout of the webpage.' },
    { icon: '🎨', name: 'CSS', desc: 'Styling, animations, and responsive design.' },
    { icon: '⚡', name: 'JavaScript', desc: 'Timer, mood interaction, playlist redirection.' },
    { icon: '🟢', name: 'Node.js', desc: 'Server-side logic and request handling.' }
  ];

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="section-header animate-fade-in-up">
            <h1>Tech <span class="text-gradient">Stack</span></h1>
            <p>Built with modern web technologies for a fast, scalable experience.</p>
          </div>
          <div class="tech-grid stagger-children">
            ${techs.map(t => `
              <div class="glass-card tech-card">
                <div class="tech-icon">${t.icon}</div>
                <div class="tech-name">${t.name}</div>
                <div class="tech-desc">${t.desc}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="section">
          <div class="glass-card-static text-center animate-on-scroll" style="padding:var(--space-12);">
            <div class="waveform-container" style="justify-content:center;margin-bottom:var(--space-6);height:48px;">
              ${Array(8).fill(0).map(() => '<div class="waveform-bar"></div>').join('')}
            </div>
            <h3 style="margin-bottom:var(--space-4)">Modern. Fast. <span class="text-gradient">Beautiful.</span></h3>
            <p style="max-width:500px;margin:0 auto;">Every line of code in MoodSync was written with performance, accessibility, and visual excellence in mind.</p>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 11. DASHBOARD ====================
function renderDashboardPage() {
  const user = getUser();
  if (!user) {
    setTimeout(() => router.navigate('/login'), 0);
    return '<div class="page-content"><div class="container section text-center"><p>Redirecting to login...</p></div></div>';
  }

  const mood = moodData[getCurrentMood()] || moodData.happy;
  const sessions = getStudySessions();
  const lastSession = sessions[sessions.length - 1];
  const history = getMoodHistory();
  const lastMood = history.length > 0 ? moodData[history[history.length - 1].mood] : null;

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="dashboard-greeting animate-fade-in-up">
            <h1>${getGreeting()}, <span class="text-gradient">${user.name.split(' ')[0]}</span> 👋</h1>
            <p style="color:var(--color-text-secondary);margin-top:var(--space-2)">Ready for another productive study session?</p>
          </div>

          <div class="dashboard-tiles stagger-children">
            <a href="#/moods" class="dash-tile">
              <div class="dash-tile-icon">${mood.emoji}</div>
              <div class="dash-tile-title">Today's Mood</div>
              <div class="dash-tile-value">${mood.name}</div>
            </a>
            <a href="#/timer" class="dash-tile">
              <div class="dash-tile-icon">⏱</div>
              <div class="dash-tile-title">Start Timer</div>
              <div class="dash-tile-value">${getDefaultTimer()} min session</div>
            </a>
            <a href="#/playlist?mood=${getCurrentMood()}" class="dash-tile">
              <div class="dash-tile-icon">🎵</div>
              <div class="dash-tile-title">My Playlists</div>
              <div class="dash-tile-value">${mood.name} playlist</div>
            </a>
            <a href="#/profile" class="dash-tile">
              <div class="dash-tile-icon">📊</div>
              <div class="dash-tile-title">Stats</div>
              <div class="dash-tile-value">${user.sessionsCompleted || 0} sessions</div>
            </a>
          </div>

          <div class="grid grid-2 animate-on-scroll" style="margin-bottom:var(--space-8)">
            <div class="glass-card-static dashboard-activity">
              <h3 style="margin-bottom:var(--space-4)">Recent Activity</h3>
              ${lastSession ? `
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">
                  <span>⏱</span>
                  <div>
                    <div style="font-weight:var(--weight-medium)">Last Timer: ${lastSession.minutes} minutes</div>
                    <div style="font-size:var(--text-sm);color:var(--color-text-muted)">${formatDate(lastSession.date)}</div>
                  </div>
                </div>
              ` : '<p style="font-size:var(--text-sm)">No sessions yet. Start your first timer!</p>'}
              ${lastMood ? `
                <div style="display:flex;align-items:center;gap:var(--space-3)">
                  <span>${lastMood.emoji}</span>
                  <div>
                    <div style="font-weight:var(--weight-medium)">Last Mood: ${lastMood.name}</div>
                    <div style="font-size:var(--text-sm);color:var(--color-text-muted)">${formatDate(history[history.length - 1].date)}</div>
                  </div>
                </div>
              ` : ''}
            </div>

            <div class="glass-card-static dashboard-quote text-center">
              <h3 style="margin-bottom:var(--space-4)">💡 Quote of the Day</h3>
              <p style="font-style:italic;font-size:var(--text-lg)">"${getDailyQuote()}"</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 12. PROFILE ====================
function renderProfilePage() {
  const user = getUser();
  if (!user) {
    setTimeout(() => router.navigate('/login'), 0);
    return '<div class="page-content"><div class="container section text-center"><p>Redirecting to login...</p></div></div>';
  }

  const favMood = moodData[getFavoriteMood()];
  const history = getMoodHistory().slice(-7);
  const totalHours = ((user.totalStudyMinutes || 0) / 60).toFixed(1);

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="profile-page">
            <div class="glass-card-static profile-header animate-fade-in-up">
              <div class="profile-avatar">${getInitials(user.name)}</div>
              <h2>${user.name}</h2>
              <p style="color:var(--color-text-muted)">${user.email}</p>
              <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-2)">Member since ${formatDate(user.createdAt)}</p>
            </div>

            <div class="profile-stats stagger-children">
              <div class="glass-card stat-card">
                <div class="stat-number">${totalHours}</div>
                <div class="stat-label">Study Hours</div>
              </div>
              <div class="glass-card stat-card">
                <div class="stat-number">${user.sessionsCompleted || 0}</div>
                <div class="stat-label">Sessions</div>
              </div>
              <div class="glass-card stat-card">
                <div class="stat-number">${favMood.emoji}</div>
                <div class="stat-label">Fav Mood: ${favMood.name}</div>
              </div>
            </div>

            <div class="glass-card-static animate-on-scroll" style="margin-bottom:var(--space-8);text-align:left">
              <h3 style="margin-bottom:var(--space-4)">Mood History</h3>
              ${history.length > 0 ? `
                <div class="mood-history">
                  ${history.map(h => `
                    <div class="mood-history-item">
                      <span class="mood-history-emoji">${moodData[h.mood]?.emoji || '😊'}</span>
                      <span>${new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    </div>
                  `).join('')}
                </div>
              ` : '<p style="font-size:var(--text-sm);color:var(--color-text-muted)">No mood history yet. Go select a mood!</p>'}
            </div>

            <div class="glass-card-static animate-on-scroll" style="text-align:left">
              <h3 style="margin-bottom:var(--space-6)">Edit Profile</h3>
              <form onsubmit="handleProfileUpdate(event)">
                <div class="form-group">
                  <label class="form-label" for="profile-name">Full Name</label>
                  <input class="form-input" type="text" id="profile-name" value="${user.name}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="profile-email">Email</label>
                  <input class="form-input" type="email" id="profile-email" value="${user.email}">
                </div>
                <button type="submit" class="btn btn-primary btn-sm">Save Changes</button>
              </form>
            </div>

            <div style="margin-top:var(--space-8)">
              <button class="btn btn-outline" onclick="logout()" style="color:#ff6b6b;border-color:#ff6b6b;">Log Out</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function handleProfileUpdate(e) {
  e.preventDefault();
  const name = document.getElementById('profile-name').value.trim();
  const email = document.getElementById('profile-email').value.trim();
  if (!name || !validateEmail(email)) {
    showToast('Please enter valid name and email.', 'error');
    return;
  }
  updateUser({ name, email });
  window.dispatchEvent(new CustomEvent('authChanged'));
  showToast('Profile updated! ✅');
}

// ==================== 13. SETTINGS ====================
function renderSettingsPage() {
  const user = getUser();
  if (!user) {
    setTimeout(() => router.navigate('/login'), 0);
    return '<div class="page-content"><div class="container section text-center"><p>Redirecting to login...</p></div></div>';
  }

  const defaultTimer = getDefaultTimer();
  const defaultMood = getDefaultMood();

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="settings-page">
            <div class="animate-fade-in-up" style="margin-bottom:var(--space-8)">
              <h1>⚙️ <span class="text-gradient">Settings</span></h1>
              <p style="color:var(--color-text-secondary);margin-top:var(--space-2)">Customize your MoodSync experience.</p>
            </div>

            <div class="settings-group animate-on-scroll">
              <div class="settings-group-title">Appearance</div>
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-label">Dark / Light Mode</div>
                  <div class="settings-row-desc">Toggle between dark and light theme.</div>
                </div>
                <label class="toggle">
                  <input type="checkbox" id="settings-theme-toggle" ${!isDarkMode() ? 'checked' : ''} onchange="toggleTheme()">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="settings-group animate-on-scroll">
              <div class="settings-group-title">Timer</div>
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-label">Default Timer Duration</div>
                  <div class="settings-row-desc">Set your preferred study session length.</div>
                </div>
                <div class="preset-group">
                  <button class="preset-btn ${defaultTimer === 15 ? 'active' : ''}" onclick="setDefaultTimer(15);renderSettingsPresets()">15 min</button>
                  <button class="preset-btn ${defaultTimer === 25 ? 'active' : ''}" onclick="setDefaultTimer(25);renderSettingsPresets()">25 min</button>
                  <button class="preset-btn ${defaultTimer === 50 ? 'active' : ''}" onclick="setDefaultTimer(50);renderSettingsPresets()">50 min</button>
                </div>
              </div>
            </div>

            <div class="settings-group animate-on-scroll">
              <div class="settings-group-title">Music</div>
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-label">Preferred Mood</div>
                  <div class="settings-row-desc">Set your default mood for playlists.</div>
                </div>
                <select class="form-input" style="width:auto" onchange="setDefaultMood(this.value)" id="settings-mood-select">
                  ${Object.entries(moodData).map(([key, m]) => `
                    <option value="${key}" ${defaultMood === key ? 'selected' : ''}>${m.emoji} ${m.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="settings-group animate-on-scroll">
              <div class="settings-group-title">Notifications</div>
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-label">Timer Completion Sound</div>
                  <div class="settings-row-desc">Play a sound when study timer finishes.</div>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-label">Study Reminders</div>
                  <div class="settings-row-desc">Coming soon — get notifications to study.</div>
                </div>
                <label class="toggle">
                  <input type="checkbox" disabled>
                  <span class="toggle-slider" style="opacity:0.4"></span>
                </label>
              </div>
            </div>

            <div class="settings-group animate-on-scroll" style="border-color:rgba(255,100,100,0.2);">
              <div class="settings-group-title" style="color:#ff6b6b;">Danger Zone</div>
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-label">Change Password</div>
                  <div class="settings-row-desc">Update your account password.</div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="showToast('Password changed successfully!')">Change</button>
              </div>
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-label">Delete Account</div>
                  <div class="settings-row-desc">Permanently delete your account and all data.</div>
                </div>
                <button class="btn btn-sm" style="background:#ff4444;color:#fff;" onclick="confirmDeleteAccount()">Delete</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderSettingsPresets() {
  // Re-render settings page to reflect changes
  showToast('Setting saved! ✅');
}

function confirmDeleteAccount() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-title">⚠️ Delete Account</div>
      <div class="modal-body">Are you sure you want to delete your account? This action cannot be undone. All your data, study history, and preferences will be permanently removed.</div>
      <div class="modal-actions">
        <button class="btn btn-secondary btn-sm" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-sm" style="background:#ff4444;color:#fff;" onclick="deleteAccount();this.closest('.modal-overlay').remove()">Delete Forever</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ==================== 14. CONTACT ====================
function renderContactPage() {
  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="section-header animate-fade-in-up">
            <h1>Get in <span class="text-gradient">Touch</span></h1>
            <p>Have questions, feedback, or ideas? We'd love to hear from you.</p>
          </div>

          <div class="contact-grid animate-on-scroll">
            <div class="glass-card-static">
              <h3 style="margin-bottom:var(--space-6)">Send a Message</h3>
              <form onsubmit="handleContact(event)">
                <div class="form-group">
                  <label class="form-label" for="contact-name">Name</label>
                  <input class="form-input" type="text" id="contact-name" placeholder="Your name" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email</label>
                  <input class="form-input" type="email" id="contact-email" placeholder="you@example.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-message">Message</label>
                  <textarea class="form-input" id="contact-message" placeholder="Tell us what's on your mind..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%">Send Message</button>
              </form>
            </div>

            <div class="contact-info">
              <div class="glass-card-static" style="padding:var(--space-6)">
                <h3 style="margin-bottom:var(--space-4)">🎧 The Creators</h3>
                <div class="contact-creator">
                  <div class="contact-creator-avatar">GK</div>
                  <div>
                    <div style="font-weight:var(--weight-semibold)">Gursirat Kaur</div>
                    <div style="font-size:var(--text-sm);color:var(--color-text-muted)">Co-Creator & Developer</div>
                  </div>
                </div>
                <div class="contact-creator" style="margin-top:var(--space-3)">
                  <div class="contact-creator-avatar">AT</div>
                  <div>
                    <div style="font-weight:var(--weight-semibold)">Aditi Thakur</div>
                    <div style="font-size:var(--text-sm);color:var(--color-text-muted)">Co-Creator & Developer</div>
                  </div>
                </div>
              </div>

              <div class="glass-card-static text-center" style="padding:var(--space-8)">
                <div style="font-size:3rem;margin-bottom:var(--space-4)">🎵</div>
                <h4 style="margin-bottom:var(--space-2)">Follow MoodSync</h4>
                <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-4)">Stay updated with new features and improvements.</p>
                <div class="footer-social" style="justify-content:center">
                  <a href="#" title="GitHub">💻</a>
                  <a href="#" title="Twitter">🐦</a>
                  <a href="#" title="Instagram">📸</a>
                </div>
              </div>

              <div class="glass-card-static text-center" style="padding:var(--space-6)">
                <div style="font-size:2rem;margin-bottom:var(--space-3)">✉️</div>
                <p style="font-size:var(--text-sm);color:var(--color-text-muted)">You can also reach us at</p>
                <p style="color:var(--color-primary);font-weight:var(--weight-medium)">hello@moodsync.app</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function handleContact(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !validateEmail(email) || !message) {
    showToast('Please fill in all fields correctly.', 'error');
    return;
  }

  showToast('Message sent! We\'ll get back to you soon. 💌');
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-message').value = '';
}

// ==================== 15. OUTCOMES ====================
function renderOutcomesPage() {
  const testimonials = [
    { quote: 'MoodSync completely changed how I study. The mood playlists keep me focused for hours!', author: 'Priya S.', role: 'Computer Science Student' },
    { quote: 'The Pomodoro timer with mood music is a game changer. My productivity went through the roof.', author: 'Arjun M.', role: 'Engineering Student' },
    { quote: 'I love how the interface changes with my mood. It feels like the app really understands me.', author: 'Sneha R.', role: 'Design Student' }
  ];

  return `
    <div class="page-content">
      <div class="container">
        <section class="section">
          <div class="section-header animate-fade-in-up">
            <h1>Impact & <span class="text-gradient">Outcomes</span></h1>
            <p>What MoodSync achieves for students around the world.</p>
          </div>

          <div class="outcomes-list animate-on-scroll" style="max-width:700px;margin:0 auto var(--space-12);">
            <div class="outcome-item">
              <div class="outcome-check">✓</div>
              <span>A mood-based music navigation website tailored for students.</span>
            </div>
            <div class="outcome-item">
              <div class="outcome-check">✓</div>
              <span>A productivity tool combining music, timers, and dynamic themes.</span>
            </div>
            <div class="outcome-item">
              <div class="outcome-check">✓</div>
              <span>A full-stack web development showcase using modern technologies.</span>
            </div>
          </div>

          <div class="stats-row stagger-children">
            <div class="glass-card stat-card">
              <div class="stat-number">500+</div>
              <div class="stat-label">Moods Matched</div>
            </div>
            <div class="glass-card stat-card">
              <div class="stat-number">1000+</div>
              <div class="stat-label">Study Sessions</div>
            </div>
            <div class="glass-card stat-card">
              <div class="stat-number">4</div>
              <div class="stat-label">Mood Types</div>
            </div>
          </div>

          <div class="section-header animate-on-scroll">
            <h2>What Students <span class="text-gradient">Say</span></h2>
          </div>
          <div class="testimonials-grid stagger-children">
            ${testimonials.map(t => `
              <div class="glass-card testimonial-card">
                <div class="testimonial-quote">${t.quote}</div>
                <div class="testimonial-author">${t.author}</div>
                <div class="testimonial-role">${t.role}</div>
              </div>
            `).join('')}
          </div>

          <div class="outcomes-cta animate-on-scroll">
            <h2>Ready to sync your <span class="text-gradient">mood</span>?</h2>
            <p style="color:var(--color-text-secondary);margin-bottom:var(--space-6);max-width:500px;margin-left:auto;margin-right:auto;">Join hundreds of students already using MoodSync to supercharge their study sessions.</p>
            <a href="#/signup" class="btn btn-primary btn-lg">Sign Up Now — It's Free</a>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ==================== 404 ====================
function render404Page() {
  return `
    <div class="page-content">
      <div class="container section text-center" style="padding-top:var(--space-32);">
        <div style="font-size:6rem;margin-bottom:var(--space-6)">🎵</div>
        <h1>404 — <span class="text-gradient">Off Beat</span></h1>
        <p style="font-size:var(--text-lg);margin:var(--space-4) auto var(--space-8);max-width:400px;">Looks like this page doesn't exist. Let's get you back in sync.</p>
        <a href="#/" class="btn btn-primary">Back to Home</a>
      </div>
    </div>
  `;
}
