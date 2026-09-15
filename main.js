/* =========================================
   ARYAN TIWARI · PREMIUM PORTFOLIO JS
   ========================================= */

/* ====== LOADER ====== */
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderText = document.getElementById('loaderText');
const body       = document.body;

const loadSteps = [
  { pct: 20,  txt: 'LOADING ASSETS...'   },
  { pct: 50,  txt: 'BUILDING UI...'      },
  { pct: 80,  txt: 'STARTING CANVAS...'  },
  { pct: 100, txt: 'READY.'              },
];

let step = 0;
function runLoader() {
  if (step >= loadSteps.length) {
    setTimeout(() => {
      loader.classList.add('hidden');
      body.classList.remove('loading');
      triggerReveal();
    }, 300);
    return;
  }
  const { pct, txt } = loadSteps[step++];
  loaderFill.style.width = pct + '%';
  loaderText.textContent = txt;
  setTimeout(runLoader, 420);
}
setTimeout(runLoader, 200);

/* ====== CUSTOM CURSOR ====== */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mousedown', () => ring.classList.add('clicking'));
document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

document.querySelectorAll('a, button, .glass-card, .magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ====== PARTICLE CANVAS ====== */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
resizeCanvas();

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.3 + 0.06;
    // Tri-color: orange, pink, purple
    const hues = [22, 330, 275];
    this.hue = hues[Math.floor(Math.random() * hues.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor(W / 12), 100);
  particles = Array.from({ length: count }, () => new Particle());
}

const CONN_DIST = 130;
function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < CONN_DIST) {
        const alpha = (1 - d / CONN_DIST) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,107,80,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animCanvas);
}
initParticles();
animCanvas();

/* ====== NAVBAR SCROLL ====== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
});

/* ====== MOBILE MENU ====== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    body.style.overflow = '';
  });
});

/* ====== ACTIVE NAV LINK ====== */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
function updateActiveLink() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

/* ====== SMOOTH SCROLL ====== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ====== SCROLL REVEAL ====== */
function triggerReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('revealed');
        // Skill bars
        el.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        // Counters
        el.querySelectorAll('[data-count]').forEach(counter => animCounter(counter));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  // Reveal lines separately
  const lineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.reveal-line').forEach(line => {
          line.classList.add('revealed');
        });
        lineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.hero-title').forEach(el => lineObs.observe(el));
}

/* ====== COUNTER ANIMATION ====== */
function animCounter(el) {
  const target = +el.dataset.count;
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + '+';
  }
  requestAnimationFrame(update);
}

/* ====== MAGNETIC BUTTONS ====== */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.28;
    const dy   = (e.clientY - cy) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ====== HERO BADGE REVEAL ====== */
setTimeout(() => {
  document.querySelector('.hero-badge')?.classList.add('revealed');
}, 800);
setTimeout(() => {
  document.querySelectorAll('.reveal-line').forEach(el => el.classList.add('revealed'));
  document.querySelectorAll('.hero-desc, .hero-stats, .hero-cta').forEach(el => el.classList.add('revealed'));
}, 900);

/* ====== TILT EFFECT ON CARDS ====== */
document.querySelectorAll('.project-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ====== CONTACT FORM ====== */
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');
  btn.disabled = true;
  btnText.textContent = 'Sending...';
  btnIcon.className = 'fa-solid fa-spinner fa-spin';
  setTimeout(() => {
    btnText.textContent = 'Sent! ✓';
    btnIcon.className = 'fa-solid fa-check';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    e.target.reset();
    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btnIcon.className = 'fa-solid fa-paper-plane';
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  }, 1800);
});

/* ====== FLOATING CARDS MOUSE PARALLAX ====== */
const floatCards = document.querySelectorAll('.float-card');
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  floatCards.forEach((card, i) => {
    const factor = (i + 1) * 6;
    card.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});
