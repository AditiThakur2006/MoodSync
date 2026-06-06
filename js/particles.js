/* ============================================
   MoodSync Particles — Floating Music Notes
   ============================================ */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    this.symbols = ['♪', '♫', '♬', '♩', '🎵', '🎶'];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 20,
      size: Math.random() * 16 + 10,
      speed: Math.random() * 0.6 + 0.2,
      opacity: Math.random() * 0.15 + 0.05,
      symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.01 + 0.005,
      wobbleAmount: Math.random() * 30 + 15,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01
    };
  }

  start(maxParticles = 18) {
    if (this.isRunning || !this.canvas) return;
    this.isRunning = true;
    this.maxParticles = maxParticles;

    // Initialize some particles
    for (let i = 0; i < maxParticles / 2; i++) {
      const p = this.createParticle();
      p.y = Math.random() * this.canvas.height;
      this.particles.push(p);
    }

    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  animate() {
    if (!this.isRunning || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Add new particles
    if (this.particles.length < this.maxParticles && Math.random() > 0.96) {
      this.particles.push(this.createParticle());
    }

    // Update and draw
    this.particles = this.particles.filter(p => {
      p.y -= p.speed;
      p.wobble += p.wobbleSpeed;
      p.rotation += p.rotationSpeed;
      const x = p.x + Math.sin(p.wobble) * p.wobbleAmount;

      if (p.y < -30) return false;

      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.translate(x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.font = `${p.size}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(p.symbol, 0, 0);
      this.ctx.restore();

      return true;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

let particleSystem = null;

function initParticles() {
  if (!particleSystem) {
    particleSystem = new ParticleSystem('particles-canvas');
  }
}

function startParticles() {
  if (particleSystem) particleSystem.start();
}

function stopParticles() {
  if (particleSystem) particleSystem.stop();
}
