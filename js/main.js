const menuToggle = document.querySelector('.menu-toggle');
const primaryLinks = document.querySelector('#primary-links');

if (menuToggle && primaryLinks) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    primaryLinks.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryLinks.classList.toggle('is-open', !isOpen);
  });

  primaryLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const progressBar = document.querySelector('.scroll-progress');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (progressBar) {
  let progressFrame = 0;
  const updateScrollProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      progressFrame = 0;
    });
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();
}

if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealItems = document.querySelectorAll(
    '.section-head, .project-card, .about-grid > *, .skills-row > *, .experience > *, .timeline-item, .contact > .shell > *'
  );
  revealItems.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
  });

  if (revealItems.length) {
    document.documentElement.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

const siteHeader = document.querySelector('body > header.shell');
const updateHeaderState = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 12);
};
window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

const sectionLinks = [...document.querySelectorAll('#primary-links a[href^="#"]')];
const linkedSections = sectionLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(({ section }) => section);

if ('IntersectionObserver' in window && linkedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      linkedSections.forEach(({ link, section }) => {
        const isCurrent = section === entry.target;
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  linkedSections.forEach(({ section }) => sectionObserver.observe(section));
}

const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const themeMeta = document.querySelector('meta[name="theme-color"]');
let savedTheme = null;
try {
  savedTheme = localStorage.getItem('portfolio-theme');
} catch {
  // Theme still works for this page view when browser storage is unavailable.
}
if (savedTheme === 'dark') document.documentElement.dataset.theme = 'dark';

const syncThemeControl = () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  if (themeLabel) themeLabel.textContent = isDark ? 'Light theme' : 'Dark theme';
  themeMeta?.setAttribute('content', isDark ? '#171d19' : '#f4f2ec');
};
syncThemeControl();
themeToggle?.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  try {
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  } catch {
    // The theme remains switched for this page view.
  }
  syncThemeControl();
});
