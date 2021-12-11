// @ts-check
/** @type {HTMLCanvasElement} */
// @ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 800;

const BackMusic = new Audio("/sounds/BackMusic.mp3");
const jumpMusic = new Audio("/sounds/jump.mp3");
const dieMusic = new Audio("/sounds/die.mp3");
const NeverGonnaGive = new Audio("/sounds/Never.mp3");
BackMusic.play();
BackMusic.loop =true;

/**
 * @param {number} pt
 */
function parabollicEasing(pt) {
	let x = pt * 4 - 2;
	let y = x * x * -1 + 4;
	return y / 4;
}

class KeyboardState {
	constructor() {
		this.isAccelerating = false;
		this.isAcceleratingBack = false;
        this.devTool = false;
        this.isBraking = false;
        this.doubleJump = false
		this.registerEventHandlers();
	}

	registerEventHandlers() {
		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "a":
				case "ArrowLeft":
					this.isAcceleratingBack = true;
					break;
				case "d":
				case "ArrowRight":
					this.isAccelerating = true;
					break;
                case " ":
                    this.devTool = true;
                    break;
                case "ArrowDown":
                    this.isBraking = true;
                    break;
                case "ArrowUp":
                    this.doubleJump = true;
                    break;
			}
		});

		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
				case "ArrowLeft":
					this.isAcceleratingBack = false;
					break;
				case "d":
				case "ArrowRight":
					this.isAccelerating = false;
					break;
                case " ":
                    this.devTool = false;
                    break;
                case "ArrowDown":
                    this.isBraking = false;
                    break;
                case "ArrowUp":
                    this.doubleJump = false;
                    break;
			}
		});
	}
}

class Game {
	/**
	 * @param {KeyboardState} kb
	 */
	constructor(kb) {
		this.kb = kb;
		this.speed = 0;
		this.maxSpeed = 100;
		this.accelerationRate = 2;
		this.accelerationInterval = 100;
		this.timeSinceLastAcceleration = 0;
        this.fillColor = 0;
        this.strokeColor = 200;
        this.score = 0;
		this.scoreX = 0;
		this.scoreY = 95;
        this.wireUpListeners();
        this.bgImage = new Image();
		this.bgImage.src = "/images/back1.png";
		this.imageX = 0;
        this.bgImage2 = new Image();
		this.bgImage2.src = "/images/back2.png";
		this.imageX2 = this.imageX + this.bgImage.width;
        this.shipImage = new Image();
		this.shipImage.src = `/images/ship.png`;
        this.shipImageX = 700;
        this.shipImageY = 400;
        this.shipSpeed = 2;
        this.shipSpeedY = 1;
        this.upOdown = Math.random();
	}

	/**
	 * @param {number} elapsedTime
	 */
	update(elapsedTime) {
		this.timeSinceLastAcceleration += elapsedTime;
        this.fillColor += 1;
        this.strokeColor += 5;
		if (
			this.kb.isAccelerating &&
			this.speed < this.maxSpeed &&
			this.timeSinceLastAcceleration >= this.accelerationInterval
		) {
			this.speed += this.accelerationRate;
			this.timeSinceLastAcceleration = 0;
		}

		if (this.kb.isAcceleratingBack &&
            this.speed < this.maxSpeed &&
			this.timeSinceLastAcceleration >= this.accelerationInterval
        ) {
			this.speed -= this.accelerationRate;
			this.timeSinceLastAcceleration = 0;
		}

		if (
			!this.kb.isAccelerating &&
			!this.kb.isAcceleratingBack &&
			this.timeSinceLastAcceleration >= this.accelerationInterval &&
			this.speed > 0
		) {
			this.speed -= this.accelerationRate;
			this.timeSinceLastAcceleration = 0;
		}
        if (
			!this.kb.isAccelerating &&
			!this.kb.isAcceleratingBack &&
			this.timeSinceLastAcceleration >= this.accelerationInterval &&
			this.speed < 0
		) {
			this.speed += this.accelerationRate;
			this.timeSinceLastAcceleration = 0;
		}

        if (this.kb.isBraking) {
			this.speed = 0;
			this.timeSinceLastAcceleration = 0;
		}
        this.imageX -= this.speed / 5;
        this.imageX2 -= this.speed / 5;

        if (this.imageX + this.bgImage.width < 0)
        {
            this.imageX = this.imageX2 + this.bgImage2.width;
        }
        if (this.imageX2 + this.bgImage2.width < 0)
        {
            this.imageX2 = this.imageX + this.bgImage.width;
        }


        if (this.speed > 0)
        {
            this.shipImageX -= this.shipSpeed;
        }
        if (this.speed <= 0)
        {
            this.shipImageX += this.shipSpeed;
        }
        if (this.shipImageX < -200)
        {
            this.shipImageX = 1600;
            this.shipImageY = Math.random() * 700;
            this.shipSpeed = Math.random() * 20 + 1;
            this.shipSpeedY = Math.random() * 3;
            this.upOdown = Math.random();
        }
        if (this.shipImageX > canvas.width + 200)
        {
            this.shipImageX = -200;
            this.shipImageY = Math.random() * 700;
            this.shipSpeed = Math.random() * 20 + 1;
            this.shipSpeedY = Math.random() * 3;
            this.upOdown = Math.random();
        }
        if (this.upOdown >= 0.5)
        {
            this.shipImageY += this.shipSpeedY;
        }
        else if (this.upOdown < 0.5)
        {
            this.shipImageY -= this.shipSpeedY;
        }
        

	}

	render() {
        ctx.save();
        ctx.drawImage(this.bgImage, this.imageX, 0, this.bgImage.width, 800);
        ctx.drawImage(this.bgImage2, this.imageX2, 0, this.bgImage.width, 800);
        ctx.drawImage(this.shipImage, this.shipImageX, this.shipImageY);

        ctx.restore();

        ctx.save();
		ctx.fillStyle = `hsla(${this.fillColor}, 100%, 50%, 1)`;
		ctx.strokeStyle = `hsla(${this.strokeColor}, 100%, 50%, 1)`;
		ctx.font = "90px karma";
		ctx.fillText(`Score:${this.score}`, this.scoreX, this.scoreY);
		ctx.strokeText(`Score:${this.score}`, this.scoreX, this.scoreY);
		ctx.restore();
    }

    wireUpListeners() {
		document.addEventListener("bkb-bounce", (e) => {
			// @ts-ignore
			let p = e.detail;
			if (p.isScoreable && !p.isScored) {
				this.score += Math.round(Math.random() * 4 + 1);
                jumpMusic.play();
				p.isScored = true;
			}

            if (p.negScoreable && !p.negScored)
            {
                this.score -= 1;
            }

           
            if (p.isFadable)
            {
                p.isFading = true;
            }

            

        
		});
	};
}

class Player {
	/**
     * @param {Array<SafePlatform>} [platforms]
     * @param {Array<killPlatform>} [killers]
     * @param {KeyboardState} [key]
     */
	constructor(platforms, killers, key) {
		this.platforms = platforms;
        this.killers = killers;
        this.key = key;
		this.maxBounceHeight = canvas.height / 2;
		this.yOfLastBounce = 0;
		this.x = canvas.width * 0.25;
		this.y = 0;
		this.bounceTime = 1000;
		this.timeSinceLastBounce = 0;
		this.radius = 16;
        this.color = 0;
        this.opacity = 1;
        this.prevY = 0;
        this.canJump = true
		this.leftSide = this.x - this.radius / 2;
		this.rightSide = this.x + this.radius / 2;
	}

	/**
	 * @param {number} elapsedTime
	 */
	update(elapsedTime) {
		this.timeSinceLastBounce += elapsedTime;
		const isMovingDown = this.timeSinceLastBounce > this.bounceTime / 2;
        this.color += 6;

		let ef = parabollicEasing(this.timeSinceLastBounce / this.bounceTime);
		this.y = this.yOfLastBounce - ef * this.maxBounceHeight;

		this.platforms.forEach((p) => {
			let isInside =
				this.rightSide >= p.x && this.leftSide <= p.x + p.width;
			let isPlatformBelowMe =
				isInside && (this.y < p.y || this.prevY < p.y);

			if (
				isMovingDown &&
				isPlatformBelowMe &&
				this.y + this.radius >= p.y &&
                p.isVisible
			) {
				this.timeSinceLastBounce = 0;
				this.yOfLastBounce = p.y;
                this.canJump = true;

				let event = new CustomEvent("bkb-bounce", { detail: p });
				document.dispatchEvent(event);
			}
		});
        this.prevY = this.y;

        this.killers.forEach((kill) => {
            let killLeft = this.x + this.radius >= kill.x || this.x >= kill.x
            let killRight = this.x - this.radius <= kill.x + kill.width || this.x <= kill.x + kill.width
            let killUp = this.y + this.radius >= kill.y || this.y >= kill.y
            let killDown = this.y - this.radius <= kill.y + kill.height || this.y <= kill.y + kill.height
            let isDead = 
            (killLeft)&&
            (killRight)&&
            (killUp) &&
            (killDown) &&
            this.opacity > 0;

            if(isDead)
            {
                dieMusic.play();
                BackMusic.playbackRate -= 0.4;
                // @ts-ignore
                this.trace.opacity = 0;
            }
        });

        if (this.key.devTool)
        {
            this.opacity = 0;
            this.canJump = true;
            BackMusic.pause();
            NeverGonnaGive.play();
        }
        else 
        {
            this.opacity = 1;
            BackMusic.play();
            BackMusic.loop =true;
            NeverGonnaGive.pause();
        }

        if (this.key.devTool && this.y > canvas.height)
        {
            this.timeSinceLastBounce = 0;
			this.yOfLastBounce = canvas.height;
        }

        if (this.y > canvas.height + 50)
        {
            dieMusic.play();
            BackMusic.playbackRate -= 0.4;
            // @ts-ignore
            this.trace.opacity = 0;
        }

        if(this.canJump && this.key.doubleJump)
        {
            this.timeSinceLastBounce = 0;
			this.yOfLastBounce = this.y;
            this.canJump = false;
        }
	}

	render() {
		ctx.save();
        ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.opacity})`;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.restore();
	}
}

class Tracer {
	/**
	 * @param {Player} p
	 * @param {Game} g
	 */
	constructor(p, g) {
		this.p = p;
		this.g = g;
        this.color = 0;

		this.x = p.x;
		this.y = p.y;

		this.isVisible = true;
		this.opacity = 1;

		this.fadeRate = 0.1;
		this.fadeInterval = 100;
		this.timeSinceFade = 0;
	}

	/**
	 * @param {number} timeElapsed
	 */
	update(timeElapsed) {
		this.timeSinceFade += timeElapsed;
		this.x -= this.g.speed;
        this.color += 6;

		if (this.timeSinceFade >= this.fadeInterval) {
			this.opacity -= this.fadeRate;
			this.timeSinceFade = 0;
		}

		this.isVisible = this.opacity > 0;
	}

	render() {
		ctx.save();

		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.opacity})`;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.p.radius / 2, 0, Math.PI * 2, true);
		ctx.fill();

		ctx.restore();
	}
}

class SafePlatform {
	/**
	 * @param {Game} g
	 */
	constructor(g) {
		this.game = g;
		this.width = 400;
		this.height = 32;

		this.x = 0;
		this.y = canvas.height - this.height * 1.5;
        this.color = 180
		this.isVisible = true;
        this.isIncreasing = false;
        this.safeImage = new Image();
		this.safeImage.src = "/images/safe.png";
        this.safeImageX = this.x;
        this.safeImageY = this.y;
	}

	/**
	 * @param {number} elapsedTime
	 */
	// @ts-ignore
	update(elapsedTime) {
		this.x -= this.game.speed;
		this.isVisible = this.x + this.width > 0;
        this.safeImageX = this.x;
        this.safeImageY = this.y;

        if(this.color >= 240)
        {
            this.isIncreasing = false
        }
        if(this.color <= 180)
        {
            this.isIncreasing = true
        }
        if (this.isIncreasing)
        {
            this.color += 1;
        }
        if (!this.isIncreasing)
        {
            this.color -= 1;
        }

	}

	render() {
        ctx.save();
        ctx.drawImage(this.safeImage, this.safeImageX, this.safeImageY);
        ctx.restore();
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 0.5)`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

class FadePlatform {
	/**
	 * @param {Game} g
	 */
	constructor(g) {
		this.game = g;
		this.width = 400;
		this.height = 32;

		this.x = 0;
		this.y = canvas.height - this.height * 1.5;
        this.isFading = false;
        this.isFadable = true;
        this.color = 270
        this.isIncreasing = false
		this.isVisible = true;
        this.opacity = 0.5;
        this.safeImage = new Image();
		this.safeImage.src = "/images/safe.png";
        this.safeImageX = this.x;
        this.safeImageY = this.y;
        this.safeImageOpacity = 1;
	}

	/**
	 * @param {number} elapsedTime
	 */
	// @ts-ignore
	update(elapsedTime) {
		this.x -= this.game.speed;
        this.safeImageX = this.x;
        this.safeImageY = this.y;

        if (this.isFading)
        {
            this.opacity -= 0.05;
            this.safeImageOpacity = 0;
        }
        this.isVisible = this.x + this.width > 0 && this.opacity > 0;

        if(this.color >= 300)
        {
            this.isIncreasing = false
        }
        if(this.color <= 270)
        {
            this.isIncreasing = true
        }
        if (this.isIncreasing)
        {
            this.color += 1;
        }
        if (!this.isIncreasing)
        {
            this.color -= 1;
        }
	}

	render() {
        ctx.save();
        ctx.globalAlpha = this.safeImageOpacity;
        ctx.drawImage(this.safeImage, this.safeImageX, this.safeImageY);
        ctx.restore();
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.opacity})`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

class movingPlatformY {
	/**
	 * @param {Game} g
	 */
	constructor(g) {
		this.game = g;
		this.width = 400;
		this.height = 32;
		this.x = 0;
        this.bottemY = 700;
        this.topY = 400;
		this.y = this.topY;
        this.speed = 3;
        this.isMovingDown = false
		this.isVisible = true;
        this.color = 30;
        this.isIncreasing = true;
        this.safeImage = new Image();
		this.safeImage.src = "/images/safe.png";
        this.safeImageX = this.x;
        this.safeImageY = this.y;
	}

	/**
	 * @param {number} elapsedTime
	 */
	// @ts-ignore
	update(elapsedTime) {
		this.x -= this.game.speed;
		this.isVisible = this.x + this.width > 0;
        this.safeImageX = this.x;
        this.safeImageY = this.y;
        
        if(this.y <= this.topY)
        {
            this.isMovingDown = true
        }
        if (this.y >= this.bottemY)
        {
            this.isMovingDown = false
        }
        if (this.isMovingDown)
        {
            this.y += this.speed;
        }
        if(!this.isMovingDown)
        {
            this.y -= this.speed;
        }

        if(this.color >= 60)
        {
            this.isIncreasing = false
        }
        if(this.color <= 30)
        {
            this.isIncreasing = true
        }
        if (this.isIncreasing)
        {
            this.color += 0.5;
        }
        if (!this.isIncreasing)
        {
            this.color -= 0.5;
        }
       

	}

	render() {
        ctx.save();
        ctx.drawImage(this.safeImage, this.safeImageX, this.safeImageY);
        ctx.restore();
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 0.5)`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

class ScorePlatform {
	/**
	 * @param {Game} g
	 */
	constructor(g) {
		this.game = g;
		this.width = 32;
		this.height = canvas.height;
		this.x = 0;
		this.y = canvas.height - 100;
		this.isVisible = true;
		this.isScored = false;
		this.isScoreable = true;
        this.color = 120;
        this.isIncreasing = false;
        this.scoreImage = new Image();
		this.scoreImage.src = "/images/score.png";
        this.scoreImageX = this.x;
        this.scoreImageY = this.y;
	}

	/**
	 * @param {number} elapsedTime
	 */
	// @ts-ignore
	update(elapsedTime) {
		this.x -= this.game.speed;
		this.isVisible = this.x + this.width > 0;
        this.scoreImageX = this.x;
        this.scoreImageY = this.y;

        if(this.color >= 150)
        {
            this.isIncreasing = false
        }
        if(this.color <= 90)
        {
            this.isIncreasing = true
        }
        if (this.isIncreasing)
        {
            this.color += 1;
        }
        if (!this.isIncreasing)
        {
            this.color -= 1;
        }

        
	}

	render() {
        ctx.save();
        ctx.drawImage(this.scoreImage, this.scoreImageX, this.scoreImageY);
        ctx.restore();
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 0.5)`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

class negativePlatform {
	/**
	 * @param {Game} g
	 */
	constructor(g) {
		this.game = g;
		this.width = 32;
		this.height = canvas.height;
		this.x = 0;
		this.y = canvas.height - 100;
		this.isVisible = true;
		this.negScored = false;
		this.negScoreable = true;
        this.color = 15;
        this.isIncreasing = false;
        this.scoreImage = new Image();
		this.scoreImage.src = "/images/score.png";
        this.scoreImageX = this.x;
        this.scoreImageY = this.y;
	}

	/**
	 * @param {number} elapsedTime
	 */
	// @ts-ignore
	update(elapsedTime) {
		this.x -= this.game.speed;
		this.isVisible = this.x + this.width > 0;
        this.scoreImageX = this.x;
        this.scoreImageY = this.y;

        if(this.color >= 35)
        {
            this.isIncreasing = false
        }
        if(this.color <= 15)
        {
            this.isIncreasing = true
        }
        if (this.isIncreasing)
        {
            this.color += 0.5;
        }
        if (!this.isIncreasing)
        {
            this.color -= 0.5;
        }
	}

	render() {
		ctx.save();
        ctx.drawImage(this.scoreImage, this.scoreImageX, this.scoreImageY);
        ctx.restore();
		ctx.save();
		ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 0.5)`;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

class killPlatform {
	/**
	 * @param {Game} g
	 */
	constructor(g) {
		this.game = g;
		this.width = 32;
		this.height = canvas.height;

		this.x = 0;
		this.y = canvas.height - 100;

		this.isVisible = true;

	}

	/**
	 * @param {number} elapsedTime
	 */
	// @ts-ignore
	update(elapsedTime) {
		this.x -= this.game.speed;
		this.isVisible = this.x + this.width > 0;
	}

	render() {
		ctx.save();
		ctx.fillStyle = "hsla(0, 100%, 50%, 1)";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}

class PlatformManager {
	constructor(platforms, killers, game) {
		this.platforms = platforms;
		this.game = game;
        this.killers = killers
	}

	update() {
		let lastPlatform = platforms[platforms.length - 1];
        let lastKill = killers[killers.length - 1] || new killPlatform(this.game);
		let furthestX = lastPlatform.x + lastPlatform.width;
        let furthestKiller = lastKill.x + lastKill.width;

		while (furthestX < canvas.width * 2) {
			let spacerX = Math.floor(Math.random() * 268 + 64);
            let spacerY = Math.floor(Math.random() * 350 + 400);

			let nextPlatformType = Math.random();

			let p;

            if (nextPlatformType > 0 && nextPlatformType < 0.3) 
			{
				p = new SafePlatform(this.game);
			} 
			else if (nextPlatformType > 0.3 && nextPlatformType < 0.4)
			{
				p = new ScorePlatform(this.game);
			}
            else if (nextPlatformType > 0.4 && nextPlatformType < 0.6)
			{
				p = new FadePlatform(this.game);
			}
            else if (nextPlatformType > 0.6 && nextPlatformType < 0.7)
			{
				p = new negativePlatform(this.game);
			}
            else if (nextPlatformType > 0.7 && nextPlatformType < 0.8)
			{
				p = new movingPlatformY(this.game);
			}
            else {p = new SafePlatform(this.game);}


			p.x = furthestX + spacerX;
            p.y = spacerY;
			this.platforms.push(p);
			furthestX += spacerX + p.width;
		}
        
        while (furthestKiller < canvas.width * 2)
       {
        let spacerKX = Math.floor(Math.random() * 400 + 200);
        let spacerKY = Math.floor(Math.random() * 350 + 400);

        let k = new killPlatform(this.game);

        k.x = furthestKiller + spacerKX;
        k.y = spacerKY;
        let overLap = this.platforms.filter((p) => {
            p.x >= k.x && p.x + p.width <= k.x     
        })
        if(overLap.length)
        {
            k.x += 50;
        }
        this.killers.push(k);
		furthestKiller += spacerKX + k.width;

       }
	}
}

let kb = new KeyboardState();
let game = new Game(kb);


let platforms = [new SafePlatform(game)];
let killers = [];
let pm = new PlatformManager(platforms, killers, game);
let player = new Player(platforms, killers, kb);
let tracers = [new Tracer(player, game)];

let currentTime = 0;

/**
 * @param {number} timestamp
 */
function gameLoop(timestamp) {
	let timeElapsed = timestamp - currentTime;
	currentTime = timestamp;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    tracers.push(new Tracer(player, game));
    pm.update();
    let gameObjects = [game, ...tracers, player, ...platforms, ...killers];


    gameObjects.forEach((o) => {
        o.update(timeElapsed);
        o.render();
    })
	tracers = tracers.filter((t) => t.isVisible);

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);