let currentWord = "";
let currentIndex = 0;
let score = 0;
let gameData = [];
let userTypedWord = [];
let currentPosition = 0;

// Load the JSON data
fetch("data.json")
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

  // Capture user input via keyboard
  document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
  const letterBoxes = document.getElementById("letter-boxes").children;

  if (currentPosition < currentWord.length) {
    const keyPressed = event.key.toLowerCase();
    if (/^[a-z]$/.test(keyPressed)) {
      userTypedWord[currentPosition] = keyPressed;
      letterBoxes[currentPosition].textContent = keyPressed;
      currentPosition++;
    }
  }
}

// Handle Submit
document.getElementById("submit").addEventListener("click", function () {
  const userInput = userTypedWord.join("");

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
