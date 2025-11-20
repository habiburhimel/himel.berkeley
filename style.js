// main.js
// Handles hamburger toggle, smooth anchor scrolling, and Web3Forms submission logic.

// Wait until DOMContentLoaded (script is deferred but this is safe)
(() => {
  // NAV / HAMBURGER
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      mobileMenu.classList.toggle('show');
      mobileMenu.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('show');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // SMOOTH SCROLLING FOR INTERNAL LINKS (desktop + mobile brand)
  document.querySelectorAll('.links a.link, .mobile-menu a, .brand').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      // if mobile menu open, close it
      if (mobileMenu && mobileMenu.classList.contains('show')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('show');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
      }

      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // WEB3FORMS SUBMISSION HANDLER
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('cf-status');
  const submitBtn = document.getElementById('cf-submit');

  function showStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#ffb4b4' : '#cdebd6';
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      // honeypot check
      if (formData.get('honeypot')) {
        // silently succeed for bots
        showStatus('Message sent. Thank you!');
        form.reset();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.value = 'Sending…';
      }
      showStatus('Sending message…');

      try {
        const resp = await fetch(form.action, {
          method: form.method,
          body: formData,
        });

        // Try parse JSON; web3forms returns JSON with success flag on success
        const result = await resp.json().catch(() => ({ success: resp.ok }));

        if (resp.ok && (result.success === true || result.success === undefined)) {
          showStatus('Thanks — your message was sent! I will reply soon.');
          form.reset();

          // Optional: if you set a redirect hidden input and prefer redirect uncomment below:
          // const redirectUrl = form.querySelector('input[name="redirect"]')?.value;
          // if (redirectUrl) window.location.href = redirectUrl;
        } else {
          throw new Error(result.message || 'Submission failed — please try again.');
        }
      } catch (err) {
        console.error('Contact form error', err);
        showStatus('Oops — something went wrong. Please try again or email himel3655@gmail.com', true);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.value = 'Send Message';
        }
      }
    });
  }
})();
