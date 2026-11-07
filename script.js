const cake = document.getElementById('cake');
const hint = document.getElementById('hint');
const congrats = document.getElementById('congrats');
let blown = false;

cake.addEventListener('click', () => {
  if (blown) return;
  blown = true;

  cake.classList.add('blown');
  hint.classList.add('hide');

  setTimeout(() => {
    congrats.classList.add('show');
    launchSalute();
  }, 1500);
});

function launchSalute() {
  const canvas = document.getElementById('fireworks');
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const colors = ['#ff6b9d', '#ffd54f', '#7fd1ff', '#c084fc', '#fff'];

  function burst(x, y) {
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // 6 залпов
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      burst(
        canvas.width * (0.15 + Math.random() * 0.7),
        canvas.height * (0.15 + Math.random() * 0.4)
      );
    }, i * 450);
  }

  function animate() {
    // Полная очистка — canvas прозрачный, торт не закрашивается
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем частицы
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.life -= 0.012;

      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);  // чуть крупнее
      ctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    });

    ctx.globalAlpha = 1;

    // Продолжаем анимацию, пока есть частицы ИЛИ идут залпы
    requestAnimationFrame(animate);
  }
  animate();
}