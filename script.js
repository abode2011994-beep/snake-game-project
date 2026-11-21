let blockSize = 25;
let total_row = 17;
let total_col = 17;
let board;
let context;
let score = 0;

let snakeX;
let snakeY;

let speedX = 0;
let speedY = 0;

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    resetGame();

    document.addEventListener("keyup", changeDirection);

    // Game loop — only created once
    setInterval(update, 1000 / 10);
};

// Reset everything for a new game
function resetGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;

    speedX = 0;
    speedY = 0;

    snakeBody = [];
    gameOver = false;
    score = 0;
    document.getElementById("score").innerText = "Score: 0"

    placeFood();
}

// Main game update
function update() {
    if (gameOver) {
        // Show Game Over screen
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);

        context.fillStyle = "red";
        context.font = "40px Arial";
        context.textAlign = "center";
        context.fillText("GAME OVER", board.width / 2, board.height / 2);

        context.fillStyle = "white";
        context.font = "20px Arial";
        context.fillText("Press SPACE to restart", board.width / 2, board.height / 2 + 40);

        return;
    }

    // Background
    context.fillStyle = "green";
    context.fillRect(0, 0, board.width, board.height);

    // Food
    context.fillStyle = "yellow";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    // Eat food
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        

        score += 1;
        document.getElementById("score").innerText = "Score: " + score;
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
    gameOver = true;
}

// Movement
function changeDirection(e) {

    // Restart after losing
    if (gameOver && e.code == "Space") {
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
