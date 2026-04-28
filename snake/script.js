const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20;
let score = 0;
let gameSpeed = 100;
let d; 
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

document.addEventListener("keydown", direction);

function direction(event) {
    if(event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if(event.keyCode == 38 && d != "DOWN") d = "UP";
    else if(event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if(event.keyCode == 40 && d != "UP") d = "DOWN";
}

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
    // 1. Dibujar Tablero
    for (let i = 0; i < canvas.width / box; i++) {
        for (let j = 0; j < canvas.height / box; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? "#aad751" : "#a2d149";
            ctx.fillRect(i * box, j * box, box, box);
        }
    }

    // 2. Dibujar Manzana
    ctx.fillStyle = "#ea4335";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(food.x + box/2 - 3, food.y + box/2 - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Dibujar Serpiente
    snake.forEach((part, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? "#34a853" : "#4ade80";
        
        ctx.beginPath();
        ctx.arc(part.x + box/2, part.y + box/2, box/2 - 1, 0, Math.PI * 2);
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

            // Lengua (solo si se mueve)
            if (d) {
                ctx.strokeStyle = "#ff4d4d";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(part.x + box/2, part.y + 2);
                ctx.lineTo(part.x + box/2, part.y - 4);
                ctx.stroke();
            }
        }
    });

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
        alert("¡Perdiste! Tu puntaje fue: " + score);
        location.reload();
    }

    snake.unshift(newHead);
}

let game = setInterval(draw, gameSpeed);
