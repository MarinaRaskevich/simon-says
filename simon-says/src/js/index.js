// Start data
const gameState = {
  currentDifficultyLevel: "Easy",
  isSequencePlaying: false,
  isKeyBeingProcessed: false,
  currentRound: 1,
  gameSequence: [],
  userSequence: [],
  attempts: 1,
};
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
    if (level === gameState.currentDifficultyLevel)
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

  const winnerSound = document.createElement("audio");
  winnerSound.src = "./src/audio/winner.mp3";
  winnerSound.id = "winner-sound";

  // Append elements
  headerSection.appendChild(difficultyLevelsContainer);
  headerSection.appendChild(startButton);
  mainWrapper.appendChild(keyboard);
  mainWrapper.appendChild(keySound);
  mainWrapper.appendChild(wrongSound);
  mainWrapper.appendChild(correctSound);
  mainWrapper.appendChild(winnerSound);
  updateKeyboard();

  // Event Listeners
  difficultyLevelsContainer.addEventListener("click", (e) => {
    let clickedLevel = e.target;
    if (clickedLevel.dataset.level) {
      document.getElementById(gameState.currentDifficultyLevel).className =
        "level";
      clickedLevel.className = "level level_selected";
      gameState.currentDifficultyLevel = clickedLevel.dataset.level;
      updateKeyboard();
    }
  });
  startButton.addEventListener("click", startGame);
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
  roundCounter.textContent = `Round: ${gameState.currentRound}`;

  // Create difficulty level indicator
  const difficultyLevel = document.createElement("div");
  difficultyLevel.id = "difficulty-level";
  difficultyLevel.className = "difficulty-level";
  difficultyLevel.textContent = `Difficulty: ${gameState.currentDifficultyLevel}`;

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
  repeatButton.disabled = true;

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
  newGameButton.disabled = true;

  //Create message container
  const message = document.createElement("div");
  message.id = "feedback";
  message.className = "feedback";

  // Append elements
  buttonsContainer.appendChild(repeatButton);
  buttonsContainer.appendChild(nextButton);
  buttonsContainer.appendChild(newGameButton);
  headerSection.appendChild(header);
  headerSection.appendChild(roundCounter);
  headerSection.appendChild(difficultyLevel);
  headerSection.appendChild(sequenceInput);
  headerSection.appendChild(buttonsContainer);
  headerSection.appendChild(message);

  // Event Listeners
  repeatButton.addEventListener("click", () => {
    const message = document.getElementById("feedback");
    if (message) message.textContent = "";
    gameState.attempts--;
    gameState.userSequence = [];
    sequenceInput.value = "";
    repeatButton.disabled = true;
    simulateSequence(gameState.gameSequence);
  });
  nextButton.addEventListener("click", () => {
    document.querySelectorAll(".key").forEach((key) => {
      key.classList.remove("key_disabled");
    });
    gameState.currentRound++;
    gameState.attempts = 1;
    message.textContent = "";
    startRound();
    nextButton.classList.add("hidden");
    repeatButton.classList.remove("hidden");
    repeatButton.disabled = false;
  });
  newGameButton.addEventListener("click", startNewGame);
  document.addEventListener("keydown", handleKeyInteraction);
  keyboard.addEventListener("click", handleKeyInteraction);

  startRound();
};

// Change the key set depending on the selected difficulty level
const updateKeyboard = () => {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  const symbols = difficultyLevels[gameState.currentDifficultyLevel];
  symbols.split("").forEach((symbol) => {
    const key = document.createElement("li");
    key.className = "key";
    key.textContent = symbol;
    key.dataset.symbol = symbol;
    keyboard.appendChild(key);
  });
};

// Key highlight control
const highlightKey = async (key) => {
  return new Promise((resolve) => {
    key.classList.remove("highlight");
    setTimeout(() => {
      key.classList.add("highlight");
      document.getElementById("key-sound").play();
      setTimeout(() => {
        key.classList.remove("highlight");
        resolve();
      }, 400);
    }, 300);
  });
};

// Start showing keys in this round
const simulateSequence = async (sequence) => {
  const keyboard = document.getElementById("keyboard");
  const { attempts } = gameState;

  gameState.isSequencePlaying = true;
  for (const symbol of sequence) {
    const key = Array.from(keyboard.children).find(
      (k) => k.dataset.symbol === symbol
    );
    if (key) await highlightKey(key);
  }
  gameState.isSequencePlaying = false;

  document.getElementById("btn_new-game").disabled = false;
  document.getElementById("btn_repeat").disabled =
    attempts === 1 ? false : true;
};

// Handling keypress events on both physical and virtual keyboards
const handleKeyInteraction = (event) => {
  if (gameState.isSequencePlaying || gameState.isKeyBeingProcessed) return;

  let symbol;
  let key;

  if (event.type === "keydown") {
    symbol = event.key.toUpperCase();
    key = Array.from(document.querySelectorAll(".key")).find(
      (k) => k.dataset.symbol === symbol
    );
  } else if (event.type === "click" && event.target.classList.contains("key")) {
    key = event.target;
    symbol = key.dataset.symbol;
  }

  if (
    !symbol ||
    !difficultyLevels[gameState.currentDifficultyLevel].includes(symbol)
  ) {
    return;
  }

  gameState.isKeyBeingProcessed = true;

  if (key) {
    key.classList.add("highlight");
    document.getElementById("key-sound").play();
    setTimeout(() => {
      key.classList.remove("highlight");
    }, 400);
  }

  fillInput(symbol);

  setTimeout(() => {
    gameState.isKeyBeingProcessed = false;
  }, 400);
};

// Filling the input with the user's pressed keys and managing the game state
const fillInput = (symbol) => {
  const sequenceInput = document.getElementById("sequence");
  gameState.userSequence.push(symbol);
  sequenceInput.value = gameState.userSequence.join("");

  const { userSequence, gameSequence } = gameState;
  if (!gameSequence.join("").startsWith(userSequence.join(""))) {
    endGame(false);
  } else if (userSequence.length === gameSequence.length) {
    endGame(true);
  }
};

// Choosing the right feedback depending on the state of the game
const manageMessages = (success) => {
  const message = document.getElementById("feedback");
  const { currentRound, attempts } = gameState;

  message.className = success
    ? "feedback feedback_correct"
    : "feedback feedback_wrong";

  message.textContent = success
    ? currentRound < maxRounds
      ? "Correct! Proceed to the next round."
      : "Correct! You have completed all rounds!"
    : attempts === 0
    ? "Incorrect! Game over!"
    : "Incorrect! You can repeat the sequence.";
};

// Controlling the end of each round
const endGame = (success) => {
  manageMessages(success);
  const nextButton = document.getElementById("btn_next");
  const repeatButton = document.getElementById("btn_repeat");

  if (success && gameState.currentRound < maxRounds) {
    document.getElementById("correct-sound").play();
    repeatButton.classList.add("hidden");
    nextButton.classList.remove("hidden");
    gameState.isSequencePlaying = true;
    document.querySelectorAll(".key").forEach((key) => {
      key.classList.add("key_disabled");
    });
  } else if (!success) {
    document.getElementById("wrong-sound").play();
    gameState.isSequencePlaying = true;
  } else {
    document.getElementById("winner-sound").play();
    repeatButton.disabled = true;
  }
};

// Generate a sequence of random numbers for a new round
const generateSequence = (length) => {
  gameState.gameSequence = Array.from(
    { length },
    () =>
      difficultyLevels[gameState.currentDifficultyLevel][
        Math.floor(
          Math.random() *
            difficultyLevels[gameState.currentDifficultyLevel].length
        )
      ]
  );
  return gameState.gameSequence;
};

// Reset elements and start generating and displaying new keys
const startRound = () => {
  const { currentRound } = gameState;
  gameState.userSequence = [];
  document.getElementById("sequence").value = "";
  document.getElementById(
    "round-counter"
  ).textContent = `Round: ${currentRound}`;

  const sequenceLength = 2 + (currentRound - 1) * 2;
  let gameSequence = generateSequence(sequenceLength);
  console.log(gameSequence);
  simulateSequence(gameSequence);
};

// Launch a new game after clicking the New Game button
const startNewGame = () => {
  Object.assign(gameState, {
    currentRound: 1,
    attempts: 1,
    gameSequence: [],
    userSequence: [],
  });
  document.getElementById("app").remove();
  createInitialGameScreen();
};

document.addEventListener("DOMContentLoaded", createInitialGameScreen);
