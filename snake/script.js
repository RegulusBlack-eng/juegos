const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20; // Tamaño de cada cuadradito (1 grid unit)
let score = 0;
let gameSpeed = 120; // Un poco más lento para que sea más jugable

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
    // 1. Dibujar el fondo tipo Tablero de Ajedrez (como ya tenías, pero más suave)
    for (let i = 0; i < canvas.width / box; i++) {
        for (let j = 0; j < canvas.height / box; j++) {
            // Unificamos el fondo para que la textura sea la serpiente
            ctx.fillStyle = "#aad751"; // Base verde claro
            ctx.fillRect(i * box, j * box, box, box);
        }
    }

    // 2. Dibujar la comida (una manzana con brillo)
    ctx.fillStyle = "#ef4444"; // Rojo manzana
    ctx.beginPath();
    // Dibujamos un círculo para la manzana
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    // Brillo de la manzana
    ctx.fillStyle = "#ffffff66";
    ctx.beginPath();
    ctx.arc(food.x + box/2 - 3, food.y + box/2 - 3, 3, 0, 2 * Math.PI);
    ctx.fill();

    // 3. Dibujar la serpiente "REAL"
    for(let i = 0; i < snake.length; i++) {
        const isHead = (i === 0);
        const radius = box / 2; // Dibujamos círculos en lugar de bloques

        ctx.fillStyle = isHead ? "#22c55e" : "#16a34a"; // Verde fuerte para cabeza, más oscuro para cuerpo

        ctx.beginPath();
        // Dibujamos un círculo en el centro de cada bloque
        ctx.arc(snake[i].x + radius, snake[i].y + radius, radius, 0, 2 * Math.PI);
        ctx.fill();

        // --- Agregar Ojos a la Cabeza ---
        if (isHead) {
            const eyeColor = "#000000"; // Negro
            const pupilColor = "#ffffff"; // Blanco
            const eyeRadius = 3;
            const pupilRadius = 1;
            
            // Posición base de los ojos (centro de la cabeza)
            const headCenterX = snake[i].x + radius;
            const headCenterY = snake[i].y + radius;

            // Dibujar primer ojo
            ctx.fillStyle = eyeColor;
            ctx.beginPath();
            ctx.arc(headCenterX - 5, headCenterY - 3, eyeRadius, 0, 2 * Math.PI);
            ctx.fill();
            // Pupila
            ctx.fillStyle = pupilColor;
            ctx.beginPath();
            ctx.arc(headCenterX - 5, headCenterY - 3, pupilRadius, 0, 2 * Math.PI);
            ctx.fill();

            // Dibujar segundo ojo
            ctx.fillStyle = eyeColor;
            ctx.beginPath();
            ctx.arc(headCenterX + 5, headCenterY - 3, eyeRadius, 0, 2 * Math.PI);
            ctx.fill();
            // Pupila
            ctx.fillStyle = pupilColor;
            ctx.beginPath();
            ctx.arc(headCenterX + 5, headCenterY - 3, pupilRadius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // --- Lógica del Movimiento (esto se mantiene igual) ---
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("GAME OVER - Puntaje: " + score);
        location.reload();
    }

    snake.unshift(newHead);
}
}

// Función auxiliar para dibujar rectángulos redondeados
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

let game = setInterval(draw, gameSpeed);
