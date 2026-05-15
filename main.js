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

  // Draw humanoid silhouette to offscreen canvas, sample filled pixels
  function buildParticles() {
    const W = 110, H = 210;
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const oc = off.getContext('2d');
    oc.fillStyle = '#fff';

    // Head
    oc.beginPath();
    oc.arc(55, 22, 19, 0, Math.PI * 2);
    oc.fill();

    // Neck
    oc.fillRect(49, 40, 12, 12);

    // Torso
    oc.beginPath();
    oc.roundRect(34, 52, 42, 68, 6);
    oc.fill();

    // Left arm
    oc.save();
    oc.translate(34, 58);
    oc.rotate(0.25);
    oc.beginPath();
    oc.roundRect(-13, 0, 13, 58, 5);
    oc.fill();
    oc.restore();

    // Right arm
    oc.save();
    oc.translate(76, 58);
    oc.rotate(-0.25);
    oc.beginPath();
    oc.roundRect(0, 0, 13, 58, 5);
    oc.fill();
    oc.restore();

    // Left leg
    oc.save();
    oc.translate(44, 118);
    oc.rotate(0.08);
    oc.beginPath();
    oc.roundRect(-11, 0, 20, 72, 5);
    oc.fill();
    oc.restore();

    // Right leg
    oc.save();
    oc.translate(66, 118);
    oc.rotate(-0.08);
    oc.beginPath();
    oc.roundRect(-9, 0, 20, 72, 5);
    oc.fill();
    oc.restore();

    const data = oc.getImageData(0, 0, W, H).data;
    const gap  = 4; // px between sampled dots
    const scale = canvas.height < 500 ? 1.6 : 2.1;

    // Position figure on right side of hero
    const originX = canvas.width  * 0.70 - (W * scale) / 2;
    const originY = canvas.height * 0.50 - (H * scale) / 2;

    particles.length = 0;

    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        const i = (y * W + x) * 4;
        if (data[i + 3] > 128) {
          const hx = originX + x * scale;
          const hy = originY + y * scale;
          particles.push({ x: hx, y: hy, hx, hy, vx: 0, vy: 0 });
        }
      }
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
