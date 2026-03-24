// Neural Network / Particle Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 210, 255, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const numParticles = Math.min(window.innerWidth / 15, 120);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 210, 255, ${1 - dist / 150})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Terminal Typing Effect
const terminalText = document.getElementById('terminal-text');
const originalText = "> SYSTEM READY.\n> LOAD PORTFOLIO_DATA...\n> CONNECTING TO NEURAL LINK...\n> STATUS: ONLINE.\n> AWAITING DIRECTIVES.";
let charIndex = 0;

terminalText.innerHTML = '';

function typeEffect() {
    if (charIndex < originalText.length) {
        if(originalText.charAt(charIndex) === '\n') {
            terminalText.innerHTML += '<br>';
        } else {
            terminalText.innerHTML += originalText.charAt(charIndex);
        }
        charIndex++;
        setTimeout(typeEffect, 40);
    } else {
        terminalText.innerHTML += '<span class="cursor" style="animation: blink 1s infinite">_</span>';
    }
}

// Start typing effect on load or when scrolling to contact section
let typingStarted = false;
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !typingStarted) {
        typingStarted = true;
        setTimeout(typeEffect, 500);
    }
}, { threshold: 0.5 });

const contactSection = document.getElementById('contact');
if(contactSection) {
    observer.observe(contactSection);
} else {
    setTimeout(typeEffect, 1000);
}

// Add style for blink dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}
`;
document.head.appendChild(style);

// Smooth scrolling for navigation
document.querySelectorAll('.nav-links a, .hero-cta a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            const el = document.querySelector(targetId);
            if(el) {
                el.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Form submission simulation
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btnSpan = e.target.querySelector('button span');
    const originalBtnText = btnSpan.textContent;
    btnSpan.textContent = 'Transmitting...';
    
    // Simulate network request
    setTimeout(() => {
        btnSpan.textContent = 'Payload Delivered!';
        e.target.reset();
        
        // Add to terminal
        const cursor = terminalText.querySelector('.cursor');
        if(cursor) cursor.remove();
        terminalText.innerHTML += '<br>> NEW MESSAGE SENT.<br>> WAITING FOR REPONSE...<span class="cursor" style="animation: blink 1s infinite">_</span>';
        terminalText.scrollTop = terminalText.scrollHeight;

        setTimeout(() => {
            btnSpan.textContent = originalBtnText;
        }, 3000);
    }, 1500);
});

// Glitch Effect logic updates for Hero Text
const glitchText = document.querySelector('.glitch');
setInterval(() => {
    glitchText.style.animation = 'none';
    setTimeout(() => {
        glitchText.style.animation = 'glitch 500ms infinite';
    }, 50);
}, 3000);
