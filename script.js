/**
 * ==========================================================================
 * FRESHER AI/ML PORTFOLIO — JAVASCRIPT
 * Theme toggle, animations, form validation, and interactive features
 * ==========================================================================
 */
// public key
emailjs.init("0hyc99zj5DBkOau7v");
'use strict';

/* ---------- DOM Elements ---------- */
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const themeToggle = document.getElementById('theme-toggle');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contact-form');
const backToTop = document.getElementById('back-to-top');
const currentYear = document.getElementById('current-year');
const counters = document.querySelectorAll('.counter');
const revealElements = document.querySelectorAll('.reveal');

/* ---------- Typing Effect Configuration ---------- */
const typingPhrases = [
  'Aspiring AI/ML Engineer',
  'Machine Learning Enthusiast',
  'Python Developer',
  'Data Science Learner',
  'Generative AI Explorer'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

/**
 * Typing effect for hero title
 * Cycles through multiple phrases with type/delete animation
 */
function typeEffect() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 40;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 80;
  }

  // Pause at end of phrase before deleting
  if (!isDeleting && charIndex === currentPhrase.length) {
    typingSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    typingSpeed = 500;
  }

  setTimeout(typeEffect, typingSpeed);
}

/* ---------- Theme Toggle ---------- */

/**
 * Apply theme and persist preference to localStorage
 * @param {string} theme - 'dark' or 'light'
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

/**
 * Initialize theme from saved preference or system preference
 */
function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

/* ---------- Navigation ---------- */

/**
 * Toggle mobile navigation menu
 */
function toggleNav() {
  const isOpen = navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isOpen);
}

/**
 * Close mobile nav when a link is clicked
 */
function closeNav() {
  navMenu.classList.remove('active');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}

/**
 * Update active nav link based on scroll position
 */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/**
 * Add scrolled class to header for glassmorphism effect
 */
function handleHeaderScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

/* ---------- Scroll Reveal Animations ---------- */

/**
 * Intersection Observer for scroll reveal animations
 */
function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* ---------- Animated Counters ---------- */

/**
 * Animate number counters when they enter viewport
 */
function initCounters() {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        animateCounter(counter, target);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

/**
 * Smoothly increment counter to target value
 * @param {HTMLElement} element - Counter element
 * @param {number} target - Target number
 */
function animateCounter(element, target) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ---------- Contact Form Validation ---------- */

/**
 * Validate a single form field
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 * @returns {boolean}
 */
function validateField(field) {
  const errorEl = document.getElementById(`${field.id}-error`);
  let isValid = true;
  let message = '';

  const value = field.value.trim();

  if (field.hasAttribute('required') && !value) {
    isValid = false;
    message = 'This field is required.';
  } else if (field.type === 'email' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      isValid = false;
      message = 'Please enter a valid email address.';
    }
  } else if (field.id === 'name' && value.length < 2) {
    isValid = false;
    message = 'Name must be at least 2 characters.';
  } else if (field.id === 'message' && value.length < 10) {
    isValid = false;
    message = 'Message must be at least 10 characters.';
  }

  field.classList.toggle('error', !isValid);
  if (errorEl) errorEl.textContent = message;

  return isValid;
}

/**
 * Handle contact form submission with client-side validation
 * @param {Event} e
 */async function handleFormSubmit(e) {
    e.preventDefault();

    const fields = contactForm.querySelectorAll(".form__input");
    let isFormValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending...";

    try {

        await emailjs.send(
            "service_sg56w9g",
            "template_ipiw5n3",
            {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value
            }
        );

        contactForm.reset();

        document.getElementById("form-success").hidden = false;

        setTimeout(() => {
            document.getElementById("form-success").hidden = true;
        }, 5000);

    } catch (error) {
        alert("Failed to send message.");
        console.error(error);
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
}

/* ---------- Smooth Scroll for Anchor Links ---------- */

/**
 * Enable smooth scrolling for internal anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');

      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
      closeNav();

      // Update URL hash without jumping
      history.pushState(null, '', targetId);
    });
  });
}

/* ---------- Back to Top ---------- */

/**
 * Scroll smoothly to top of page
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Event Listeners ---------- */

function initEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Mobile navigation
  navToggle.addEventListener('click', toggleNav);
  navLinks.forEach((link) => link.addEventListener('click', closeNav));

  // Scroll events (throttled with requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleHeaderScroll();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Contact form
  contactForm.addEventListener('submit', handleFormSubmit);

  // Real-time field validation on blur
  contactForm.querySelectorAll('.form__input').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  // Back to top
  backToTop.addEventListener('click', scrollToTop);

  // Close mobile nav on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeNav();
    }
  });

  // Close mobile nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });
}

/* ---------- Initialize Application ---------- */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEventListeners();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  typeEffect();

  // Set current year in footer
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Initial scroll state
  handleHeaderScroll();
  updateActiveNav();
});
