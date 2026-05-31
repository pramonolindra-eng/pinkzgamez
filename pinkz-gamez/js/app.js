/* ============================================================
   PINKZ GAMEZ — app.js
   Shared utilities: navbar, scroll, animations, menu
   ============================================================ */

// ── Navbar scroll effect ─────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Active nav link ───────────────────────────────────────
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
    else if (path === '' && href === 'index.html') a.classList.add('active');
  });
})();

// ── Mobile nav ────────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');
const closeBtn  = document.querySelector('.nav-mobile .close-btn');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  closeBtn && closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );
}

// ── Intersection Observer — fade-up ──────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        io.unobserve(target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => io.observe(el));
}

// ── Menu Tabs ─────────────────────────────────────────────
const menuTabs    = document.querySelectorAll('.menu-tab');
const menuPanels  = document.querySelectorAll('.menu-panel');

if (menuTabs.length) {
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      menuPanels.forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.style.display = 'grid';
    });
  });
  // init: show first panel
  if (menuPanels.length) {
    menuPanels.forEach((p, i) => p.style.display = i === 0 ? 'grid' : 'none');
  }
}

// ── Stamp card interaction (hover sparkle) ────────────────
document.querySelectorAll('.stamp.reward').forEach(stamp => {
  stamp.addEventListener('mouseenter', () => {
    stamp.style.boxShadow = '0 0 30px rgba(255,61,127,0.5)';
  });
  stamp.addEventListener('mouseleave', () => {
    stamp.style.boxShadow = '';
  });
});

// ── Smooth scroll for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
