const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#A020F0', '#FFA500', '#00FFFF'];
let secretCode = [];
let currentGuess = [];
let guesses = [];
let fakePasswords = [];
let gameOver = false;
let difficulty = 'easy';

const startGame = (selectedDifficulty) => {
  difficulty = selectedDifficulty;
  generateSecretCode();
  generateFakePasswords();
  document.getElementById('difficulty-selection').style.display = 'none';
  document.getElementById('game-display').style.display = 'block';
  createColorButtons();
  resetGame();
};

const generateSecretCode = () => {
  secretCode = [];
  const availableColors = [...COLORS];
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    secretCode.push(availableColors[randomIndex]);
    availableColors.splice(randomIndex, 1); // Remove the color to avoid duplicates
  }
};

const generateFakePasswords = () => {
  fakePasswords = [];
  for (let i = 0; i < 5; i++) {
    const fakePassword = [];
    const availableColors = [...COLORS];
    for (let j = 0; j < 4; j++) {
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      fakePassword.push(availableColors[randomIndex]);
      availableColors.splice(randomIndex, 1); // Remove the color to avoid duplicates
    }
    fakePasswords.push(fakePassword);
  }
  displayFakePasswords();
};

const displayFakePasswords = () => {
  const feedbackContainer = document.getElementById('feedback-container');
  feedbackContainer.innerHTML = '';
  fakePasswords.forEach((fakePassword, index) => {
    let feedback;
    if (difficulty === 'easy') {
      feedback = getFeedback(fakePassword);
    } else {
      // Hard mode: Only show count of green, white, black
      feedback = countFeedback(fakePassword);
    }
    feedbackContainer.innerHTML += `
      <div>
        Guess ${index + 1}: ${fakePassword.join(', ')} | Feedback: ${feedback}
      </div>
    `;
  });
};

const getFeedback = (guess) => {
  const feedback = [];
  const codeCopy = [...secretCode];
  const guessCopy = [...guess];

  // First, check for exact matches (green)
  for (let i = 0; i < 4; i++) {
    if (guess[i] === codeCopy[i]) {
      feedback.push('green');
      guessCopy[i] = codeCopy[i] = null;
    }
  }

  // Then, check for color matches (white)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] != null && codeCopy.includes(guessCopy[i])) {
      feedback.push('white');
      codeCopy[codeCopy.indexOf(guessCopy[i])] = null;
    }
  }

  // Remaining colors are incorrect (black)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] != null) {
      feedback.push('black');
    }
  }

  return feedback.join(', ');
};

const countFeedback = (guess) => {
  const feedback = { green: 0, white: 0, black: 0 };
  const codeCopy = [...secretCode];
  const guessCopy = [...guess];

  // First, check for exact matches (green)
  for (let i = 0; i < 4; i++) {
    if (guess[i] === codeCopy[i]) {
      feedback.green++;
      guessCopy[i] = codeCopy[i] = null;
    }
  }

  // Then, check for color matches (white)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] != null && codeCopy.includes(guessCopy[i])) {
      feedback.white++;
      codeCopy[codeCopy.indexOf(guessCopy[i])] = null;
    }
  }

  // Remaining colors are incorrect (black)
  for (let i = 0; i < 4; i++) {
    if (guessCopy[i] != null) {
      feedback.black++;
    }
  }

  return `${feedback.green} Green, ${feedback.white} White, ${feedback.black} Black`;
};

const createColorButtons = () => {
  const buttonContainer = document.getElementById('color-buttons');
  buttonContainer.innerHTML = '';
  COLORS.forEach(color => {
    const button = document.createElement('button');
    button.style.backgroundColor = color;
    button.onclick = () => handleColorClick(color);
    buttonContainer.appendChild(button);
  });
};

const handleColorClick = (color) => {
  if (gameOver) return;

  if (currentGuess.length < 4) {
    currentGuess.push(color);
    updateGuessDisplay();
  }

  if (currentGuess.length === 4) {
    const feedback = getFeedback(currentGuess);
    guesses.push({ guess: currentGuess, feedback });
    currentGuess = [];
    if (feedback === 'green, green, green, green') {
      gameOver = true;
      displayFeedback("Congratulations! You guessed the code!");
    } else if (guesses.length >= 10) {
      gameOver = true;
      displayFeedback(`Game Over! The correct code was: ${secretCode.join(', ')}`);
    } else {
      updateGuessDisplay();
    }
  }
};

const updateGuessDisplay = () => {
  const guessContainer = document.getElementById('guess-container');
  guessContainer.innerHTML = `<p>Current Guess: ${currentGuess.join(', ')}</p>`;
};

const displayFeedback = (message) => {
  const feedbackContainer = document.getElementById('feedback-container');
  feedbackContainer.innerHTML = message;
};

const resetGame = () => {
  generateSecretCode();
  currentGuess = [];
  guesses = [];
  fakePasswords = [];
  gameOver = false;
  document.getElementById('feedback-container').innerHTML = '';
  updateGuessDisplay();
  generateFakePasswords();  // Generate fake passwords again after resetting
};
