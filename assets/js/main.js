// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
if (cursor && ring) {
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

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      const alpha = s.o * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
      s.y += s.speed * 0.15;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();
}

// Volunteer form submit
const submitBtn = document.querySelector('.form-submit');
if (submitBtn) {
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    this.textContent = "✓ Thank You! We'll Be in Touch";
    this.style.background = '#2D6A4F';
    this.style.color = '#fff';
    this.style.clipPath = 'none';
  });
}
