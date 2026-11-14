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
