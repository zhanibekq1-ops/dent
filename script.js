/* Astana Smile Clinic — interactions */
(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function openNav() {
    mobileNav.hidden = false;
    void mobileNav.offsetHeight; /* force reflow so the fade-in transition runs */
    mobileNav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      if (toggle.getAttribute('aria-expanded') === 'false') mobileNav.hidden = true;
    }, 230);
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) { closeNav(); } else { openNav(); }
  });

  mobileNav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
      toggle.focus();
    }
  });

  /* ---------- Scroll reveal ---------- */
  var pending = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var ticking = false;

  function checkReveals() {
    ticking = false;
    if (!pending.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    pending = pending.filter(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.92 && rect.bottom > 0) {
        el.classList.add('is-visible');
        return false;
      }
      return true;
    });
  }

  function queueReveals() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(checkReveals);
    }
  }

  window.addEventListener('scroll', queueReveals, { passive: true });
  window.addEventListener('resize', queueReveals, { passive: true });
  window.addEventListener('load', queueReveals);
  checkReveals();

  /* Safety net: keeps content visible even if scroll events are unavailable */
  var revealPoll = window.setInterval(function () {
    if (pending.length) { checkReveals(); } else { window.clearInterval(revealPoll); }
  }, 350);

  /* ---------- Appointment form ---------- */
  var form = document.getElementById('appointmentForm');
  var success = document.getElementById('formSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;
    ['name', 'phone'].forEach(function (id) {
      var input = document.getElementById(id);
      var empty = input.value.trim() === '';
      input.classList.toggle('is-invalid', empty);
      if (empty && valid) {
        input.focus();
        valid = false;
      }
    });
    if (!valid) return;

    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  ['name', 'phone'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', function () {
      this.classList.remove('is-invalid');
    });
  });
})();
