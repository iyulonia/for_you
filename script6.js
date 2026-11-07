/* ======================================================
   1. Плавное появление абзацев при скролле
   ====================================================== */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// Первый абзац показываем сразу после загрузки
window.addEventListener('load', () => {
  if (fadeEls.length) fadeEls[0].classList.add('visible');
});


/* ======================================================
   2. Кнопка «Обнять меня» + конфетти
   ====================================================== */
const hugBtn      = document.getElementById('hugBtn');
const hugResponse = document.getElementById('hugResponse');

const hugMessages = [
  'Обнимаю крепко-крепко 🤗',
  'Ты лучшая. Помни это.',
  'Ещё одно объятие в запас 💛',
  'С тобой даже тишина уютная.',
  'Обнимаю так сильно, что аж самой тепло.',
];

let hugIndex = 0;

hugBtn.addEventListener('click', () => {
  // Сообщение под кнопкой
  hugResponse.textContent = hugMessages[hugIndex % hugMessages.length];
  hugIndex++;
  hugResponse.classList.add('show');

  // Конфетти
  launchConfetti();
});


/* ======================================================
   3. Конфетти на canvas (без библиотек)
   ====================================================== */
const canvas = document.getElementById('confetti');
const ctx    = canvas.getContext('2d');

let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#ffb347', '#ff8c42', '#ffd9a0', '#e4b3ff', '#ff6b8a', '#8ce0b0'];

function createParticle() {
  const fromLeft = Math.random() < 0.5;
  return {
    x: fromLeft ? Math.random() * 80 : canvas.width - Math.random() * 80,
    y: canvas.height + 20,
    vx: (fromLeft ? 1 : -1) * (2 + Math.random() * 4),
    vy: -(8 + Math.random() * 8),
    size: 6 + Math.random() * 8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    gravity: 0.18 + Math.random() * 0.08,
    life: 0,
    maxLife: 140 + Math.random() * 80,
    shape: Math.random() < 0.6 ? 'rect' : 'heart',
  };
}

function drawHeart(cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 20, size / 20);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, 0, -10, 0, -10, -6);
  ctx.bezierCurveTo(-10, -12, -2, -12, 0, -5);
  ctx.bezierCurveTo(2, -12, 10, -12, 10, -6);
  ctx.bezierCurveTo(10, 0, 0, 0, 0, 6);
  ctx.fill();
  ctx.restore();
}

function drawParticle(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);

  if (p.shape === 'rect') {
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else {
    drawHeart(0, 0, p.size, p.color);
  }

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.vy += p.gravity;
    p.vx *= 0.995;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.life++;

    if (p.y < canvas.height + 60 && p.life < p.maxLife) {
      drawParticle(p);
    }
  });

  particles = particles.filter(
    p => p.y < canvas.height + 60 && p.life < p.maxLife
  );

  if (particles.length > 0) {
    animationId = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(animationId);
    animationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function launchConfetti() {
  // Порция конфетти (90–120 штук)
  const count = 90 + Math.floor(Math.random() * 40);
  for (let i = 0; i < count; i++) {
    // Небольшая задержка появления для «волны»
    setTimeout(() => {
      particles.push(createParticle());
      if (!animationId) animate();
    }, i * 12);
  }
}


/* ======================================================
   4. Автоматическое конфетти при первом скролле до конца
   ====================================================== */
let autoConfettiDone = false;

window.addEventListener('scroll', () => {
  if (autoConfettiDone) return;

  const scrollBottom = window.scrollY + window.innerHeight;
  const docHeight    = document.documentElement.scrollHeight;

  if (scrollBottom >= docHeight - 120) {
    autoConfettiDone = true;
    launchConfetti();
  }
});