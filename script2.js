const input   = document.getElementById('kod');
const btn     = document.getElementById('checkBtn');
const result  = document.getElementById('result');

const CORRECT  = '14';             // правильный ответ
const NEXT_URL = 'str3.html';   // ссылка на следующую страницу

function showResult(html, type) {
  result.className = 'result show ' + type;
  result.innerHTML = html;
}

function checkAnswer() {
  const value = input.value.trim();

  // Пустое поле
  if (value === '') {
    input.classList.remove('success');
    input.classList.add('error');
    showResult('Ты ничего не ввела. Нажми на поле !!!.', 'error-msg');
    setTimeout(() => input.classList.remove('error'), 600);
    return;
  }

  if (value === CORRECT) {
    // Правильный ответ
    input.classList.remove('error');
    input.classList.add('success');
    showResult(
      `Ееееес. Прикинь ${value} лет нашей дружбы !!!<br>
       <a href="${NEXT_URL}">Тыкай, тыкай →</a>`,
      'success-msg'
    );
  } else {
    // Ошибка
    input.classList.remove('success');
    input.classList.add('error');
    input.value = '';
    showResult('Не-а, не то число. Считай лучше!!(2026-2012)', 'error-msg');
    setTimeout(() => input.classList.remove('error'), 600);
    input.focus();
  }
}

btn.addEventListener('click', checkAnswer);

// Enter тоже проверяет
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkAnswer();
});

// Только цифры
input.addEventListener('input', () => {
  input.value = input.value.replace(/\D/g, '');
});