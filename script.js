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

// Contact form submit (Web3Forms)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn = contactForm.querySelector('.contact-submit');
  const statusEl = document.getElementById('contactStatus');
  const endpoint = 'https://api.web3forms.com/submit';
  const confettiColors = ['#6c5ce7', '#8ab4ff', '#0f1115', '#eef1f4', '#22c55e'];

  function launchMicroConfetti(originX, originY) {
    const layer = document.createElement('div');
    layer.className = 'micro-confetti';
    document.body.appendChild(layer);

    const pieceCount = 16;
    for (let i = 0; i < pieceCount; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'micro-confetti-piece';
      piece.style.left = `${originX}px`;
      piece.style.top = `${originY}px`;
      piece.style.background = confettiColors[i % confettiColors.length];

      const spreadX = (Math.random() - 0.5) * 220;
      const dropY = 120 + Math.random() * 110;
      const rotation = `${(Math.random() - 0.5) * 720}deg`;
      piece.style.setProperty('--tx', `${spreadX}px`);
      piece.style.setProperty('--ty', `${dropY}px`);
      piece.style.setProperty('--rot', rotation);

      layer.appendChild(piece);
    }

    window.setTimeout(() => layer.remove(), 1050);
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      statusEl.textContent = 'Contact form is not configured yet. Add your Web3Forms access key.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.textContent = '';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          Accept: 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok && result.success) {
        statusEl.textContent = 'Message sent successfully.';
        const btnRect = submitBtn.getBoundingClientRect();
        launchMicroConfetti(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2);
        contactForm.reset();
      } else {
        statusEl.textContent = result.message || 'Could not send message right now.';
      }
    } catch (error) {
      statusEl.textContent = 'Network error. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}

// Quote spotlight hover
const quoteMain = document.querySelector('.quote-main');
if (quoteMain) {
  const updateSpotlight = (event) => {
    const rect = quoteMain.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    quoteMain.style.setProperty('--mx', `${x}px`);
    quoteMain.style.setProperty('--my', `${y}px`);
  };

  quoteMain.addEventListener('pointerenter', (event) => {
    quoteMain.classList.add('is-hovered');
    updateSpotlight(event);
  });

  quoteMain.addEventListener('pointermove', updateSpotlight);

  quoteMain.addEventListener('pointerleave', () => {
    quoteMain.classList.remove('is-hovered');
    quoteMain.style.setProperty('--mx', '50%');
    quoteMain.style.setProperty('--my', '50%');
  });
}
