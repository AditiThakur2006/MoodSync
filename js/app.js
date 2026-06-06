/* ============================================
   MoodSync App — Main Entry Point
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();

  // Render shell
  renderNavbar();
  renderFooter();

  // Initialize particles
  initParticles();

  // Register routes
  router.addRoute('/', renderHomePage);
  router.addRoute('/signup', renderSignupPage);
  router.addRoute('/login', renderLoginPage);
  router.addRoute('/about', renderAboutPage);
  router.addRoute('/features', renderFeaturesPage);
  router.addRoute('/moods', renderMoodsPage);
  router.addRoute('/playlist', renderPlaylistPage);
  router.addRoute('/timer', renderTimerPage);
  router.addRoute('/how-it-works', renderHowItWorksPage);
  router.addRoute('/tech-stack', renderTechStackPage);
  router.addRoute('/dashboard', renderDashboardPage);
  router.addRoute('/profile', renderProfilePage);
  router.addRoute('/settings', renderSettingsPage);
  router.addRoute('/contact', renderContactPage);
  router.addRoute('/outcomes', renderOutcomesPage);
  router.addRoute('/404', render404Page);

  // Start router
  router.init('app');

  // Handle auth changes
  window.addEventListener('authChanged', () => {
    renderNavbar();
  });

  // Handle route changes for particles
  window.addEventListener('routeChanged', (e) => {
    const path = e.detail.path;
    const particlePages = ['/', '/moods', '/playlist'];
    if (particlePages.includes(path)) {
      startParticles();
    } else {
      stopParticles();
    }

    // Init timer if on timer page
    if (path === '/timer') {
      setTimeout(() => initTimer(getDefaultTimer()), 100);
    }
  });

  // Navbar scroll effect
  window.addEventListener('scroll', debounce(() => {
    const nav = document.getElementById('navbar');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
  }, 10));
});

// ---- Navbar ----
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const user = getUser();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/moods', label: 'Moods' },
    { path: '/timer', label: 'Timer' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="#/" class="navbar-logo">
        <div class="navbar-logo-icon">♪</div>
        <span>MoodSync</span>
      </a>

      <div class="navbar-links" id="nav-links">
        ${links.map(l => `<a href="#${l.path}" class="navbar-link">${l.label}</a>`).join('')}
      </div>

      <div class="navbar-actions" id="nav-actions">
        <button class="navbar-theme-toggle" id="theme-toggle-btn" onclick="toggleTheme()" title="Toggle theme">
          ${isDarkMode() ? '☀️' : '🌙'}
        </button>
        ${user ? `
          <a href="#/dashboard" class="btn btn-secondary btn-sm" style="gap:var(--space-2)">
            <span class="profile-avatar" style="width:28px;height:28px;font-size:var(--text-xs);margin:0;box-shadow:none;">${getInitials(user.name)}</span>
            Dashboard
          </a>
        ` : `
          <a href="#/login" class="btn btn-secondary btn-sm">Log In</a>
          <a href="#/signup" class="btn btn-primary btn-sm">Sign Up</a>
        `}
      </div>

      <button class="navbar-hamburger" id="hamburger" onclick="toggleMobileMenu()" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div class="mobile-menu" id="mobile-menu">
      ${links.map(l => `<a href="#${l.path}" class="navbar-link" onclick="closeMobileMenu()">${l.label}</a>`).join('')}
      <div class="navbar-actions" style="display:flex;">
        ${user ? `
          <a href="#/dashboard" class="btn btn-primary" onclick="closeMobileMenu()">Dashboard</a>
          <a href="#/profile" class="btn btn-secondary" onclick="closeMobileMenu()">Profile</a>
          <a href="#/settings" class="btn btn-secondary" onclick="closeMobileMenu()">Settings</a>
          <button class="btn btn-outline" onclick="logout();closeMobileMenu()">Log Out</button>
        ` : `
          <a href="#/login" class="btn btn-secondary" onclick="closeMobileMenu()">Log In</a>
          <a href="#/signup" class="btn btn-primary" onclick="closeMobileMenu()">Sign Up</a>
        `}
      </div>
    </div>
  `;

  // Update active state
  router.updateActiveNav(router.getCurrentPath());
}

function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (hamburger && menu) {
    hamburger.classList.toggle('open');
    menu.classList.toggle('open');
  }
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (hamburger) hamburger.classList.remove('open');
  if (menu) menu.classList.remove('open');
}

// ---- Footer ----
function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#/" class="footer-brand-logo">
            <div class="navbar-logo-icon" style="width:30px;height:30px;font-size:0.9rem;">♪</div>
            MoodSync
          </a>
          <p class="footer-brand-tagline">Sync your mood. Fuel your focus. A mood-based music and study productivity platform built for students.</p>
        </div>

        <div>
          <div class="footer-col-title">Product</div>
          <div class="footer-links">
            <a href="#/features" class="footer-link">Features</a>
            <a href="#/moods" class="footer-link">Moods</a>
            <a href="#/timer" class="footer-link">Study Timer</a>
            <a href="#/tech-stack" class="footer-link">Tech Stack</a>
          </div>
        </div>

        <div>
          <div class="footer-col-title">Company</div>
          <div class="footer-links">
            <a href="#/about" class="footer-link">About Us</a>
            <a href="#/how-it-works" class="footer-link">How It Works</a>
            <a href="#/outcomes" class="footer-link">Outcomes</a>
          </div>
        </div>

        <div>
          <div class="footer-col-title">Connect</div>
          <div class="footer-links">
            <a href="#/contact" class="footer-link">Contact Us</a>
            <a href="#/signup" class="footer-link">Sign Up</a>
            <a href="#/login" class="footer-link">Log In</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-copyright">© 2025 MoodSync by Gursirat Kaur & Aditi Thakur</div>
        <div class="footer-social">
          <a href="#" title="GitHub">💻</a>
          <a href="#" title="Twitter">🐦</a>
          <a href="#" title="Instagram">📸</a>
        </div>
      </div>
    </div>
  `;
}
