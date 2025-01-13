// Start data
let currentDifficultyLevel = "Easy";
let isSequencePlaying = false;
let currentRound = 1;
let gameSequence = [];
let userSequence = [];
const maxRounds = 5;
const difficultyLevels = {
  Easy: "0123456789",
  Medium: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  Hard: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};

// Create DOM elements dynamically
const createInitialGameScreen = () => {
  // Create general div
  const app = document.createElement("div");
  app.classList.add("app");
  app.id = "app";
  // Create header section
  const headerSection = document.createElement("div");
  headerSection.className = "header";
  // Create header H1
  const header = document.createElement("h1");
  header.classList.add("app__header");
  header.innerHTML = "Simon Says Game";
  headerSection.appendChild(header);
  // Create main section
  const mainSection = document.createElement("div");
  mainSection.className = "main";
  const mainWrapper = document.createElement("div");
  mainWrapper.className = "main__wrapper wrapper";
  mainSection.appendChild(mainWrapper);
  // Add elements in DOM
  app.appendChild(headerSection);
  app.appendChild(mainSection);
  document.body.appendChild(app);

  // Create div container for difficulty levels and its elements
  const difficultyLevelsContainer = document.createElement("div");
  difficultyLevelsContainer.id = "levels";
  difficultyLevelsContainer.className = "levels";
  const difficultyLevelsHeader = document.createElement("p");
  difficultyLevelsHeader.className = "levels__header";
  difficultyLevelsHeader.innerText = "Select level";

  const levels = document.createElement("div");
  levels.className = "levels__wrapper";
  Object.keys(difficultyLevels).forEach((level) => {
    const option = document.createElement("div");
    option.id = level;
    option.className = "level";
    option.innerText = level;
    option.setAttribute("data-level", level);
    if (level === currentDifficultyLevel)
      option.className = "level level_selected";
    levels.appendChild(option);
  });
  difficultyLevelsContainer.appendChild(difficultyLevelsHeader);
  difficultyLevelsContainer.appendChild(levels);

  // Create Start Button
  const startButton = document.createElement("button");
  startButton.id = "btn-start";
  startButton.className = "btn btn_start";
  startButton.textContent = "Start";

  // Create Keyboard
  const keyboard = document.createElement("ul");
  keyboard.id = "keyboard";
  keyboard.className = "keyboard";

  //Create audio
  const keySound = document.createElement("audio");
  keySound.src = "./src/audio/key.mp3";
  keySound.id = "key-sound";

  const wrongSound = document.createElement("audio");
  wrongSound.src = "./src/audio/wrong.mp3";
  wrongSound.id = "wrong-sound";

  const correctSound = document.createElement("audio");
  correctSound.src = "./src/audio/correct.mp3";
  correctSound.id = "correct-sound";

  // Append elements
  headerSection.appendChild(difficultyLevelsContainer);
  headerSection.appendChild(startButton);
  mainWrapper.appendChild(keyboard);
  mainWrapper.appendChild(keySound);
  mainWrapper.appendChild(wrongSound);
  mainWrapper.appendChild(correctSound);
  updateKeyboard();

  // Event Listeners
  difficultyLevelsContainer.addEventListener("click", (e) => {
    let clickedLevel = e.target;
    if (clickedLevel.dataset.level) {
      document.getElementById(currentDifficultyLevel).className = "level";
      clickedLevel.className = "level level_selected";
      currentDifficultyLevel = clickedLevel.dataset.level;
      updateKeyboard();
    }
  });
  startButton.addEventListener("click", startGame);
};

const updateKeyboard = () => {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  const symbols = difficultyLevels[currentDifficultyLevel];
  symbols.split("").forEach((symbol) => {
    const key = document.createElement("li");
    key.className = "key";
    key.textContent = symbol;
    key.dataset.symbol = symbol;
    keyboard.appendChild(key);
  });
};

const startGame = () => {
  const headerSection = document.querySelector(".header");
  headerSection.innerHTML = "";

  // Game Elements
  // Create header H1
  const header = document.createElement("h1");
  header.classList.add("app__header");
  header.innerHTML = "Simon Says Game";

  // Create Round counter
  const roundCounter = document.createElement("div");
  roundCounter.id = "round-counter";
  roundCounter.className = "round-counter";
  roundCounter.textContent = `Round: ${currentRound}`;

  // Create difficulty level indicator
  const difficultyLevel = document.createElement("div");
  difficultyLevel.id = "difficulty-level";
  difficultyLevel.className = "difficulty-level";
  difficultyLevel.textContent = `Difficulty: ${currentDifficultyLevel}`;

  // Create sequence input
  const sequenceInput = document.createElement("input");
  sequenceInput.id = "sequence";
  sequenceInput.className = "sequence";
  sequenceInput.readOnly = true;

  // Create repeat button
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "action-buttons";
  const repeatButton = document.createElement("button");
  repeatButton.id = "btn_repeat";
  repeatButton.className = "btn btn_repeat";
  repeatButton.textContent = "Repeat the sequence";
  repeatButton.disabled = false;

  // Create next game  button
  const nextButton = document.createElement("button");
  nextButton.id = "btn_next";
  nextButton.className = "btn btn_next hidden";
  nextButton.textContent = "Next";

  // Create new game button
  const newGameButton = document.createElement("button");
  newGameButton.id = "btn_new-game";
  newGameButton.className = "btn btn_new-game";
  newGameButton.textContent = "New game";

  // Append elements
  buttonsContainer.appendChild(repeatButton);
  buttonsContainer.appendChild(nextButton);
  buttonsContainer.appendChild(newGameButton);
  headerSection.appendChild(header);
  headerSection.appendChild(roundCounter);
  headerSection.appendChild(difficultyLevel);
  headerSection.appendChild(sequenceInput);
  headerSection.appendChild(buttonsContainer);

  // Event Listeners
  repeatButton.addEventListener("click", () => {
    const message = document.getElementById("feedback");
    if (message) message.remove();
    userSequence = [];
    sequenceInput.value = "";
    repeatButton.disabled = true;
    simulateSequence(gameSequence);
  });
  nextButton.addEventListener("click", () => {
    currentRound++;
    startRound();
    nextButton.classList.add("hidden");
    repeatButton.classList.remove("hidden");
    repeatButton.disabled = false;
  });
  document.addEventListener("keydown", handleKeyPress);
  keyboard.addEventListener("click", handleKeyClick);

  startRound();
};

const generateSequence = (length) => {
  const symbols = difficultyLevels[currentDifficultyLevel];
  let sequence = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    sequence.push(symbols[randomIndex]);
  }
  return sequence;
};

const simulateSequence = (sequence) => {
  const keyboard = document.getElementById("keyboard");
  let i = 0;
  isSequencePlaying = true;

  const interval = setInterval(() => {
    if (i < sequence.length) {
      const key = Array.from(keyboard.children).find(
        (k) => k.dataset.symbol === sequence[i]
      );
      if (key) {
        key.classList.add("highlight");
        const keySound = document.getElementById("key-sound");
        keySound.play();
        setTimeout(() => key.classList.remove("highlight"), 400);
      }
      i++;
    } else {
      clearInterval(interval);
      isSequencePlaying = false;
    }
  }, 400);
};

const handleKeyPress = (event) => {
  if (isSequencePlaying) return;

  const symbol = event.key.toUpperCase();
  if (difficultyLevels[currentDifficultyLevel].includes(symbol)) {
    fillInput(symbol);
  }
};

const handleKeyClick = (event) => {
  if (isSequencePlaying) return;

  if (event.target.classList.contains("key")) {
    const symbol = event.target.dataset.symbol;
    fillInput(symbol);
  }
};

const fillInput = (symbol) => {
  const sequenceInput = document.getElementById("sequence");
  userSequence.push(symbol);
  sequenceInput.value = userSequence.join("");

  if (!gameSequence.join("").startsWith(userSequence.join(""))) {
    endGame(false);
  } else if (userSequence.length === gameSequence.length) {
    endGame(true);
  }
};

const endGame = (success) => {
  const message = document.createElement("div");
  message.id = "feedback";
  message.className = success
    ? "feedback feedback_correct"
    : "feedback feedback_wrong";
  message.textContent = success
    ? "Correct! Proceed to the next round."
    : "Incorrect!";
  document.querySelector(".header").appendChild(message);

  if (success && currentRound < maxRounds) {
    const correctSound = document.getElementById("correct-sound");
    correctSound.play();
    const repeatButton = document.getElementById("btn_repeat");
    const nextButton = document.getElementById("btn_next");
    repeatButton.classList.add("hidden");
    nextButton.classList.remove("hidden");
  }

  if (!success) {
    const wrongSound = document.getElementById("wrong-sound");
    wrongSound.play();
    isSequencePlaying = true;
  }
};

const startRound = () => {
  const sequenceInput = document.getElementById("sequence");
  sequenceInput.value = "";
  const message = document.getElementById("feedback");
  if (message) message.remove();
  const roundCounter = document.getElementById("round-counter");
  roundCounter.textContent = `Round: ${currentRound}`;
  userSequence = [];
  const sequenceLength = 2 + (currentRound - 1) * 2;
  gameSequence = generateSequence(sequenceLength);
  console.log(gameSequence);
  simulateSequence(gameSequence);
};

document.addEventListener("DOMContentLoaded", () => {
  createInitialGameScreen();
});
