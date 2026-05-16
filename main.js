document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  initScrollReveal();
  initNavHighlight();
  initMouseParallax();
  initCustomCursor();
  initNeuralNetwork();
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

function initNeuralNetwork() {
  const canvas = document.getElementById('figure-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildNetwork(); });

  const LAYER_SIZES = [4, 6, 7, 6, 4, 2];

  let nodes  = [];
  let edges  = [];
  let pulses = [];

  function buildNetwork() {
    nodes  = [];
    edges  = [];
    pulses = [];

    const netW   = canvas.width  * 0.92;
    const netH   = canvas.height * 0.88;
    const startX = canvas.width  * 0.04;
    const startY = (canvas.height - netH) / 2;
    const layerGap = netW / (LAYER_SIZES.length - 1);

    const layerStarts = [];
    LAYER_SIZES.forEach((count, li) => {
      layerStarts.push(nodes.length);
      const x       = startX + li * layerGap;
      const nodeGap = netH   / (count + 1);
      for (let ni = 0; ni < count; ni++) {
        const y = startY + (ni + 1) * nodeGap;
        nodes.push({ x, y, hx: x, hy: y, vx: 0, vy: 0,
                     r: 3.5 + Math.random(), phase: Math.random() * Math.PI * 2 });
      }
    });

    for (let li = 0; li < LAYER_SIZES.length - 1; li++) {
      const aStart = layerStarts[li];
      const bStart = layerStarts[li + 1];
      for (let ai = 0; ai < LAYER_SIZES[li]; ai++) {
        for (let bi = 0; bi < LAYER_SIZES[li + 1]; bi++) {
          edges.push({ a: aStart + ai, b: bStart + bi,
                       opacity: 0.08 + Math.random() * 0.1 });
        }
      }
    }

    for (let i = 0; i < 12; i++) spawnPulse();
  }

  function spawnPulse() {
    if (!edges.length) return;
    const edge = edges[Math.floor(Math.random() * edges.length)];
    pulses.push({ edge, t: Math.random(), speed: 0.003 + Math.random() * 0.005,
                  alpha: 0.7 + Math.random() * 0.3, size: 1.5 + Math.random() });
  }

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  window.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  const REPEL = 100, SPRING = 0.055, DAMPING = 0.72;
  let tick = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tick++;

    if (Math.random() < 0.04) spawnPulse();
    if (pulses.length > 60) pulses.splice(0, pulses.length - 60);

    // Update nodes
    for (const n of nodes) {
      const dx = n.x - mouseX, dy = n.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL && dist > 0) {
        const f = ((REPEL - dist) / REPEL) ** 2;
        n.vx += (dx / dist) * f * 6;
        n.vy += (dy / dist) * f * 6;
      }
      n.vx += (n.hx - n.x) * SPRING;
      n.vy += (n.hy - n.y) * SPRING;
      n.vx *= DAMPING; n.vy *= DAMPING;
      n.x  += n.vx;    n.y  += n.vy;
    }

    // Draw edges
    for (const e of edges) {
      const a = nodes[e.a], b = nodes[e.b];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const dMouse = Math.sqrt((mx - mouseX) ** 2 + (my - mouseY) ** 2);
      if (dMouse < 70) continue; // break near cursor

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(167,139,250,${e.opacity})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Draw pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += p.speed;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }

      const a = nodes[p.edge.a], b = nodes[p.edge.b];
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;

      // Skip if near broken edge zone
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (Math.sqrt((mx - mouseX) ** 2 + (my - mouseY) ** 2) < 70) continue;

      ctx.shadowBlur  = 10;
      ctx.shadowColor = 'rgba(96,165,250,0.9)';
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147,197,253,${p.alpha})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw nodes
    for (const n of nodes) {
      const disp  = Math.sqrt((n.x - n.hx) ** 2 + (n.y - n.hy) ** 2);
      const glow  = Math.min(disp / 25, 1);
      const pulse = 0.5 + 0.5 * Math.sin(tick * 0.018 + n.phase);

      ctx.shadowBlur  = 10 + pulse * 8 + glow * 14;
      ctx.shadowColor = `rgba(167,139,250,${0.5 + glow * 0.5})`;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + pulse * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(210 + glow*45)},${Math.round(190 + glow*15)},255,${0.7 + pulse * 0.2 + glow * 0.1})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(draw);
  }

  buildNetwork();
  draw();
}
