document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.pageYOffset > 50);
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      if (entry.target.classList.contains('stat-card')) animateCounter(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-loaded');

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const languageSelect = document.querySelector('.lang-select');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('mobile-open')) {
          nav.classList.remove('mobile-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const applyLanguage = (lang) => {
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      const v = el.getAttribute(`data-i18n-${lang}`) || el.getAttribute('data-i18n-en');
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-placeholder-en]').forEach(el => {
      const v = el.getAttribute(`data-i18n-placeholder-${lang}`) || el.getAttribute('data-i18n-placeholder-en');
      if (v) el.setAttribute('placeholder', v);
    });
  };

  if (languageSelect) {
    const saved = localStorage.getItem('ttmath-lang');
    const lang = saved || languageSelect.value || 'en';
    languageSelect.value = lang;
    applyLanguage(lang);
    languageSelect.addEventListener('change', () => {
      const l = languageSelect.value;
      localStorage.setItem('ttmath-lang', l);
      applyLanguage(l);
    });
  }

  const revealEls = document.querySelectorAll(
    '.stat-card, .showcase-card, .program-card-large, .news-card, .card, .highlight-card, .note-card, .announcement-bar, .achievement-card, .contact-item, .section-head, .contest-hero-content, .timeline-node, .deadline-card, .subnav-inner, .compact-upcoming, .contest-index-row, .pathway-card, .experience-card, .track-card, .intro-panel, .focus-card, .math-path-card, .math-domain-card, .course-card'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i % 4 * 0.1}s`;
    observer.observe(el);
  });

  document.querySelectorAll('.section-title, .page-header h1').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
});

function animateCounter(el) {
  const n = el.querySelector('.stat-number');
  if (!n || n.dataset.animated) return;
  n.dataset.animated = 'true';
  const text = n.textContent, match = text.match(/(\d+)/);
  if (!match) return;
  const target = parseInt(match[0]), suffix = text.replace(match[0], '');
  const dur = 1200;
  const start = performance.now();
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const v = Math.floor(ease(t) * target);
    n.textContent = v + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else n.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('img').forEach(img => {
  if (img.complete) img.classList.add('loaded');
  else img.addEventListener('load', () => img.classList.add('loaded'));
});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(link => {
  const href = link.getAttribute('href');
  link.classList.toggle('active', href === currentPage);
});

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    let valid = true;
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
      if (!input.value.trim()) { valid = false; input.classList.add('error'); }
      else input.classList.remove('error');
    });
    if (!valid) e.preventDefault();
  });
});
