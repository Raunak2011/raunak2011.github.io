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

// This site uses dark theme only.
document.documentElement.dataset.theme = 'dark';
themeToggle?.setAttribute('aria-pressed', 'true');
themeToggle?.setAttribute('aria-label', 'Dark theme is active');
if (themeLabel) themeLabel.textContent = 'Dark theme';
themeMeta?.setAttribute('content', '#111513');

themeToggle?.addEventListener('click', () => {
  document.documentElement.dataset.theme = 'dark';
  themeToggle.setAttribute('aria-pressed', 'true');
  themeToggle.setAttribute('aria-label', 'Dark theme is active');
  if (themeLabel) themeLabel.textContent = 'Dark theme';
  themeMeta?.setAttribute('content', '#111513');
});