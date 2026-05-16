document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  initScrollReveal();
  initNavHighlight();
  initMouseParallax();
  initCustomCursor();
  initParticleFigure();
});

function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  const count = 80;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() < 0.3 ? 2 : 1;
    const isPurple = Math.random() < 0.08;
    const isBlue   = Math.random() < 0.08;

    Object.assign(star.style, {
      width:   size + 'px',
      height:  size + 'px',
      top:     Math.random() * 100 + '%',
      left:    Math.random() * 100 + '%',
      opacity: (Math.random() * 0.5 + 0.3).toFixed(2),
      background: isPurple ? '#c4b5fd' : isBlue ? '#93c5fd' : 'white',
      boxShadow: (isPurple || isBlue)
        ? `0 0 4px ${isPurple ? '#a78bfa' : '#60a5fa'}`
        : 'none',
    });

    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id], div[id="contact"]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

function initMouseParallax() {
  const hero = document.getElementById('hero');
  const nebulaLayer = document.getElementById('nebula-layer');
  const heroContent = hero ? hero.querySelector('.hero-content') : null;
  if (!hero || !nebulaLayer) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = (e.clientX - rect.left - rect.width  / 2) * 0.025;
    targetY = (e.clientY - rect.top  - rect.height / 2) * 0.018;
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function tick() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    nebulaLayer.style.transform = `translate(${currentX}px, ${currentY}px)`;
    if (heroContent) {
      heroContent.style.transform = `translate(${-currentX * 0.3}px, ${-currentY * 0.3}px)`;
    }

    requestAnimationFrame(tick);
  }

  tick();
}

function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot  hidden';
  ring.className = 'cursor-ring hidden';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let ringX = 0, ringY = 0;
  let dotX  = 0, dotY  = 0;
  let mouseX = 0, mouseY = 0;
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      visible = true;
      dot.classList.remove('hidden');
      ring.classList.remove('hidden');
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    ring.classList.add('hidden');
    visible = false;
  });

  // Hover state: enlarge ring over clickable elements
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button')) {
      ring.style.transform = 'translate(-50%, -50%) scale(1.6)';
      ring.style.borderColor = 'rgba(167, 139, 250, 0.7)';
      dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    } else {
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = 'rgba(167, 139, 250, 0.35)';
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  });

  function animateCursor() {
    // dot tracks immediately
    dotX  += (mouseX - dotX)  * 0.9;
    dotY  += (mouseY - dotY)  * 0.9;
    // ring lags behind
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    dot.style.left  = dotX  + 'px';
    dot.style.top   = dotY  + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

function initParticleFigure() {
  const canvas = document.getElementById('figure-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  // Particle coordinates sampled from actual photo (100x108 source space)
  const SOURCE_W = 100, SOURCE_H = 108;
  const PHOTO_PTS = [[39,0],[42,0],[45,0],[48,0],[33,3],[36,3],[39,3],[42,3],[45,3],[48,3],[51,3],[54,3],[30,6],[33,6],[36,6],[39,6],[42,6],[45,6],[48,6],[51,6],[54,6],[57,6],[30,9],[33,9],[36,9],[39,9],[42,9],[45,9],[48,9],[51,9],[54,9],[57,9],[60,9],[27,12],[30,12],[33,12],[36,12],[39,12],[42,12],[57,12],[60,12],[27,15],[30,15],[33,15],[36,15],[39,15],[42,15],[45,15],[48,15],[51,15],[54,15],[57,15],[60,15],[27,18],[30,18],[33,18],[36,18],[39,18],[42,18],[45,18],[48,18],[51,18],[54,18],[57,18],[60,18],[27,21],[30,21],[33,21],[36,21],[39,21],[42,21],[45,21],[48,21],[51,21],[54,21],[57,21],[60,21],[30,24],[33,24],[36,24],[39,24],[42,24],[45,24],[48,24],[51,24],[54,24],[57,24],[60,24],[30,27],[33,27],[36,27],[39,27],[42,27],[45,27],[48,27],[51,27],[54,27],[57,27],[60,27],[30,30],[33,30],[36,30],[39,30],[42,30],[45,30],[48,30],[51,30],[54,30],[57,30],[60,30],[30,33],[33,33],[36,33],[39,33],[42,33],[45,33],[48,33],[51,33],[54,33],[57,33],[60,33],[30,36],[33,36],[36,36],[39,36],[42,36],[45,36],[48,36],[51,36],[54,36],[57,36],[30,39],[33,39],[36,39],[39,39],[42,39],[45,39],[48,39],[51,39],[54,39],[57,39],[63,39],[66,39],[69,39],[21,42],[24,42],[30,42],[33,42],[36,42],[39,42],[42,42],[45,42],[48,42],[51,42],[54,42],[57,42],[63,42],[66,42],[69,42],[72,42],[75,42],[15,45],[18,45],[21,45],[36,45],[39,45],[42,45],[45,45],[48,45],[51,45],[54,45],[66,45],[72,45],[75,45],[78,45],[81,45],[12,48],[15,48],[18,48],[24,48],[39,48],[42,48],[45,48],[48,48],[51,48],[54,48],[66,48],[69,48],[72,48],[75,48],[78,48],[81,48],[84,48],[87,48],[12,51],[15,51],[18,51],[21,51],[39,51],[42,51],[45,51],[48,51],[51,51],[57,51],[69,51],[75,51],[78,51],[81,51],[84,51],[87,51],[9,54],[12,54],[18,54],[21,54],[42,54],[45,54],[48,54],[57,54],[63,54],[66,54],[69,54],[72,54],[78,54],[81,54],[84,54],[87,54],[90,54],[6,57],[9,57],[12,57],[21,57],[42,57],[45,57],[48,57],[54,57],[57,57],[69,57],[72,57],[78,57],[81,57],[84,57],[87,57],[90,57],[3,60],[6,60],[9,60],[12,60],[15,60],[18,60],[24,60],[27,60],[45,60],[57,60],[66,60],[69,60],[78,60],[81,60],[84,60],[87,60],[90,60],[93,60],[3,63],[6,63],[12,63],[15,63],[18,63],[42,63],[45,63],[54,63],[63,63],[66,63],[75,63],[78,63],[81,63],[84,63],[87,63],[90,63],[93,63],[96,63],[0,66],[3,66],[6,66],[9,66],[12,66],[15,66],[21,66],[24,66],[39,66],[42,66],[45,66],[54,66],[63,66],[66,66],[72,66],[75,66],[78,66],[81,66],[84,66],[87,66],[90,66],[93,66],[96,66],[0,69],[3,69],[6,69],[9,69],[12,69],[15,69],[24,69],[39,69],[42,69],[45,69],[48,69],[54,69],[60,69],[66,69],[69,69],[72,69],[75,69],[81,69],[84,69],[87,69],[90,69],[93,69],[96,69],[99,69],[0,72],[3,72],[6,72],[9,72],[15,72],[24,72],[33,72],[39,72],[42,72],[45,72],[48,72],[60,72],[66,72],[69,72],[72,72],[75,72],[81,72],[87,72],[90,72],[93,72],[96,72],[99,72],[0,75],[3,75],[6,75],[9,75],[15,75],[18,75],[24,75],[33,75],[39,75],[42,75],[45,75],[48,75],[51,75],[60,75],[66,75],[69,75],[72,75],[75,75],[78,75],[81,75],[87,75],[90,75],[93,75],[96,75],[99,75],[0,78],[3,78],[6,78],[9,78],[15,78],[18,78],[24,78],[39,78],[42,78],[45,78],[48,78],[51,78],[54,78],[57,78],[60,78],[63,78],[66,78],[69,78],[72,78],[75,78],[78,78],[81,78],[93,78],[96,78],[99,78],[0,81],[3,81],[6,81],[9,81],[12,81],[15,81],[24,81],[39,81],[42,81],[45,81],[48,81],[51,81],[57,81],[60,81],[63,81],[66,81],[69,81],[72,81],[75,81],[78,81],[90,81],[93,81],[96,81],[99,81],[3,84],[6,84],[9,84],[15,84],[21,84],[24,84],[27,84],[30,84],[36,84],[39,84],[42,84],[45,84],[48,84],[51,84],[54,84],[57,84],[60,84],[63,84],[66,84],[69,84],[72,84],[75,84],[78,84],[87,84],[90,84],[93,84],[96,84],[99,84],[9,87],[12,87],[15,87],[21,87],[36,87],[39,87],[42,87],[45,87],[48,87],[51,87],[54,87],[57,87],[63,87],[66,87],[69,87],[72,87],[75,87],[78,87],[90,87],[93,87],[96,87],[99,87],[0,90],[15,90],[21,90],[27,90],[36,90],[39,90],[42,90],[45,90],[48,90],[51,90],[54,90],[57,90],[63,90],[66,90],[69,90],[72,90],[75,90],[78,90],[81,90],[90,90],[96,90],[99,90],[0,93],[3,93],[6,93],[15,93],[39,93],[42,93],[45,93],[48,93],[51,93],[54,93],[57,93],[63,93],[66,93],[69,93],[72,93],[75,93],[78,93],[81,93],[93,93],[96,93],[0,96],[3,96],[6,96],[24,96],[33,96],[66,96],[69,96],[72,96],[75,96],[78,96],[84,96],[87,96],[90,96],[93,96],[96,96],[99,96],[0,99],[3,99],[6,99],[9,99],[12,99],[45,99],[66,99],[84,99],[87,99],[90,99],[93,99],[96,99],[99,99],[0,102],[3,102],[6,102],[9,102],[48,102],[51,102],[54,102],[81,102],[84,102],[87,102],[90,102],[93,102],[96,102],[99,102],[0,105],[3,105],[6,105],[9,105],[24,105],[78,105],[81,105],[84,105],[87,105],[90,105],[93,105],[96,105],[99,105]];

  function buildParticles() {
    const scale   = canvas.height < 500 ? 2.2 : 4.0;
    const originX = canvas.width  * 0.62 - (SOURCE_W * scale) / 2;
    const originY = canvas.height * 0.50 - (SOURCE_H * scale) / 2;

    particles.length = 0;
    for (const [sx, sy] of PHOTO_PTS) {
      const hx = originX + sx * scale;
      const hy = originY + sy * scale;
      particles.push({ x: hx, y: hy, hx, hy, vx: 0, vy: 0 });
    }
  }

  const particles = [];
  buildParticles();

  let mouseX = -9999, mouseY = -9999;

  // Track mouse globally (figure responds even when cursor is elsewhere on page)
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  const REPEL_RADIUS   = 90;
  const REPEL_STRENGTH = 6.5;
  const SPRING         = 0.07;
  const DAMPING        = 0.72;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      const dx   = p.x - mouseX;
      const dy   = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) ** 1.5;
        p.vx += (dx / dist) * force * REPEL_STRENGTH;
        p.vy += (dy / dist) * force * REPEL_STRENGTH;
      }

      // Spring back to home
      p.vx += (p.hx - p.x) * SPRING;
      p.vy += (p.hy - p.y) * SPRING;

      // Damping
      p.vx *= DAMPING;
      p.vy *= DAMPING;

      p.x += p.vx;
      p.y += p.vy;

      // Colour: purple when displaced, dimmer when at rest
      const displacement = Math.sqrt((p.x - p.hx) ** 2 + (p.y - p.hy) ** 2);
      const glow = Math.min(displacement / 30, 1);
      const alpha = 0.18 + glow * 0.45;
      const r = Math.round(167 + glow * 40);
      const g = Math.round(139 - glow * 30);
      const b = 250;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}
