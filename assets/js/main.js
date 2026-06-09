/* ===== STAR FIELD CANVAS ===== */
(function () {
  var canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      speed: Math.random() * 0.4 + 0.05,
      dir: Math.random() > 0.5 ? 1 : -1,
      twinkleSpeed: Math.random() * 0.015 + 0.005
    };
  }

  function init() {
    resize();
    stars = [];
    var count = Math.floor((W * H) / 4800);
    for (var i = 0; i < count; i++) stars.push(makeStar());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(function (s) {
      s.a += s.twinkleSpeed * s.dir;
      if (s.a >= 1) { s.a = 1; s.dir = -1; }
      if (s.a <= 0.1) { s.a = 0.1; s.dir = 1; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.a.toFixed(2) + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () { init(); });
  init();
  draw();
})();

/* ===== MOBILE NAV ===== */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var links  = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ===== COUNTDOWN TIMER ===== */
(function () {
  var target = new Date('2026-09-12T10:00:00');

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    var now  = new Date();
    var diff = target - now;
    if (diff <= 0) {
      var el = document.getElementById('countdown-units');
      if (el) el.parentElement.innerHTML = '<span style="color:var(--gold);font-size:1.2rem;">&#9733; The event is happening NOW! &#9733;</span>';
      return;
    }
    var days  = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var mins  = Math.floor((diff % 3600000)  / 60000);
    var secs  = Math.floor((diff % 60000)    / 1000);

    var d = document.getElementById('cd-days');
    var h = document.getElementById('cd-hours');
    var m = document.getElementById('cd-mins');
    var s = document.getElementById('cd-secs');
    if (d) d.textContent = pad(days);
    if (h) h.textContent = pad(hours);
    if (m) m.textContent = pad(mins);
    if (s) s.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ===== SMOOTH SCROLL FOR # LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var offset = 70;
    var top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* ===== VOLUNTEER FORM ===== */
(function () {
  var form = document.getElementById('volunteer-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    var action = form.getAttribute('action');
    if (!action || action === '#') {
      e.preventDefault();
      var success = document.getElementById('form-success');
      if (success) {
        form.style.display = 'none';
        success.style.display = 'block';
      }
    }
  });
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.activity-card, .sponsor-card, .about-grid, .location-grid, .volunteer-wrap');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
})();
