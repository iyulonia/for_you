const inputs   = document.querySelectorAll('.q-input');
const cards    = document.querySelectorAll('.question-card');
const btn      = document.getElementById('checkBtn');
const result   = document.getElementById('result');

// Правильные ответы — подставь свои
const ANSWERS  = ['9', '4', '1', '0'];
const NEXT_URL = 'str5.html';

let solved = false;  

// Только цифры + Enter
inputs.forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '');
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkAll();
  });
});


cards.forEach((card, i) => {
  const num = card.querySelector('.q-number');
  if (num) {
    num.addEventListener('click', () => inputs[i].focus());
  }
});

// Проверка
function checkAll() {
  if (solved) return;

  let allCorrect = true;

  inputs.forEach((input, i) => {
    const card = cards[i];
    card.classList.remove('correct', 'wrong');

    if (input.value.trim() === ANSWERS[i]) {
      card.classList.add('correct');
    } else {
      card.classList.add('wrong');
      allCorrect = false;
      setTimeout(() => card.classList.remove('wrong'), 600);
    }
  });

  if (allCorrect) {
    solved = true;
    result.className = 'result show success-msg';
    result.innerHTML = `Ты взломала сейф! Ай-ай, мошенница, получается, м?<br>
                        <a href="${NEXT_URL}">Дальше →</a>`;
    btn.disabled = true;
    btn.textContent = 'Взломано ✓';
  } else {
    result.className = 'result show error-msg';
    result.innerHTML = 'Так-так, похоже, ты что-то забыла?! Если слишком сложно, то напиши мне- помогу чем смогу';
  }
}

btn.addEventListener('click', checkAll);