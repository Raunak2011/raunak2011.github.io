(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.progress span');
  const themeToggle = document.getElementById('themeToggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('primary-links');

  /* Theme -------------------------------------------------------------- */
  const themeColors = { dark: '#0e1310', light: '#f5f7f0' };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeMeta?.setAttribute('content', themeColors[theme] || themeColors.dark);
    if (themeToggle) {
      const next = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
      themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    }
  };

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      /* storage can be blocked, the theme still applies for this visit */
    }
  });

  /* Mobile navigation --------------------------------------------------- */
  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navLinks.classList.remove('is-open');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navLinks?.classList.toggle('is-open', !isOpen);
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  /* Header state + reading progress ------------------------------------- */
  const updateOnScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);

    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }
  };

  window.addEventListener('scroll', updateOnScroll, { passive: true });
  window.addEventListener('resize', updateOnScroll, { passive: true });
  updateOnScroll();

  /* Active navigation link ---------------------------------------------- */
  const sectionLinks = [...document.querySelectorAll('#primary-links a[href^="#"]')];
  const linkedSections = sectionLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(({ section }) => section);

  if ('IntersectionObserver' in window && linkedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        linkedSections.forEach(({ link, section }) => {
          if (section === entry.target) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    linkedSections.forEach(({ section }) => sectionObserver.observe(section));
  }

  /* Scroll reveals ------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* Footer year --------------------------------------------------------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
