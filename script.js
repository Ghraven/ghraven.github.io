'use strict';

/* ============================================================
   PAGE LOAD ANIMATION
   ============================================================ */
window.addEventListener('load', () => {
  document.body.classList.remove('page-loading');
  document.body.classList.add('page-loaded');
});

/* ============================================================
   THEME TOGGLE
   ============================================================ */
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.getElementById('scroll-progress');
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* ============================================================
   NAVBAR SHADOW + ACTIVE LINK HIGHLIGHT
   ============================================================ */
const navbar  = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 16
    ? '0 2px 28px rgba(0,0,0,0.35)'
    : 'none';
}, { passive: true });

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
const typeEl  = document.getElementById('typewriter');
const phrases = [
  'Python Developer & Automation Builder',
  'AI Systems Engineer',
  'Open Source Contributor',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

const TYPING_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_END    = 2200;
const PAUSE_START  = 450;

function type() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typeEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      setTimeout(() => { isDeleting = true; type(); }, PAUSE_END);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, PAUSE_START);
      return;
    }
  }

  setTimeout(type, isDeleting ? DELETE_SPEED : TYPING_SPEED);
}

setTimeout(type, 700);

/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
const animateEls = document.querySelectorAll('.animate-on-scroll');

// Apply dynamic staggered delays to grid items
const grids = document.querySelectorAll('.skills-grid, .projects-grid, .services-grid, .oss-repos');
grids.forEach(grid => {
  Array.from(grid.children).forEach((child, index) => {
    if (child.classList.contains('animate-on-scroll') || child.closest('.animate-on-scroll')) {
       // Only apply if it's animated or inside an animated container
       child.style.transitionDelay = `${index * 0.1}s`;
    } else {
       // If the children themselves are animated (like service-cards)
       child.style.transitionDelay = `${index * 0.1}s`;
    }
  });
});

const animObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateEls.forEach(el => animObserver.observe(el));

/* ============================================================
   HERO PARALLAX
   ============================================================ */
const heroGrid = document.querySelector('.hero-bg-grid');
if (heroGrid) {
  document.addEventListener('mousemove', (e) => {
    // Throttle slightly by using requestAnimationFrame
    window.requestAnimationFrame(() => {
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;
      heroGrid.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

/* ============================================================
   STATS COUNTER (count-up on scroll)
   ============================================================ */
const statNums = document.querySelectorAll('.stat-num:not(.stat-num--static)');

function countUp(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1500; 
  let startTimestamp = null;

  // Ease-out Quart mathematical function
  const easeOutQuart = (t) => 1 - (--t) * t * t * t;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(easeOutQuart(progress) * target);
    
    if (progress < 1) {
      el.textContent = current;
      window.requestAnimationFrame(step);
    } else {
      el.textContent = target + '+';
    }
  };
  
  window.requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNums.forEach(countUp);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   CONTACT MODAL
   ============================================================
   Email delivery uses Formspree (free, no backend needed).
   Setup (2 minutes):
     1. Go to https://formspree.io and sign up (free)
     2. Click "New Form" → copy your form endpoint, e.g.:
        https://formspree.io/f/xyzabc12
     3. Replace the FORMSPREE_ENDPOINT value below with your URL.
   ============================================================ */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const modal         = document.getElementById('contact-modal');
const openBtn       = document.getElementById('open-contact-modal');
const closeBtn      = document.getElementById('modal-close');
const contactForm   = document.getElementById('contact-form');
const formState     = document.getElementById('modal-form-state');
const successState  = document.getElementById('modal-success-state');
const closeSuccess  = document.getElementById('btn-close-success');
const sendBtn       = document.getElementById('btn-send');
const emailInput    = document.getElementById('f-email');
const emailError    = document.getElementById('email-error');

/* ============================================================
   DYNAMIC FOOTER YEAR
   ============================================================ */
const footerYearEl = document.getElementById('footer-year');
if (footerYearEl) {
  footerYearEl.textContent = new Date().getFullYear();
}


function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => emailInput.focus(), 350);
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Reset after transition
  setTimeout(() => {
    contactForm.reset();
    clearEmailError();
    formState.style.display = 'block';
    successState.classList.remove('visible');
    successState.style.display = 'none';
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
  }, 320);
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
closeSuccess.addEventListener('click', closeModal);

// Close on overlay click (not on card click)
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

/* ---------- Form validation ---------- */
const nameInput = document.getElementById('f-name');
const msgInput  = document.getElementById('f-message');

function isValidEmail(email) {
  // Standard format: local@domain.tld — requires at least 2-char TLD
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

function showEmailError(msg) {
  emailError.textContent = msg;
  emailInput.classList.add('input-error');
  emailInput.classList.remove('input-valid');
}

function clearEmailError() {
  emailError.textContent = '';
  emailInput.classList.remove('input-error');
  emailInput.classList.add('input-valid');
}

emailInput.addEventListener('input', () => {
  if (emailInput.value && !isValidEmail(emailInput.value)) {
    showEmailError('— enter a valid email address');
  } else if (emailInput.value) {
    clearEmailError();
  } else {
    emailError.textContent = '';
    emailInput.classList.remove('input-error', 'input-valid');
  }
});

nameInput.addEventListener('input', () => {
  if (nameInput.value.trim().length > 0) {
    nameInput.classList.add('input-valid');
    nameInput.classList.remove('input-error');
  } else {
    nameInput.classList.remove('input-valid');
  }
});

msgInput.addEventListener('input', () => {
  if (msgInput.value.trim().length > 0) {
    msgInput.classList.add('input-valid');
    msgInput.classList.remove('input-error');
  } else {
    msgInput.classList.remove('input-valid');
  }
});

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
const magneticBtns = document.querySelectorAll('.btn, .contact-email-cta');

magneticBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth magnetic pull
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    // Reset transform to allow CSS hover/default states to take over
    btn.style.transform = '';
  });
});

/* ---------- Form submission ---------- */
contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const email = emailInput.value.trim();

  if (!isValidEmail(email)) {
    showEmailError('— enter a valid email address');
    emailInput.focus();
    return;
  }
  clearEmailError();

  // Loading state
  sendBtn.classList.add('loading');
  sendBtn.disabled = true;

  const data = {
    name:    document.getElementById('f-name').value.trim(),
    email,
    subject: document.getElementById('f-subject').value.trim(),
    message: document.getElementById('f-message').value.trim(),
  };

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    if (res.ok) {
      // Show success
      formState.style.display = 'none';
      successState.style.display = 'flex';
      successState.classList.add('visible');
    } else {
      throw new Error('Send failed');
    }
  } catch {
    // Fallback: open mailto pre-filled so the message isn't lost
    const subject = encodeURIComponent(data.subject || 'Message from portfolio');
    const body    = encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`);
    window.location.href = `mailto:rolly.calma.0217@gmail.com?subject=${subject}&body=${body}`;
    sendBtn.classList.remove('loading');
    sendBtn.disabled = false;
  }
});
