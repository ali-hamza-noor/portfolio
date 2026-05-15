document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  initScrollReveal();
  initNavHighlight();
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
