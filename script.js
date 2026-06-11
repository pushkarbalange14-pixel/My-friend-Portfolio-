/* =====================================================
   SHRIWARDHAN KARANJE — PORTFOLIO
   script.js
   ===================================================== */

/* ── Loading Screen ── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loaderBar');
  const text     = document.getElementById('loaderText');
  const messages = ['Initializing...', 'Loading assets...', 'Building UI...', 'Almost ready...'];
  let progress   = 0;
  let msgIdx     = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';
    if (progress > (msgIdx + 1) * 25 && msgIdx < messages.length - 1) {
      msgIdx++;
      text.textContent = messages[msgIdx];
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        initAll();
      }, 400);
    }
  }, 120);

  document.body.style.overflow = 'hidden';
})();

function initAll() {
  initCursor();
  initParticles();
  initMouseGlow();
  initNav();
  initTyping();
  initScrollReveal();
  initSkillBars();
  initMagneticButtons();
  initContactForm();
}

/* ── Custom Cursor ── */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring following
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .tool-chip, .goal-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ── Particle Canvas ── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = '#63b3ed';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles() {
    const count = Math.min(Math.floor(W * H / 14000), 100);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = '#63b3ed';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

/* ── Mouse Glow ── */
function initMouseGlow() {
  const glow = document.getElementById('mouseGlow');
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animateGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animateGlow);
  })();
}

/* ── Navigation ── */
function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

/* ── Typing Animation ── */
function initTyping() {
  const el     = document.getElementById('typingText');
  const words  = [
    'Software Developer',
    'Problem Solver',
    'Java Programmer',
    'Web Developer',
    'Python Enthusiast',
  ];
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pausing  = false;

  function type() {
    const word    = words[wordIdx];
    const current = deleting ? word.slice(0, charIdx--) : word.slice(0, charIdx++);
    el.textContent = current;

    if (!deleting && charIdx > word.length) {
      pausing = true;
      setTimeout(() => { deleting = true; pausing = false; type(); }, 1800);
      return;
    }
    if (deleting && charIdx < 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      charIdx  = 0;
      setTimeout(type, 400);
      return;
    }
    if (!pausing) setTimeout(type, deleting ? 55 : 90);
  }

  setTimeout(type, 1200);
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children if multiple in a grid
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((sib, i) => {
          if (sib === entry.target) {
            entry.target.style.transitionDelay = (i * 0.08) + 's';
          }
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Skill Bars ── */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(fill => observer.observe(fill));
}

/* ── Magnetic Buttons ── */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.28;
      const dy     = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── Floating Geometric Shapes ── */
(function initGeometricShapes() {
  // Create floating shapes in the hero section
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const shapes = [
    { size: 60, top: '15%', left: '5%', delay: 0 },
    { size: 40, top: '70%', left: '8%', delay: 2 },
    { size: 50, top: '30%', right: '5%', delay: 1 },
    { size: 30, top: '80%', right: '12%', delay: 3 },
  ];
  shapes.forEach(s => {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      width: ${s.size}px; height: ${s.size}px;
      top: ${s.top || 'auto'};
      bottom: ${s.bottom || 'auto'};
      left: ${s.left || 'auto'};
      right: ${s.right || 'auto'};
      border: 1px solid rgba(99,179,237,0.12);
      border-radius: 6px;
      transform: rotate(45deg);
      animation: floatShape 8s ${s.delay}s ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
    `;
    hero.appendChild(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatShape {
      0%, 100% { transform: rotate(45deg) translateY(0) scale(1); opacity: 0.5; }
      50%       { transform: rotate(60deg) translateY(-20px) scale(1.06); opacity: 0.2; }
    }
  `;
  document.head.appendChild(style);
})();

/* ── Contact Form ── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('formName').value.trim();
    const email   = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      shakeForm(form);
      return;
    }

    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      btn.querySelector('span').textContent = 'Send Message';
      btn.disabled = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
  });
}

function shakeForm(form) {
  form.style.animation = 'shake 0.4s ease';
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25%       { transform: translateX(-6px); }
      75%       { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);
  setTimeout(() => { form.style.animation = ''; }, 400);
}

/* ── Smooth Parallax on Scroll ── */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.1 + i * 0.05;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
})();

/* ── Neon Border Glow on Nav active link ── */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id], .section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.getAttribute('id') || '';
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--accent)';
      }
    });
  }, { passive: true });
})();

/* ── Project card tilt on hover ── */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const rx    = ((e.clientY - cy) / (rect.height / 2)) * 5;
      const ry    = ((e.clientX - cx) / (rect.width  / 2)) * -5;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
