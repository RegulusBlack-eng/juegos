const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const box = 20;
let score = 0;
let gameSpeed = 40; 
let d; 
let snake = [{ x: 10 * box, y: 10 * box }];

function draw() {
 
    for (let i = 0; i < canvas.width / box; i++) {
        for (let j = 0; j < canvas.height / box; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? "#aad751" : "#a2d149";
            ctx.fillRect(i * box, j * box, box, box);
        }
    }

    ctx.fillStyle = "#ea4335";
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
    ctx.fill();

  
    snake.forEach((part, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? "#34a853" : "#4ade80";
        
        ctx.beginPath();
        
        ctx.arc(part.x + box/2, part.y + box/2, box/2 - 0.5, 0, Math.PI * 2);
        ctx.fill();

        if (isHead) {
            
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


    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        
        
        if(gameSpeed > 40) 
            clearInterval(game);
            gameSpeed -= 2; 
            game = setInterval(draw, gameSpeed);
        }
    } else {
        snake.pop();
    }

}

let game = setInterval(draw, gameSpeed);
