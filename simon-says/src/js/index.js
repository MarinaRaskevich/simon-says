// Start data
let currentDifficultyLevel = "Easy";
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

  // Append elements
  headerSection.appendChild(difficultyLevelsContainer);
  headerSection.appendChild(startButton);
  mainWrapper.appendChild(keyboard);
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

document.addEventListener("DOMContentLoaded", () => {
  createInitialGameScreen();
});
