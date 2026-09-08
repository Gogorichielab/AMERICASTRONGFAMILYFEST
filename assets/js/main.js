// Does this visitor want motion stopped? Both the custom cursor and the star
// field are continuous movement, which is exactly what this setting asks about.
// CSS hides the cursor elements and stills the animations to match.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
if (cursor && ring && !reduceMotion.matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // The system pointer is hidden site-wide, so links and fields no longer
  // announce themselves as clickable. Flag interactive elements for CSS.
  // mouseover fires on entering any element, so recomputing here cannot stick.
  const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"]';
  document.addEventListener('mouseover', e => {
    const el = e.target instanceof Element ? e.target : null;
    document.body.classList.toggle('cursor-interactive', !!(el && el.closest(INTERACTIVE)));
  });
}

// Nav scroll
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// Mobile navigation. The control stays keyboard operable, reports its state to
// assistive technology, closes after a selection, and returns focus on Escape.
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if (navToggle && primaryNav) {
  const setNavOpen = (open, returnFocus = false) => {
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    primaryNav.classList.toggle('is-open', open);
    if (returnFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    setNavOpen(open);
    if (open) primaryNav.querySelector('a')?.focus();
  });

  primaryNav.addEventListener('click', event => {
    if (event.target.closest('a')) setNavOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavOpen(false, true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) setNavOpen(false);
  });
}

// Animated star field
const canvas = document.getElementById('starsCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
    renderStars(false);
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        o: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.005
      });
    }
  }

  // advance=false paints the same field without moving it, so reduced-motion
  // visitors still get the starry hero, just held still.
  function renderStars(advance) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      if (advance) s.twinkle += s.twinkleSpeed;
      const alpha = s.o * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
      if (advance) {
        s.y += s.speed * 0.15;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
      }
    });
  }

  // The loop used to run forever, repainting a full-viewport canvas even with
  // the hero scrolled out of sight. Run it only while the hero is visible and
  // motion is wanted. (Browsers already pause rAF in background tabs, so no
  // visibilitychange handling is needed on top of this.)
  let rafId = 0;
  let heroVisible = true;

  function loop() {
    renderStars(true);
    rafId = requestAnimationFrame(loop);
  }

  function syncStars() {
    const shouldRun = heroVisible && !reduceMotion.matches;
    if (shouldRun && !rafId) {
      rafId = requestAnimationFrame(loop);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      renderStars(false);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  const hero = canvas.closest('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      syncStars();
    }).observe(hero);
  }

  // Someone can flip the OS setting with the page already open.
  reduceMotion.addEventListener('change', syncStars);
  syncStars();
}

const EVENT_EMAIL = 'info@americastrongfamilyfest.com';

function openPrefilledEmail(subject, lines) {
  const body = lines.join('\n');
  window.location.href = `mailto:${EVENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function formValue(form, name) {
  return String(new FormData(form).get(name) || '').trim();
}

// Keep the site's no-JavaScript fallback as a direct mailto link, but enhance
// it into a structured sponsorship form when JavaScript is available. The site
// never stores the values: submit opens the visitor's email client with a
// pre-addressed, pre-filled message that they review and send themselves.
const sponsorCtaRow = document.querySelector('.sponsor-cta-row');
if (sponsorCtaRow) {
  sponsorCtaRow.innerHTML = `
    <form class="vol-form-wrap" id="sponsorMailForm">
      <h3>Sponsorship Inquiry</h3>
      <p class="form-sub" id="sponsorMailHelp">Complete the fields below and we will prepare an email to <a href="mailto:${EVENT_EMAIL}">${EVENT_EMAIL}</a>. Your email app will open so you can review and send it.</p>
      <p class="form-req" aria-hidden="true">* Required</p>
      <div class="fg">
        <label for="sponsorBusiness">Business / Organization <span class="req" aria-hidden="true">*</span></label>
        <input type="text" id="sponsorBusiness" name="business" autocomplete="organization" required>
      </div>
      <div class="fg">
        <label for="sponsorContact">Contact Name <span class="req" aria-hidden="true">*</span></label>
        <input type="text" id="sponsorContact" name="contact" autocomplete="name" required>
      </div>
      <div class="fg-row">
        <div class="fg">
          <label for="sponsorEmail">Email <span class="req" aria-hidden="true">*</span></label>
          <input type="email" id="sponsorEmail" name="email" autocomplete="email" required>
        </div>
        <div class="fg">
          <label for="sponsorPhone">Phone</label>
          <input type="tel" id="sponsorPhone" name="phone" autocomplete="tel">
        </div>
      </div>
      <div class="fg">
        <label for="sponsorTier">Sponsorship Level <span class="req" aria-hidden="true">*</span></label>
        <select id="sponsorTier" name="tier" required>
          <option value="">Choose a level</option>
          <option>Silver - $150</option>
          <option>Gold - $500</option>
          <option>Platinum - $1,000+</option>
          <option>Other / Custom Package</option>
        </select>
      </div>
      <div class="fg">
        <label for="sponsorNotes">Notes / In-kind Contribution</label>
        <input type="text" id="sponsorNotes" name="notes" placeholder="Optional details">
      </div>
      <button type="submit" class="form-submit" aria-describedby="sponsorMailHelp">Prepare Sponsorship Email &rarr;</button>
      <p class="form-note" id="sponsorMailStatus" role="status">Your inquiry is sent only after you press Send in your email app. If nothing opens, email <a href="mailto:${EVENT_EMAIL}">${EVENT_EMAIL}</a> directly.</p>
    </form>`;

  const sponsorMailForm = document.getElementById('sponsorMailForm');
  sponsorMailForm?.addEventListener('submit', event => {
    event.preventDefault();
    const business = formValue(sponsorMailForm, 'business');
    const contact = formValue(sponsorMailForm, 'contact');
    const email = formValue(sponsorMailForm, 'email');
    const phone = formValue(sponsorMailForm, 'phone') || 'Not provided';
    const tier = formValue(sponsorMailForm, 'tier');
    const notes = formValue(sponsorMailForm, 'notes') || 'None';

    openPrefilledEmail(`America Strong Family Fest Sponsorship Inquiry - ${business}`, [
      'America Strong Family Fest Sponsorship Inquiry',
      '',
      `Business / Organization: ${business}`,
      `Contact Name: ${contact}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Sponsorship Level: ${tier}`,
      `Notes / In-kind Contribution: ${notes}`,
      '',
      'Please contact me about sponsorship for America Strong Family Fest.'
    ]);
  });
}

// Car-show registration follows the same static-site pattern. The existing
// direct mailto remains the no-JavaScript fallback; with JavaScript, drivers get
// a structured form and a clear reminder that registration is not complete
// until they send the generated email.
const carShowRegisterLink = document.querySelector('#car-show a.btn-gold[href^="mailto:"]');
if (carShowRegisterLink) {
  const carShowMailForm = document.createElement('form');
  carShowMailForm.className = 'vol-form-wrap';
  carShowMailForm.id = 'carShowMailForm';
  carShowMailForm.innerHTML = `
    <h3>Register Your Car</h3>
    <p class="form-sub" id="carShowMailHelp">Advance registration is required and spaces are first come, first served. Complete the form and we will prepare an email to <a href="mailto:${EVENT_EMAIL}">${EVENT_EMAIL}</a> for you to send.</p>
    <p class="form-req" aria-hidden="true">* Required</p>
    <div class="fg">
      <label for="carParticipant">Participant Name <span class="req" aria-hidden="true">*</span></label>
      <input type="text" id="carParticipant" name="participant" autocomplete="name" required>
    </div>
    <div class="fg-row">
      <div class="fg">
        <label for="carEmail">Email <span class="req" aria-hidden="true">*</span></label>
        <input type="email" id="carEmail" name="email" autocomplete="email" required>
      </div>
      <div class="fg">
        <label for="carPhone">Phone <span class="req" aria-hidden="true">*</span></label>
        <input type="tel" id="carPhone" name="phone" autocomplete="tel" required>
      </div>
    </div>
    <div class="fg-row">
      <div class="fg">
        <label for="carYear">Vehicle Year <span class="req" aria-hidden="true">*</span></label>
        <input type="text" id="carYear" name="year" inputmode="numeric" placeholder="1969" required>
      </div>
      <div class="fg">
        <label for="carMake">Make <span class="req" aria-hidden="true">*</span></label>
        <input type="text" id="carMake" name="make" placeholder="Chevrolet" required>
      </div>
    </div>
    <div class="fg">
      <label for="carModel">Model <span class="req" aria-hidden="true">*</span></label>
      <input type="text" id="carModel" name="model" placeholder="Camaro" required>
    </div>
    <div class="fg">
      <label for="carNotes">Notes</label>
      <input type="text" id="carNotes" name="notes" placeholder="Optional vehicle details or special notes">
    </div>
    <button type="submit" class="form-submit" aria-describedby="carShowMailHelp">Prepare Registration Email &rarr;</button>
    <p class="form-note" id="carShowMailStatus" role="status">Your registration is complete only after you press Send in your email app. You can attach an optional vehicle photo before sending. If nothing opens, email <a href="mailto:${EVENT_EMAIL}">${EVENT_EMAIL}</a> directly.</p>`;

  carShowRegisterLink.replaceWith(carShowMailForm);

  carShowMailForm.addEventListener('submit', event => {
    event.preventDefault();
    const participant = formValue(carShowMailForm, 'participant');
    const email = formValue(carShowMailForm, 'email');
    const phone = formValue(carShowMailForm, 'phone');
    const year = formValue(carShowMailForm, 'year');
    const make = formValue(carShowMailForm, 'make');
    const model = formValue(carShowMailForm, 'model');
    const notes = formValue(carShowMailForm, 'notes') || 'None';

    openPrefilledEmail(`America Strong Car Show Registration - ${year} ${make} ${model}`, [
      'America Strong Family Fest Car Show Registration',
      '',
      `Participant Name: ${participant}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Vehicle: ${year} ${make} ${model}`,
      `Notes: ${notes}`,
      '',
      'I understand registration is first come, first served and my space is subject to organizer confirmation.',
      'Optional: I may attach a vehicle photo to this email before sending.'
    ]);
  });
}

// Volunteer signup uses the same static-site mail workflow as sponsorship and
// car-show registration. The browser validates the existing required fields,
// then opens a pre-addressed email containing the volunteer's details. Nothing
// is stored by the website, and the volunteer completes signup by pressing Send.
const volForm = document.querySelector('#volunteer .vol-form-wrap');
const volFormHelp = document.getElementById('volFormHelp');
const volFormNote = document.getElementById('volFormNote');
if (volForm) {
  if (volFormHelp) {
    volFormHelp.innerHTML = `Complete the fields below and we will prepare an email to <a href="mailto:${EVENT_EMAIL}">${EVENT_EMAIL}</a>. Your email app will open so you can review and send it.`;
  }
  if (volFormNote) {
    volFormNote.hidden = false;
    volFormNote.innerHTML = `Your volunteer request is complete only after you press Send in your email app. If nothing opens, email <a href="mailto:${EVENT_EMAIL}">${EVENT_EMAIL}</a> directly with your name, preferred role, and availability.`;
  }

  const submitButton = volForm.querySelector('.form-submit');
  if (submitButton) submitButton.innerHTML = 'Prepare Volunteer Email &rarr;';

  volForm.addEventListener('submit', event => {
    event.preventDefault();
    const firstName = formValue(volForm, 'first_name');
    const lastName = formValue(volForm, 'last_name');
    const email = formValue(volForm, 'email');
    const phone = formValue(volForm, 'phone') || 'Not provided';
    const role = formValue(volForm, 'role') || 'General Support';
    const availability = formValue(volForm, 'availability') || 'Not specified';
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    openPrefilledEmail(`America Strong Family Fest Volunteer - ${fullName}`, [
      'America Strong Family Fest Volunteer Interest',
      '',
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Preferred Role: ${role}`,
      `Availability: ${availability}`,
      '',
      'Please add me to the America Strong Family Fest volunteer list.'
    ]);
  });
}
