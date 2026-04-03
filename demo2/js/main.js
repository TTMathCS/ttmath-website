const BASE = document.querySelector('meta[name="base-path"]')?.content || '';
const STATIC_PARTIAL_BASE = BASE + '/partials';

async function injectSharedLayout() {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  const loadPartial = async (slot, url) => {
    if (!slot) return;
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) return;
      slot.innerHTML = await response.text();
    } catch (err) {
      console.warn('Failed to load shared layout:', url, err);
    }
  };

  await Promise.all([
    loadPartial(headerSlot, `${STATIC_PARTIAL_BASE}/header.html`),
    loadPartial(footerSlot, `${STATIC_PARTIAL_BASE}/footer.html`)
  ]);
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function setupHeaderShadow() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');

      // Trigger counter animation for stat cards
      if (entry.target.classList.contains('stat-card')) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

// Observe elements for scroll reveal
function setupNavToggle() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
}

function setupLanguageSwitcher() {
  const languageSelect = document.querySelector('.lang-select');

  const applyLanguage = (lang) => {
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      const value = el.getAttribute(`data-i18n-${lang}`) || el.getAttribute('data-i18n-en');
      if (value) {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder-en]').forEach(el => {
      const value = el.getAttribute(`data-i18n-placeholder-${lang}`) || el.getAttribute('data-i18n-placeholder-en');
      if (value) {
        el.setAttribute('placeholder', value);
      }
    });
  };

  if (languageSelect) {
    const savedLang = localStorage.getItem('ttmath-lang');
    const activeLang = savedLang || languageSelect.value || 'en';
    languageSelect.value = activeLang;
    applyLanguage(activeLang);

    languageSelect.addEventListener('change', () => {
      const lang = languageSelect.value;
      localStorage.setItem('ttmath-lang', lang);
      applyLanguage(lang);
    });
  }
}

function setupRevealObserver() {
  const revealElements = document.querySelectorAll(
    '.stat-card, .showcase-card, .program-card-large, .news-card, .card, .highlight-card, .note-card, .announcement-bar, .achievement-card, .contact-item, .section-head, .contest-hero-content, .timeline-node, .deadline-card, .subnav-inner, .compact-upcoming, .contest-index-row, .pathway-card, .experience-card, .track-card, .intro-panel, .focus-card, .math-path-card, .math-domain-card, .course-card'
  );

  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index % 4 * 0.1}s`;
    observer.observe(el);
  });

  document.querySelectorAll('.section-title, .page-header h1').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Counter animation for stats
function animateCounter(element) {
  const numberEl = element.querySelector('.stat-number');
  if (!numberEl || numberEl.dataset.animated) return;

  numberEl.dataset.animated = 'true';
  const text = numberEl.textContent;
  const match = text.match(/(\d+)/);

  if (!match) return;

  const target = parseInt(match[0]);
  const suffix = text.replace(match[0], '');
  const duration = 1500;
  const steps = 60;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      clearInterval(timer);
      numberEl.textContent = target + suffix;
    } else {
      numberEl.textContent = Math.floor(current) + suffix;
    }
  }, duration / steps);
}

function setupImageFade() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
}

function setActiveNav() {
  const pathname = window.location.pathname;
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkTarget = href === '/' ? '/' : href.replace(/\/$/, '');
    const isActive = normalized === linkTarget || normalized.endsWith(linkTarget) || (linkTarget === '/' && (normalized === '/' || normalized.endsWith('index.html')));
    link.classList.toggle('active', isActive);
  });
}

function setupFormValidation() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });

      if (!valid) {
        e.preventDefault();
      }
    });
  });
}

function setupHeroPosition() {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.backgroundPositionY = 'center';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.body.classList.add('layout-loading');
  await injectSharedLayout();
  document.body.classList.add('layout-ready');
  document.body.classList.remove('layout-loading');
  document.body.classList.add('is-loaded');
  setupSmoothScroll();
  setupHeaderShadow();
  setupNavToggle();
  setupLanguageSwitcher();
  setupRevealObserver();
  setupImageFade();
  setActiveNav();
  setupFormValidation();
  setupHeroPosition();
});
