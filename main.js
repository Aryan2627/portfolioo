/* =========================================
   ARYAN TIWARI · PREMIUM PORTFOLIO JS
   ========================================= */

/* ====================================================
   CINEMATIC LOADER
   ==================================================== */
const loader      = document.getElementById('loader');
const loaderFill  = document.getElementById('loaderFill');
const loaderPct   = document.getElementById('loaderPercent');
const loaderBarP  = document.getElementById('loaderBarPct');
const loaderSt    = document.getElementById('loaderStatus');
const body        = document.body;

const STEPS = [
  { pct: 8,   status: 'LOADING ASSETS...',        log: 0 },
  { pct: 24,  status: 'PARSING STYLESHEETS...',   log: 1 },
  { pct: 52,  status: 'INITIALIZING CANVAS...',   log: 2 },
  { pct: 78,  status: 'MOUNTING COMPONENTS...',   log: 3 },
  { pct: 95,  status: 'STARTING ANIMATIONS...',   log: 4 },
  { pct: 100, status: 'LAUNCH SEQUENCE COMPLETE', log: -1 },
];

let currentPct = 0;
let stepIdx = 0;

function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

function animatePctTo(target, duration, onDone) {
  const start = currentPct;
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = easeOutExpo(t);
    const val = Math.round(start + (target - start) * eased);
    currentPct = val;
    // Update DOM
    const numNode = loaderPct.childNodes[0];
    if (numNode) numNode.textContent = val;
    loaderPct.setAttribute('data-text', val);
    loaderFill.style.width = val + '%';
    loaderBarP.textContent = val + '%';
    if (t < 1) { requestAnimationFrame(tick); }
    else { onDone && onDone(); }
  }
  requestAnimationFrame(tick);
}

function runStep() {
  if (stepIdx >= STEPS.length) return;
  const { pct, status, log } = STEPS[stepIdx++];
  loaderSt.textContent = status;
  if (log >= 0) {
    const line = document.getElementById('log' + log);
    if (line) line.classList.add('show');
  }
  const isLast = stepIdx === STEPS.length;
  const dur = isLast ? 400 : 320 + Math.random() * 200;
  animatePctTo(pct, dur, () => {
    if (isLast) {
      // Brief pause then split-reveal exit
      setTimeout(() => {
        loader.classList.add('hidden');
        body.classList.remove('loading');
        setTimeout(triggerReveal, 800);
      }, 500);
    } else {
      setTimeout(runStep, 100 + Math.random() * 160);
    }
  });
}

// Stagger log lines first appearance
[0,1,2,3,4].forEach(i => {
  const el = document.getElementById('log' + i);
  if (el) el.style.transitionDelay = (i * 0.08) + 's';
});

setTimeout(runStep, 600);

/* ====================================================
   MULTI-LAYER CURSOR + TRAIL
   ==================================================== */
const cDot   = document.getElementById('cursorDot');
const cRing  = document.getElementById('cursorRing');
const cOuter = document.getElementById('cursorOuter');
const cLabel = document.getElementById('cursorLabel');

let mx = 0, my = 0;
// Each layer has its own position + lerp speed
const layers = [
  { el: cRing,  x: 0, y: 0, speed: 0.14 },
  { el: cOuter, x: 0, y: 0, speed: 0.07 },
  { el: cLabel, x: 0, y: 0, speed: 0.14 },
];

// Trail constellation — 12 dots
const TRAIL_COUNT = 12;
const trail = [];
for (let i = 0; i < TRAIL_COUNT; i++) {
  const t = document.createElement('div');
  t.className = 'cursor-trail';
  const scale = 1 - i / TRAIL_COUNT;
  t.style.cssText = `
    width: ${Math.max(2, 5 * scale)}px;
    height: ${Math.max(2, 5 * scale)}px;
    opacity: ${(0.5 * scale).toFixed(2)};
    filter: blur(${i > 6 ? 1 : 0}px);
  `;
  document.body.appendChild(t);
  trail.push({ el: t, x: 0, y: 0, speed: 0.08 + (1 - scale) * 0.06 });
}

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

// Direct dot follows mouse exactly
document.addEventListener('mousemove', e => {
  cDot.style.left = e.clientX + 'px';
  cDot.style.top  = e.clientY + 'px';
});

// Click effects
document.addEventListener('mousedown', () => {
  cDot.classList.add('clicking');
  cRing.classList.add('clicking');
  cOuter.classList.add('clicking');
  // Ripple burst
  createClickRipple(mx, my);
});
document.addEventListener('mouseup', () => {
  cDot.classList.remove('clicking');
  cRing.classList.remove('clicking');
  cOuter.classList.remove('clicking');
});

// Click ripple
function createClickRipple(x, y) {
  const r = document.createElement('div');
  r.style.cssText = `
    position:fixed; border-radius:50%; pointer-events:none;
    z-index:9994; border:1.5px solid rgba(255,107,53,0.7);
    width:10px; height:10px;
    left:${x}px; top:${y}px;
    transform:translate(-50%,-50%);
    animation:rippleBurst 0.6s var(--ease-out) forwards;
  `;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
}
// Ripple keyframe injected once
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleBurst {
    from { width:10px; height:10px; opacity:1; }
    to   { width:80px; height:80px; opacity:0; }
  }
`;
document.head.appendChild(rippleStyle);

// Hover effects — with custom label text
const hoverMap = new Map([
  ['a',       'VIEW'],
  ['button',  'CLICK'],
  ['.project-card', 'OPEN'],
  ['.timeline-card', 'READ'],
  ['.contact-pill', 'CONTACT'],
  ['.pillar-card', 'LEARN'],
]);
hoverMap.forEach((label, selector) => {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cRing.classList.add('hovered');
      cOuter.classList.add('hovered');
      cLabel.textContent = label;
      cLabel.classList.add('show');
    });
    el.addEventListener('mouseleave', () => {
      cRing.classList.remove('hovered');
      cOuter.classList.remove('hovered');
      cLabel.classList.remove('show');
    });
  });
});

// Animation loop for smooth-following layers
function cursorLoop() {
  // Ring and outer layers
  layers.forEach(layer => {
    layer.x += (mx - layer.x) * layer.speed;
    layer.y += (my - layer.y) * layer.speed;
    layer.el.style.left = layer.x + 'px';
    layer.el.style.top  = layer.y + 'px';
  });
  // Trail: each follows the previous
  if (trail.length) {
    trail[0].x += (mx - trail[0].x) * trail[0].speed;
    trail[0].y += (my - trail[0].y) * trail[0].speed;
    trail[0].el.style.left = trail[0].x + 'px';
    trail[0].el.style.top  = trail[0].y + 'px';
    for (let i = 1; i < trail.length; i++) {
      trail[i].x += (trail[i-1].x - trail[i].x) * trail[i].speed;
      trail[i].y += (trail[i-1].y - trail[i].y) * trail[i].speed;
      trail[i].el.style.left = trail[i].x + 'px';
      trail[i].el.style.top  = trail[i].y + 'px';
    }
  }
  requestAnimationFrame(cursorLoop);
}
cursorLoop();


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

/* ====================================================
   ACHIEVEMENTS — RANK COUNTERS + CONFETTI
   ==================================================== */

/* ── Rank counter (integers: TOP 50, #2) ── */
function animRankCounter(el) {
  const target = parseInt(el.dataset.rank, 10);
  const prefix = el.dataset.prefix || '';
  const dur    = 1400;
  const start  = performance.now();
  function tick(now) {
    const t   = Math.min((now - start) / dur, 1);
    const eas = 1 - Math.pow(1 - t, 3);          // ease-out-cubic
    const val = Math.round(eas * target);
    el.textContent = prefix + val;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target;
  }
  requestAnimationFrame(tick);
}

/* ── Rating counter (decimal: 4.3) ── */
function animRatingCounter(el) {
  const target = parseFloat(el.dataset.rating);
  const dur    = 1600;
  const start  = performance.now();
  function tick(now) {
    const t   = Math.min((now - start) / dur, 1);
    const eas = 1 - Math.pow(1 - t, 3);
    const val = (eas * target).toFixed(1);
    el.textContent = val;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(1);
  }
  requestAnimationFrame(tick);
}

/* ── Confetti system ── */
const confCanvas = document.getElementById('confetti-canvas');
let confettiActive = false;

function launchConfetti() {
  if (!confCanvas || confettiActive) return;
  confettiActive = true;

  const ctx  = confCanvas.getContext('2d');
  const W    = confCanvas.offsetWidth;
  const H    = confCanvas.offsetHeight;
  confCanvas.width  = W;
  confCanvas.height = H;

  const COLORS = ['#ff6b35','#f72585','#ffbe0b','#06d6a0','#7209b7','#ffffff'];
  const PIECES = 120;
  const pieces = Array.from({ length: PIECES }, () => ({
    x:    Math.random() * W,
    y:    -20 - Math.random() * 100,
    w:    6  + Math.random() * 8,
    h:    3  + Math.random() * 5,
    rot:  Math.random() * 360,
    vx:   (Math.random() - 0.5) * 4,
    vy:   2  + Math.random() * 4,
    vr:   (Math.random() - 0.5) * 8,
    col:  COLORS[Math.floor(Math.random() * COLORS.length)],
    life: 1,
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    pieces.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vr;
      p.vy  += 0.08;                    // gravity
      if (p.y > H + 20) { p.life = 0; return; }
      alive++;
      p.life = Math.max(0, 1 - p.y / H * 0.8);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive > 0) frame = requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, W, H); confettiActive = false; }
  }
  draw();
}

/* ── Observer: fire everything when section enters view ── */
const achSection = document.getElementById('achievements');
if (achSection) {
  const achObs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    achObs.disconnect();

    // Fire confetti
    setTimeout(launchConfetti, 300);

    // Animate integer rank counters
    document.querySelectorAll('.rank-num[data-rank]').forEach((el, i) => {
      setTimeout(() => animRankCounter(el), 200 + i * 120);
    });

    // Animate decimal rating counter
    document.querySelectorAll('.star-num[data-rating]').forEach((el, i) => {
      setTimeout(() => animRatingCounter(el), 200 + i * 120);
    });

    // Card staggered entrance (override data-reveal delay)
    document.querySelectorAll('.ach-card').forEach((card, i) => {
      const delay = parseInt(card.dataset.achDelay || 0, 10);
      setTimeout(() => card.classList.add('revealed'), delay);
    });

  }, { threshold: 0.15 });
  achObs.observe(achSection);
}

/* ── 3D tilt on achievement cards ── */
document.querySelectorAll('.ach-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-10px) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
