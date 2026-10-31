const state = {
    secretNumber: '',
    history: [],
    isGameOver: false
};

const formEl = document.getElementById('guess-form');
const inputEl = document.getElementById('guess-input');
const btnSubmitEl = document.getElementById('btn-submit');
const btnNewGameEl = document.getElementById('btn-new-game');
const errorEl = document.getElementById('error-message');
const winEl = document.getElementById('win-message');
const attemptsEl = document.getElementById('attempts-count');
const historyListEl = document.getElementById('history-list');


function generateSecretNumber() {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
        digits.splice(randomIndex, 1);
    }

    return result;
}

function validateInput(input) {
    if (!/^\d+$/.test(input)) {
        return { isValid: false, error: 'Вводить можно только цифры!' };
    }

    if (input.length !== 4) {
        return { isValid: false, error: 'Число должно состоять ровно из 4 цифр!' };
    }

    const uniqueDigits = new Set(input);
    if (uniqueDigits.size !== 4) {
        return { isValid: false, error: 'Все цифры должны быть различными!' };
    }

    return { isValid: true, error: '' };
}

function calculateBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guess[i])) {
            cows++;
        }
    }

    return { bulls, cows };
}

function getPluralForm(number, one, two, five) {
    let n = Math.abs(number) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) return five;
    if (n1 > 1 && n1 < 5) return two;
    if (n1 === 1) return one;
    return five;
}

function render() {
    attemptsEl.textContent = state.history.length;
    historyListEl.innerHTML = '';
    state.history.forEach((entry) => {
        const li = document.createElement('li');
        li.className = 'history-item';

        const bullsText = `${entry.bulls} ${getPluralForm(entry.bulls, 'бык', 'быка', 'быков')}`;
        const cowsText = `${entry.cows} ${getPluralForm(entry.cows, 'корова', 'коровы', 'коров')}`;

        li.innerHTML = `
            <span class="history-guess">${entry.guess}</span>
            <span class="history-result">→ ${bullsText}, ${cowsText}</span>
        `;
        historyListEl.appendChild(li);
    });
    historyListEl.scrollTop = historyListEl.scrollHeight;
    inputEl.disabled = state.isGameOver;
    btnSubmitEl.disabled = state.isGameOver;
    if (state.isGameOver) {
        winEl.textContent = `Победа! Угадано за ${state.history.length} ${getPluralForm(state.history.length, 'попытку', 'попытки', 'попыток')}`;
        winEl.classList.remove('hidden');
    } else {
        winEl.classList.add('hidden');
    }
}
function startNewGame() {
    state.secretNumber = generateSecretNumber();
    state.history = [];
    state.isGameOver = false;
    errorEl.textContent = '';
    inputEl.value = '';
    
    render();
    inputEl.focus();
    console.log(`[Game Initialized] Secret number: ${state.secretNumber}`);
}
formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.isGameOver) return;

    const value = inputEl.value.trim();
    const validation = validateInput(value);
    if (!validation.isValid) {
        errorEl.textContent = validation.error;
        return;
    }
    errorEl.textContent = '';
    const result = calculateBullsAndCows(state.secretNumber, value);
    state.history.push({
        guess: value,
        bulls: result.bulls,
        cows: result.cows
    });
    if (result.bulls === 4) {
        state.isGameOver = true;
    }

    inputEl.value = '';
    render();
});

btnNewGameEl.addEventListener('click', startNewGame);
inputEl.addEventListener('input', () => {
    if (errorEl.textContent) {
        errorEl.textContent = '';
    }
});

document.addEventListener('DOMContentLoaded', startNewGame);