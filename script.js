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

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
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
  'AI Tools Enthusiast',
  'Full-Stack Developer in Training',
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
   STATS COUNTER (count-up on scroll)
   ============================================================ */
const statNums = document.querySelectorAll('.stat-num:not(.stat-num--static)');

function countUp(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1200;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
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
