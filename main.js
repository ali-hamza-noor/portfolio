document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  initScrollReveal();
  initNavHighlight();
  initMouseParallax();
  initCustomCursor();
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
