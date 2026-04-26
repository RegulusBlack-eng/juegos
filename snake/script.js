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
    // 1. Dibujar el fondo tipo Tablero de Ajedrez (Google Style)
    ctx.fillStyle = "#a2d149"; // Verde oscuro de base
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < canvas.width / box; i++) {
        for (let j = 0; j < canvas.height / box; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillStyle = "#aad751"; // Verde claro
                ctx.fillRect(i * box, j * box, box, box);
            }
        }
    }

    // 2. Dibujar serpiente (Azul Google)
    for(let i = 0; i < snake.length; i++) {
        // Cabeza azul fuerte, cuerpo azul más claro
        ctx.fillStyle = (i == 0) ? "#4285f4" : "#6ea1f8"; 
        
        // Dibujamos un rectángulo con bordes redondeados (efecto pastilla)
        drawRoundedRect(ctx, snake[i].x, snake[i].y, box, box, 5);
        ctx.fill();
    }

    // 3. Dibujar comida (Manzana roja con emoji)
    // Para simplificar, dibujamos un círculo rojo, pero podrías usar una imagen
    ctx.fillStyle = "#ea4335"; // Rojo Google
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, 2 * Math.PI);
    ctx.fill();

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
        // Podrías poner un cartel más lindo aquí
        alert("¡Game Over! Puntaje final: " + score);
        location.reload(); // Reiniciar
    }

    snake.unshift(newHead); // Agregar nueva cabeza
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
