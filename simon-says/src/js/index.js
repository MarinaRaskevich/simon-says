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

// Utility function
const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "dataset") {
      Object.assign(element.dataset, value);
    } else if (key === "textContent") {
      element.textContent = value;
    } else if (key === "src") {
      element.src = value;
    } else {
      element[key] = value;
    }
  });
  return element;
};

// Create DOM elements for initial game screen
const createInitialGameScreen = () => {
  // Create elements
  const app = createElement("div", { className: "app", id: "app" });
  const headerSection = createElement("div", { className: "header" });
  const header = createElement("h1", {
    className: "app__header",
    textContent: "Simon Says Game",
  });
  const difficultyLevelsContainer = createElement("div", {
    id: "levels",
    className: "levels",
  });
  const difficultyLevelsHeader = createElement("p", {
    className: "levels__header",
    textContent: "Select level",
  });
  const levelsWrapper = createElement("div", { className: "levels__wrapper" });
  Object.keys(difficultyLevels).forEach((level) => {
    const option = createElement("div", {
      id: level,
      className: `level ${
        level === gameState.currentDifficultyLevel ? "level_selected" : ""
      }`,
      textContent: level,
      dataset: { level },
    });
    levelsWrapper.appendChild(option);
  });
  const startButton = createElement("button", {
    id: "btn-start",
    className: "btn btn_start",
    textContent: "Start",
  });
  const mainSection = createElement("div", { className: "main" });
  const mainWrapper = createElement("div", {
    className: "main__wrapper wrapper",
  });
  const keyboard = createElement("ul", {
    id: "keyboard",
    className: "keyboard",
  });

  //Create sounds
  const keySound = createElement("audio", {
    id: "key-sound",
    src: "./src/audio/key.mp3",
  });

  const wrongSound = createElement("audio", {
    id: "wrong-sound",
    src: "./src/audio/wrong.mp3",
  });

  const correctSound = createElement("audio", {
    id: "correct-sound",
    src: "./src/audio/correct.mp3",
  });

  const winnerSound = createElement("audio", {
    id: "winner-sound",
    src: "./src/audio/winner.mp3",
  });

  //Append elements
  difficultyLevelsContainer.append(difficultyLevelsHeader, levelsWrapper);
  headerSection.append(header, difficultyLevelsContainer);
  headerSection.appendChild(startButton);

  mainWrapper.append(keySound, wrongSound, correctSound, winnerSound);
  mainWrapper.appendChild(keyboard);
  mainSection.appendChild(mainWrapper);
  app.append(headerSection, mainSection);
  document.body.appendChild(app);

  updateKeyboard();

  // Event Listeners
  levelsWrapper.addEventListener("click", (e) => {
    const clickedLevel = e.target.dataset.level;
    if (clickedLevel) {
      document
        .getElementById(gameState.currentDifficultyLevel)
        .classList.remove("level_selected");
      e.target.classList.add("level_selected");
      gameState.currentDifficultyLevel = clickedLevel;
      updateKeyboard();
    }
  });

  startButton.addEventListener("click", createStartGameScreen);
};

const createStartGameScreen = () => {
  const headerSection = document.querySelector(".header");
  headerSection.innerHTML = "";

  // Game Elements
  const header = createElement("h1", {
    className: "app__header",
    textContent: "Simon Says Game",
  });

  const roundCounter = createElement("div", {
    id: "round-counter",
    className: "round-counter",
    textContent: `Round: ${gameState.currentRound}`,
  });

  const difficultyLevel = createElement("div", {
    id: "difficulty-level",
    className: "difficulty-level",
    textContent: `Difficulty: ${gameState.currentDifficultyLevel}`,
  });

  const sequenceInput = createElement("input", {
    id: "sequence",
    className: "sequence",
    readOnly: true,
  });

  const buttonsContainer = createElement("div", {
    className: "action-buttons",
  });

  const repeatButton = createElement("button", {
    id: "btn_repeat",
    className: "btn btn_repeat",
    textContent: "Repeat the sequence",
    disabled: true,
  });

  const nextButton = createElement("button", {
    id: "btn_next",
    className: "btn btn_next hidden",
    textContent: "Next",
  });

  const newGameButton = createElement("button", {
    id: "btn_new-game",
    className: "btn btn_new-game",
    textContent: "New game",
    disabled: true,
  });

  const message = createElement("div", {
    id: "feedback",
    className: "feedback",
  });

  // Append elements
  buttonsContainer.append(newGameButton, repeatButton, nextButton);
  headerSection.append(
    header,
    roundCounter,
    difficultyLevel,
    sequenceInput,
    buttonsContainer,
    message
  );

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
  document.getElementById("btn_new-game").disabled = true;
  document.getElementById("btn_repeat").disabled = true;

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
  gameState.isSequencePlaying = true;

  if (success && gameState.currentRound < maxRounds) {
    document.getElementById("correct-sound").play();
    repeatButton.classList.add("hidden");
    nextButton.classList.remove("hidden");
    document.querySelectorAll(".key").forEach((key) => {
      key.classList.add("key_disabled");
    });
  } else if (!success) {
    document.getElementById("wrong-sound").play();
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
