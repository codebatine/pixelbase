// Game area
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the desired size for the player and apple
let playerSize = 100;
let appleSize = 60;

// Calculate the margin from the bottom border
const marginBottom = 0.3 * playerSize;

// Calculate the game area height
const gameHeight = canvas.height - marginBottom;

let gameStarted = false;

// Variables to hold the position of the player
let playerX = canvas.width / 2 - playerSize / 2;
let playerY = canvas.height - playerSize - marginBottom;

// Variables to hold the falling apples' positions and speed
let apples = [];

// Variables for the score, high score
let score = 0;

// Load the player image
const playerImage = new Image();
playerImage.src = 'img/player.webp';

// Load the apple image
const appleImage = new Image();
appleImage.src = 'img/apple.webp';

// Load the golden apple image
const goldenAppleImage = new Image();
goldenAppleImage.src = 'img/golden-apple.webp';

// Load the audio files
const bgMusic = [
  new Audio('./audio/sanjin-i-sma-bitar-5.mp3'),
  new Audio('./audio/sanjin-i-sma-bitar-7.mp3'),
];
const redAppleSound = new Audio('./audio/red-apple-sound.mp3');
const goldenAppleSound = new Audio('./audio/golden-apple-sound.mp3');
const missedGoldenAppleSound = new Audio('./audio/miss-golden-apple.mp3');

// Set the volume for the audio files
bgMusic.forEach((track) => (track.volume = 0.3)); // Set background music volume to 50%
redAppleSound.volume = 0.3; // Set red apple sound volume to 50%
goldenAppleSound.volume = 0.3; // Set golden apple sound volume to 50%
missedGoldenAppleSound.volume = 0.3; // Set missed golden apple sound volume to 50%

// Function to start playing background music randomly
function playBgMusic() {
  const track = bgMusic[Math.floor(Math.random() * bgMusic.length)];
  track.loop = true;
  track.play();
}

// Event listener to move the player with cursor keys
document.addEventListener('keydown', movePlayer);

function movePlayer(event) {
  switch (event.keyCode) {
    case 37: // Left arrow key
      if (playerX - playerSize >= 0) {
        playerX -= playerSize; // Move player to the left
      }
      break;
    case 39: // Right arrow key
      if (playerX + playerSize <= canvas.width - playerSize) {
        playerX += playerSize; // Move player to the right
      }
      break;
  }
}

// Update the game state every frame
function update() {
  // Clear the canvas at the beginning of each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    let text = 'CLICK ON GAME TO START';
    ctx.font = '3rem Pixelify Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure text width and height
    let metrics = ctx.measureText(text);
    let textWidth = metrics.width;
    let textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // Draw background rectangle
    ctx.fillStyle = 'black';
    ctx.fillRect(
      canvas.width / 2 - textWidth / 2 - 10,
      canvas.height / 2 - textHeight / 2 - 10,
      textWidth + 20,
      textHeight + 20,
    );

    // Draw text
    ctx.fillStyle = 'white';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    requestAnimationFrame(update);
    return;
  }
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.drawImage(playerImage, playerX, playerY, playerSize, playerSize);

  // Generate new apples randomly
  if (Math.random() < 0.02 && apples.length < 7) {
    const appleX = Math.random() * (canvas.width - appleSize);
    const appleY = Math.random() < 0.01 ? 0 : gameHeight - appleSize;

    // Determine if the apple is golden
    const isGolden = Math.random() < 0.15;

    // Use the same appleSpeed calculation for both red and golden apples
    const appleSpeed = Math.random() + 2;

    apples.push({ x: appleX, y: 0, speed: appleSpeed, isGolden });
  }

  // Update apples' positions and draw them
  apples.forEach((apple) => {
    apple.y += apple.speed;
    if (apple.isGolden) {
      ctx.drawImage(goldenAppleImage, apple.x, apple.y, appleSize, appleSize);
    } else {
      ctx.drawImage(appleImage, apple.x, apple.y, appleSize, appleSize);
    }

    // Check if the player caught the apple
    if (
      playerX < apple.x + appleSize &&
      playerX + playerSize > apple.x &&
      playerY < apple.y + appleSize &&
      playerY + playerSize > apple.y
    ) {
      // Increase the score and update it on the screen
      score += apple.isGolden ? 50 : 10;
      updateScore();

      // Remove the caught apple
      const index = apples.indexOf(apple);
      apples.splice(index, 1);

      // Play the corresponding sound effect when an apple is caught
      if (apple.isGolden) {
        goldenAppleSound.play();
      } else {
        redAppleSound.play();
      }
    }

    // Check if apple reached the bottom
    if (apple.y > gameHeight) {
      // Decrease the score by 200 for golden apples, 20 for regular apples
      score -= apple.isGolden ? 200 : 20;

      // Remove the fallen apple
      const index = apples.indexOf(apple);
      apples.splice(index, 1);

      // Play the corresponding sound effect when a golden apple is missed
      if (apple.isGolden) {
        missedGoldenAppleSound.play();
      }
    }
  });

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '2rem Pixelify Sans';
  ctx.textAlign = 'center';
  ctx.fillText('Score: ' + score, canvas.width / 2, 30);

  // Update game state recursively
  requestAnimationFrame(update);
}

function updateScore() {
  ctx.clearRect(0, 0, canvas.width, 30);
  ctx.fillStyle = 'black';
  ctx.font = '2rem Pixelify Sans';
  ctx.textAlign = 'center';
  ctx.fillText('Score: ' + score, canvas.width / 2, 30);
}

// Start the game loop
update();

// Start the background music when the game starts
canvas.addEventListener('click', function () {
  gameStarted = true;
  playBgMusic();
});
