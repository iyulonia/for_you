/* ======================================================
   Данные. Замени пути к фото и подписи на свои.
   polaroids — для стопки (5–7 ключевых фото)
   gallery   — для сетки «А вот ещё» (все остальные)
   ====================================================== */
const polaroids = [
  { src: 'photo_2026-11-07_22-31-09.jpg', caption: 'Маленькие девочки какие-то, знаешь их?' },
  { src: 'photo_2026-11-07_22-32-15.jpg', caption: 'Реально связали нашу дружбу' },
  { src: 'photo_2026-11-07_22-29-02.jpg', caption: 'Подглядываем)' },
  { src: 'photo_2026-11-07_22-41-57.jpg', caption: 'Помнишь о существовании этой фотки? ахахха' },
  { src: 'photo_2026-11-07_22-33-22.jpg', caption: '#нетакуси, #самипосебе #людипешки #нам_и_вдвоем_ круто' },
  { src: 'photo_2026-11-07_22-25-11.jpg', caption: 'Ой, как пляшет-то!' },
];

const gallery = [
  { src: 'photo_2026-11-07_22-35-17.jpg',  caption: 'твой любимые тан' },
  { src: 'photo_2026-11-07_22-31-50.jpg',  caption: 'как мы тогда задолбались(' },
  { src: 'photo_2026-11-07_22-33-37.jpg',  caption: 'ну вообще, элпешки прям' },
  { src: 'photo_2026-11-07_22-32-32.jpg', caption: 'крутые такие' },
  { src: 'photo_2026-11-07_22-41-39.jpg', caption: '9-й класс, представляешь, это было 5 лет назад' },
  { src: 'photo_2026-11-07_22-33-03.jpg', caption: 'ну, тут без комментариев...' },
];

/* ======================================================
   Стопка полароидов
   ====================================================== */
const stackEl      = document.getElementById('polaroidStack');
const progressEl   = document.getElementById('stackProgress');
const moreBtn      = document.getElementById('moreBtn');
const gridEl       = document.getElementById('photoGrid');

let currentIndex = 0;

function renderStack() {
  stackEl.innerHTML = '';
  polaroids.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.dataset.index = i;
    card.innerHTML = `
      <img src="${item.src}" alt="Фото ${i + 1}" loading="lazy">
      <div class="caption">${item.caption}</div>
    `;
    // Верхняя карточка — та, что с индексом 0 после удаления
    // Порядок в DOM важен: последняя добавленная — сверху по z-index
    stackEl.appendChild(card);
  });

  // Пересобираем порядок: верхняя = следующая непросмотренная
  // Проще: показываем только карточки с index >= currentIndex
  updateStackVisibility();
  updateProgress();
}

function updateStackVisibility() {
  const cards = stackEl.querySelectorAll('.polaroid');
  cards.forEach((card, i) => {
    card.style.display = i < currentIndex ? 'none' : '';
  });
}

function updateProgress() {
  const total = polaroids.length;
  const shown = Math.min(currentIndex + 1, total);
  progressEl.textContent = currentIndex >= total
    ? 'Это были все фотографии, к сожалению больше не могу вставить('
    : `${shown} / ${total}`;
}

// Клик по верхней карточке — она улетает, открывается следующая
stackEl.addEventListener('click', (e) => {
  const card = e.target.closest('.polaroid');
  if (!card) return;

  const index = Number(card.dataset.index);
  if (index !== currentIndex) return; // кликаем только по верхней

  // Анимация улёта в случайную сторону
  const dir = Math.random() > 0.5 ? 'fly-left' : 'fly-right';
  card.classList.add(dir, 'fly-away');

  currentIndex++;

  setTimeout(() => {
    card.style.display = 'none';
    card.classList.remove(dir, 'fly-away');
    updateProgress();

    if (currentIndex >= polaroids.length) {
      // Все полароиды просмотрены — показываем кнопку «А вот ещё»
      moreBtn.hidden = false;
      stackEl.style.cursor = 'default';
    }
  }, 450);
});

/* ======================================================
   Сетка «А вот ещё»
   ====================================================== */
function renderGrid() {
  gridEl.innerHTML = '';
  gallery.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'grid-card';
    card.innerHTML = `
      <img src="${item.src}" alt="Фото ${i + 1}" loading="lazy">
      <div class="caption">${item.caption}</div>
    `;
    card.addEventListener('click', () => openLightbox(item));
    gridEl.appendChild(card);
  });
}

moreBtn.addEventListener('click', () => {
  gridEl.hidden = false;
  renderGrid();
  moreBtn.hidden = true;
  // Плавно прокручиваем к сетке
  setTimeout(() => {
    gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
});

/* ======================================================
   Лайтбокс — фото на весь экран
   ====================================================== */
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <div class="lightbox-content">
    <button class="lightbox-close" type="button" aria-label="Закрыть">×</button>
    <img src="" alt="">
    <div class="lightbox-caption"></div>
  </div>
`;
document.body.appendChild(lightbox);

const lbImg     = lightbox.querySelector('img');
const lbCaption = lightbox.querySelector('.lightbox-caption');
const lbClose   = lightbox.querySelector('.lightbox-close');

function openLightbox(item) {
  lbImg.src = item.src;
  lbImg.alt = item.caption || 'Фото';
  lbCaption.textContent = item.caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ======================================================
   Инициализация
   ====================================================== */
renderStack();
moreBtn.hidden = true;