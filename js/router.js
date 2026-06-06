/* ============================================
   MoodSync Router — Hash-based SPA Router
   ============================================ */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.appContainer = null;
    this.beforeNavigate = null;
  }

  init(containerId) {
    this.appContainer = document.getElementById(containerId);
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  addRoute(path, renderFn) {
    this.routes[path] = renderFn;
  }

  navigate(path) {
    window.location.hash = path;
  }

  getParams() {
    const hash = window.location.hash.slice(1);
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return {};
    const queryString = hash.slice(queryIndex + 1);
    const params = {};
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return params;
  }

  getCurrentPath() {
    const hash = window.location.hash.slice(1) || '/';
    const queryIndex = hash.indexOf('?');
    return queryIndex === -1 ? hash : hash.slice(0, queryIndex);
  }

  async handleRoute() {
    const path = this.getCurrentPath();

    if (this.currentRoute === path) return;

    if (this.beforeNavigate) {
      const shouldContinue = this.beforeNavigate(path);
      if (shouldContinue === false) return;
    }

    const renderFn = this.routes[path] || this.routes['/404'];

    if (!this.appContainer || !renderFn) return;

    // Page transition
    this.appContainer.classList.add('page-transition-exit');

    await new Promise(resolve => setTimeout(resolve, 200));

    this.appContainer.innerHTML = renderFn();
    this.currentRoute = path;

    this.appContainer.classList.remove('page-transition-exit');
    this.appContainer.classList.add('page-transition-enter');

    setTimeout(() => {
      this.appContainer.classList.remove('page-transition-enter');
    }, 350);

    // Scroll to top
    window.scrollTo(0, 0);

    // Fire custom event
    window.dispatchEvent(new CustomEvent('routeChanged', { detail: { path } }));

    // Init scroll animations
    this.initScrollAnimations();

    // Update active nav link
    this.updateActiveNav(path);
  }

  initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  updateActiveNav(path) {
    document.querySelectorAll('.navbar-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

const router = new Router();
