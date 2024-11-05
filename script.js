let currentWord = "";
let currentIndex = 0;
let score = 0;
let gameData = [];
let userTypedWord = [];
let currentPosition = 0;

// Load the JSON data
fetch("data.json?t=6")
  .then((response) => response.json())
  .then((data) => {
    gameData = data;
    loadNextImage();
  });

function loadNextImage() {
  if (currentIndex >= gameData.length) {
    showFinalScore();
    return;
  }

  const currentImageData = gameData[currentIndex];
  const imageElement = document.getElementById("image");
  const letterBoxes = document.getElementById("letter-boxes");
  const feedback = document.getElementById("feedback");

  currentWord = currentImageData.name;
  imageElement.src = "images/" + currentImageData.image;

  // Reset values
  letterBoxes.innerHTML = "";
  feedback.innerHTML = "";
  userTypedWord = [];
  currentPosition = 0;

  // Create boxes for each letter
  for (let i = 0; i < currentWord.length; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    box.dataset.index = i;
    letterBoxes.appendChild(box);
  }

  // Create the keyboard
  createKeyboard();

  // Capture user input via keyboard
  document.addEventListener("keydown", handleKeyPress);
}

// Create an on-screen keyboard with letters A-Z
function createKeyboard() {
  const keyboardContainer = document.getElementById("keyboard");
  keyboardContainer.innerHTML = "";

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(97 + i).toLowerCase(); // 'A' to 'Z'
    const key = document.createElement("div");
    key.classList.add("key");
    key.textContent = letter;
    key.addEventListener("click", () =>
      handleVirtualKeyPress(letter.toLowerCase())
    );
    keyboardContainer.appendChild(key);
  }

  // Add delete button functionality
  document.getElementById("delete").addEventListener("click", handleDelete);
}

// Handle virtual keypress from the on-screen keyboard
function handleVirtualKeyPress(letter) {
  if (currentPosition < currentWord.length) {
    insertLetter(letter);
  }
}

// Handle physical keypress (only accept letters)
function handleKeyPress(event) {
  const keyPressed = event.key.toLowerCase();
  if (/^[a-z]$/.test(keyPressed) && currentPosition < currentWord.length) {
    insertLetter(keyPressed);
  }
}

function insertLetter(letter) {
  const letterBoxes = document.getElementById("letter-boxes").children;
  userTypedWord[currentPosition] = letter;
  letterBoxes[currentPosition].textContent = letter;
  currentPosition++;
}

// Handle the delete button (undo the last letter typed)
function handleDelete() {
  if (currentPosition > 0) {
    currentPosition--;
    userTypedWord.pop();
    const letterBoxes = document.getElementById("letter-boxes").children;
    letterBoxes[currentPosition].textContent = "";
  }
}

let submitClicked = false;
// Handle Submit
document.getElementById("submit").addEventListener("click", function () {
  if (submitClicked) return;
  const userInput = userTypedWord.join("");

  submitClicked = true;

  if (userInput.toLowerCase() === currentWord.toLowerCase()) {
    score++;
    document.getElementById("score").textContent = score;
    document.getElementById("correct-sound").play();
    document.getElementById("feedback").innerHTML = "👍 Correct!";
  } else {
    document.getElementById("wrong-sound").play();
    document.getElementById("feedback").innerHTML = "❌ Wrong! Try again.";
  }

  // Move to next image after delay
  setTimeout(() => {
    currentIndex++;
    document.removeEventListener("keydown", handleKeyPress);
    loadNextImage();
    submitClicked = false;
  }, 2000);
});

// Handle Skip
document.getElementById("skip").addEventListener("click", function () {
  currentIndex++;
  document.removeEventListener("keydown", handleKeyPress);
  loadNextImage();
});

function showFinalScore() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.innerHTML = `<h1>Game Over!</h1><p>Your total score is: ${score}</p>`;
}
