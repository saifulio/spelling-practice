let currentWord = "";
let currentIndex = 0;
let score = 0;
let gameData = [];

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
  const userInput = document.getElementById("user-input");
  const feedback = document.getElementById("feedback");

  currentWord = currentImageData.name;
  imageElement.src = "images/" + currentImageData.image;

  // Clear previous boxes
  letterBoxes.innerHTML = "";
  userInput.value = "";
  feedback.innerHTML = "";

  // Create boxes for letters
  for (let i = 0; i < currentWord.length; i++) {
    const box = document.createElement("div");
    box.classList.add("letter-box");
    box.dataset.index = i;
    letterBoxes.appendChild(box);
  }

  document.querySelectorAll(".letter-box").forEach((box) => {
    box.addEventListener("click", function () {
      const index = this.dataset.index;
      userInput.value += currentWord[index];
      this.textContent = currentWord[index];
    });
  });
}

// Handle Submit
document.getElementById("submit").addEventListener("click", function () {
  const userInput = document.getElementById("user-input").value;

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
    loadNextImage();
  }, 2000);
});

// Handle Skip
document.getElementById("skip").addEventListener("click", function () {
  currentIndex++;
  loadNextImage();
});

function showFinalScore() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.innerHTML = `<h1>Game Over!</h1><p>Your total score is: ${score}</p>`;
}
