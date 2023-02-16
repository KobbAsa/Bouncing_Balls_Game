// set up canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const para = document.querySelector('p');
let counter = 0;


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {

    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }

}


class Ball extends Shape{
    constructor(x, y, velX, velY, exists, size, color) {
        super(x, y, velX, velY, exists);
        this.size = size;
        this.color = color;
        this.exists = true;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(Math.abs(this.velX));
        }

        if ((this.x - this.size) <= 0) {
            this.velX = Math.abs(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(Math.abs(this.velY));
        }

        if ((this.y - this.size) <= 0) {
            this.velY = Math.abs(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball)) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }

}

const balls = [];

while (balls.length < 33) {
    const size = random(10,20);
    const ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size,width - size),
        random(0 + size,height - size),
        random(-7,7),
        random(-7,7),
        randomRGB(),
        size
    );

    balls.push(ball);
    counter++;
    para.textContent = 'Ballz counter: ' + counter;
}

// adding evil circle!

class EvilCircle extends Shape {
    constructor(x, y) {
        super(x, y, 20, 20);

        this.size = 10;
        this.color = 'white';

        window.addEventListener('keydown', (e) => {
            switch (e.key){
                case'a':
                    this.x -= this.velX;
                    break;
                case'd':
                    this.x += this.velX;
                    break;
                case'w':
                    this.y -= this.velY;
                    break;
                case's':
                    this.y += this.velY;
                    break;
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x + this.size) >= width) {
            this.x -= this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x += this.size;
        }

        if ((this.y + this.size) >= height) {
            this.y -= this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y += this.size;
        }
    }

    // setControls(){
    //     let _this = this;
    //     window.onkeydown = function (e){
    //         if(e.keyCode === 65){
    //             _this.x -= _this.velX;
    //         }
    //         if(e.keyCode === 68){
    //             _this.x += _this.velX;
    //         }
    //     }
    // }

    collisionDetect(){
        for (const ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                    counter--;
                    para.textContent = 'Ballz counter: ' + counter;
                }
            }
        }
    }
}

const evilBall = new EvilCircle(random(0, width), random(0, height));

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0,  width, height);

    for (const ball of balls) {
        if(ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }

    evilBall.draw();
    evilBall.checkBounds();
    evilBall.collisionDetect();

    requestAnimationFrame(loop);
}

loop();


