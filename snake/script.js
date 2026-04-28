const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20;
let score = 0;
let gameSpeed = 60; // Antes era 100. Ahora el juego corre casi al doble de velocidad (aprox 16 FPS)
let d; 
let snake = [{ x: 10 * box, y: 10 * box }];

// ... (mantené la lógica de dirección y comida)

// FUNCIÓN DE DIBUJO OPTIMIZADA
function draw() {
    // 1. Limpieza y Fondo (Ajedrez sutil)
    for (let i = 0; i < canvas.width / box; i++) {
        for (let j = 0; j < canvas.height / box; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? "#aad751" : "#a2d149";
            ctx.fillRect(i * box, j * box, box, box);
        }
    }

    // 2. Comida
    ctx.fillStyle = "#ea4335";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Serpiente con diseño fluido
    snake.forEach((part, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? "#34a853" : "#4ade80";
        
        ctx.beginPath();
        // Reducimos un poquito el radio para que se vea más definida al moverse rápido
        ctx.arc(part.x + box/2, part.y + box/2, box/2 - 0.5, 0, Math.PI * 2);
        ctx.fill();

        if (isHead) {
            // Ojos
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(part.x + 6, part.y + 7, 3, 0, Math.PI * 2);
            ctx.arc(part.x + 14, part.y + 7, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(part.x + 6, part.y + 6, 1.5, 0, Math.PI * 2);
            ctx.arc(part.x + 14, part.y + 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // ... (Lógica de movimiento de snakeX y snakeY igual que antes)

    // Aumentar la velocidad dinámicamente cada vez que come
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        
        // OPCIONAL: Hacer que el juego acelere un poco cada vez que come
        if(gameSpeed > 40) { // Ponemos un límite para que no sea injugable
            clearInterval(game);
            gameSpeed -= 2; 
            game = setInterval(draw, gameSpeed);
        }
    } else {
        snake.pop();
    }

    // ... (Lógica de NewHead y colisión igual que antes)
}

let game = setInterval(draw, gameSpeed);
