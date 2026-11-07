const cards    = document.querySelectorAll('.emoji-card');
const btn      = document.getElementById('checkBtn');
const result   = document.getElementById('result');
const NEXT_URL = 'str4.html';   // ссылка на следующий уровень

function showResult(html, type) {
  result.className = 'result show ' + type;
  result.innerHTML = html;
}

// Нормализация ответа: нижний регистр, без лишних пробелов, без ё
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-яa-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkAnswers() {
  let allCorrect = true;
  let correctCount = 0;

  cards.forEach(card => {
    const input = card.querySelector('.emoji-input');
    const userAnswer = normalize(input.value);
    const rightAnswer = normalize(card.dataset.answer);

    card.classList.remove('correct', 'wrong');

    if (userAnswer === rightAnswer) {
      card.classList.add('correct');
      correctCount++;
    } else {
      card.classList.add('wrong');
      allCorrect = false;
      // убираем красную подсветку через полсекунды
      setTimeout(() => card.classList.remove('wrong'), 600);
    }
  });

  if (allCorrect) {
    showResult(
      `Умничка моя! Это те мультики, которые мы смотрели, но только джека вместе, ахахха<br> 
       <a href="${NEXT_URL}">Жми сюда →</a>`,
      'success-msg'
    );
    // блокируем повторные клики
    btn.disabled = true;
    btn.style.opacity = '0.5';
  } else {
    showResult(
      `Угадала ${correctCount} из 3. Ты сможешь, я верю в тебя`,
      'error-msg'
    );
  }
}

btn.addEventListener('click', checkAnswers);

// Enter в любом поле тоже запускает проверку
document.querySelectorAll('.emoji-input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAnswers();
  });
});