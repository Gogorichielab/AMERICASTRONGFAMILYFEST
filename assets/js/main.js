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

// Volunteer form submit.
// There is no backend yet, and action="#" on a static site means a real submit
// would post into nothing. This used to paint a green "Thank You" that told
// volunteers they had signed up when the data was discarded. Until the form has
// a real destination, say so and point people at the email address instead.
const volForm = document.querySelector('.vol-form-wrap');
const volFormNote = document.getElementById('volFormNote');
if (volForm && volFormNote) {
  volForm.addEventListener('submit', function (e) {
    e.preventDefault();
    volFormNote.hidden = false;
  });
}
