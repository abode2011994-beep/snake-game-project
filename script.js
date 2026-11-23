let blockSize = 25;
let total_row = 17;
let total_col = 17;
let board;
let context;

let gameStarted = false;
let isPaused = false;
let gameSpeed = 10;
let gameLoop;

let snakeX;
let snakeY;

let speedX = 0;
let speedY = 0;

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");
// play 
    document.getElementById("playButton").addEventListener("click", function() {
        startGame(10);
        

    });

// difficulty
    document.getElementById("easyButton").addEventListener("click", function () {
        startGame(5);
    });

    document.getElementById("mediumButton").addEventListener("click", function () {
        startGame(10);
    });

    document.getElementById("hardButton").addEventListener("click", function () {
        startGame(15);
    });

    

    document.addEventListener("keyup", changeDirection);

    // Game loop 
    gameLoop = setInterval(update, 1000 / gameSpeed);

//end screen 
document.getElementById("playAgainButton").addEventListener("click", function() {
    document.getElementById("gameOverScreen").style.display = "none";
    startGame(gameSpeed);
});

document.getElementById("menuButton").addEventListener("click", function() {

    gameStarted = false;
    gameOver = false;
    score = 0;
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("menu").style.display = "block";
    resetGame();
});
};

// Reset everything for a new game
function resetGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;

    speedX = 0;
    speedY = 0;

    snakeBody = [];
    gameOver = false;

    placeFood();
}

// Main game update
function update() {
    if (!gameStarted) return;
    if (gameOver) return;


// paused 
if (isPaused) {
    context.fillStyle = "white";
    context.font = "35px Arial";
    context.textAlign = "center";
    context.fillText("PAUSED", board.width / 2, board.height / 2);
    return;
}

    // Background
    context.fillStyle = "#10251b";
    context.fillRect(0, 0, board.width, board.height);


//subtle grid
context.strokeStyle = "#1c3b2b";
context.lineWidth = 1;

for (let i = 0; i <= total_col; i++) {
    context.beginPath();
    context.moveTo(i * blockSize, 0);
    context.lineTo(i * blockSize, board.height);
    context.stroke();

    context.beginPath();
    context.moveTo(0, i * blockSize);
    context.lineTo(board.width, i * blockSize);
    context.stroke();
}

    // Food
    context.fillStyle = "yellow";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // display score
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.textAlign = "left";
    context.fillText("Score: " + score, 1, 25);
    context.fillText("high Score: " + highScore, 1, 50)

    // Eat food
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);

        score += 1;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }

        placeFood();
    }

    // Move snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Move snake head
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    // Draw snake
    context.fillStyle = "white";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);

    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(
            snakeBody[i][0],
            snakeBody[i][1],
            blockSize,
            blockSize
        );
    }

    // Wall collision
    if (
        snakeX < 0 ||
        snakeX >= total_col * blockSize ||
        snakeY < 0 ||
        snakeY >= total_row * blockSize
    ) {
        endGame();
    }

    // Self collision
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            endGame();
        }
    }
}

// Game over
function endGame() {
    if (gameOver) return;

    gameOver = true;
    gameStarted = false;
    showGameOver();
}

// Movement
function changeDirection(e) {


    //pause
    if (e.code === "KeyP" && gameStarted && !gameOver) {
        isPaused = !isPaused;
        return;
    }

    // Restart
    if (gameOver && e.code == "Space") {
        score = 0;
        resetGame();
        return;
    }

    if (e.code == "ArrowUp" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    }
    else if (e.code == "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    }
    else if (e.code == "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    }
    else if (e.code == "ArrowRight" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }
}

// Place food randomly
function placeFood() {
    foodX = Math.floor(Math.random() * total_col) * blockSize;
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}



function startGame(speed) {
    gameSpeed = speed;

    clearInterval(gameLoop);
    gameLoop = setInterval(update, 1000/ gameSpeed);

    document.getElementById("menu").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    isPaused = false;

    
    gameStarted = true;
    score = 0;
    resetGame();
}

function showGameOver() {
    document.getElementById("gameOverScreen").style.display = "block";

    document.getElementById("finalScore").textContent = score;
    document.getElementById("finalHighScore").textContent = highScore;
}
