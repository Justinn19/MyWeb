// Page load: add loaded class after resources
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Theme: remember preference and initialize
const THEME_KEY = 'site-theme';
function setTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.querySelector('#themeToggle i');
  if(icon) icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

// determine initial theme: saved -> default to light (explicit request)
const saved = localStorage.getItem(THEME_KEY);
if(saved){
  setTheme(saved);
} else {
  // default to light unless user has explicitly saved preference
  setTheme('light');
}

// wire toggle
const toggle = document.getElementById('themeToggle');
if(toggle){
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// Scroll reveal with small stagger
const reveals = Array.from(document.querySelectorAll('.reveal'));
reveals.forEach((el, idx) => {
  // small stagger timing
  el.style.transitionDelay = `${Math.min(idx * 60, 400)}ms`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      // unobserve after visible for performance
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.18});

reveals.forEach(el => observer.observe(el));

// Dropdown toggles for cards - click entire card to open
const cards = document.querySelectorAll('.uniform-card');
cards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Check if click is on a link - if so, allow it to propagate
    if (e.target.closest('.dropdown-menu a')) {
      return; // don't prevent default, let the link work
    }
    e.preventDefault();
    const toggle = card.querySelector('.dropdown-toggle');
    const targetId = toggle.getAttribute('data-toggle');
    const menu = document.getElementById(targetId);
    if (menu) {
      menu.classList.toggle('open');
      toggle.classList.toggle('active');
    }
  });
});

// Allow direct clicks on dropdown links - stop propagation so card toggle doesn't fire
const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
dropdownLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.stopPropagation();
    // Allow normal link navigation
  });
});