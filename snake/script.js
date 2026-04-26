const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20; // Tamaño de cada cuadradito
let score = 0;
let gameSpeed = 100;

// La serpiente es un arreglo de objetos (coordenadas)
let snake = [{ x: 10 * box, y: 10 * box }];

// Comida
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let d; // Dirección

// Escuchar teclas
document.addEventListener("keydown", direction);

function direction(event) {
    if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if(event.keyCode == 38 && d != "DOWN") d = "UP";
    else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if(event.keyCode == 40 && d != "UP") d = "DOWN";
}

// Función para botones de celu
function changeDirection(newDir) {
    if(newDir == "LEFT" && d != "RIGHT") d = "LEFT";
    if(newDir == "UP" && d != "DOWN") d = "UP";
    if(newDir == "RIGHT" && d != "LEFT") d = "RIGHT";
    if(newDir == "DOWN" && d != "UP") d = "DOWN";
}

function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function draw() {
    // Limpiar fondo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar serpiente
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#22c55e" : "#166534"; // Cabeza más clara que el cuerpo
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar comida
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(food.x, food.y, box, box);

    // Posición vieja de la cabeza
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Mover cabeza
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    // Si come la manzana
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop(); // Quitar la cola si no comió
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over: chocar bordes o a sí misma
    if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("GAME OVER - Puntaje: " + score);
        location.reload(); // Reiniciar
    }

    snake.unshift(newHead); // Agregar nueva cabeza
}

let game = setInterval(draw, gameSpeed);
