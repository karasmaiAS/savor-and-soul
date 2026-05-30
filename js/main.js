// ===== NAVIGATION =====
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Active link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message, emoji = '🍽️') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-emoji">${emoji}</span>${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ===== CONTACT FORM VALIDATION =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'firstName', msg: 'First name is required.' },
      { id: 'lastName', msg: 'Last name is required.' },
      { id: 'email', msg: 'A valid email is required.', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'subject', msg: 'Please select a subject.' },
      { id: 'message', msg: 'Message must be at least 10 characters.', validate: (v) => v.length >= 10 },
    ];

    fields.forEach(({ id, msg, validate }) => {
      const input = document.getElementById(id);
      const errEl = document.getElementById(id + 'Error');
      if (!input || !errEl) return;

      const val = input.value.trim();
      const isEmpty = val === '' || val === 'default';
      const isInvalid = validate ? !validate(val) : false;

      if (isEmpty || isInvalid) {
        input.classList.add('error');
        errEl.textContent = msg;
        errEl.classList.add('visible');
        valid = false;
      } else {
        input.classList.remove('error');
        errEl.classList.remove('visible');
      }
    });

    const agree = document.getElementById('agreeCheck');
    const agreeErr = document.getElementById('agreeError');
    if (agree && !agree.checked) {
      agreeErr.classList.add('visible');
      valid = false;
    } else if (agreeErr) {
      agreeErr.classList.remove('visible');
    }

    if (valid) {
      // Simulate form submission
      document.getElementById('formSuccess').classList.add('show');
      form.reset();
      showToast('Message sent! We\'ll reply soon. ✉️', '✅');
      setTimeout(() => {
        document.getElementById('formSuccess').classList.remove('show');
      }, 5000);
    } else {
      showToast('Please fix the highlighted fields.', '⚠️');
    }
  });

  // Clear error on input
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const errEl = document.getElementById(el.id + 'Error');
      if (errEl) errEl.classList.remove('visible');
    });
  });
}

// ===== RECIPE FILTER =====
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.recipe-detail-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = 'fadeIn 0.3s ease';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });

      const visible = [...cards].filter(c => c.style.display !== 'none').length;
      showToast(`Showing ${visible} recipe${visible !== 1 ? 's' : ''}`, '🔍');
    });
  });
}

// ===== STAR RATING WIDGET =====
function initStarRating() {
  const stars = document.querySelectorAll('.star-btn');
  if (!stars.length) return;

  let currentRating = 0;
  const labels = ['', 'Terrible 😬', 'Not great 😕', 'It was okay 😐', 'Really good! 😋', 'Absolutely amazing! 🤩'];

  stars.forEach((star, i) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, j) => {
        s.style.filter = j <= i ? 'none' : 'grayscale(1) opacity(0.4)';
        s.style.transform = j <= i ? 'scale(1.15)' : 'scale(1)';
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach((s, j) => {
        s.style.filter = j < currentRating ? 'none' : 'grayscale(1) opacity(0.4)';
        s.style.transform = 'scale(1)';
      });
    });

    star.addEventListener('click', () => {
      currentRating = i + 1;
      stars.forEach((s, j) => {
        s.classList.toggle('selected', j < currentRating);
      });
      const result = document.getElementById('ratingResult');
      if (result) {
        result.textContent = `You rated: ${currentRating}/5 — ${labels[currentRating]}`;
        result.style.color = currentRating >= 4 ? '#38a169' : currentRating >= 3 ? '#c8762b' : '#e53e3e';
      }
      showToast(`Thanks for your ${currentRating}-star rating!`, '⭐');
    });
  });
}

// ===== NEWSLETTER FORM =====
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const val = input ? input.value.trim() : '';

    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showToast('Please enter a valid email address.', '⚠️');
      return;
    }

    if (input) input.value = '';
    showToast('You\'re subscribed! Welcome to the family 🎉', '✅');
  });
}

// ===== SCROLL REVEAL (simple) =====
function initScrollReveal() {
  const elements = document.querySelectorAll('.recipe-card, .recipe-detail-card, .form-card');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initContactForm();
  initFilter();
  initStarRating();
  initNewsletter();
  initScrollReveal();
});

// CSS keyframe injection for filter animation
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:translateY(0);} }`;
document.head.appendChild(style);
