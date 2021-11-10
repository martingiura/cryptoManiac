// Trae elementos del DOM
const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");
const size = 15;
let intervalId
let t = 0;
let speed = 0;
let playing = true;
let k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};
let lose = false
let perm = [];

while (perm.length < 255) {
    while (perm.includes(val = Math.floor(Math.random() * 255)));
    perm.push(val);
  }
  
  const lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
  
  const noise = x => {
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
  }

class GameAsset {
	constructor(x, y, width, height, img) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.image = new Image();
		this.image.src = img;
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

class Character extends GameAsset {
	constructor(x, y, width, height, img) {
        super(x, y, width, height, img);
        this.x = c.width / 2;
        this.y = 0;
        this.ySpeed = 0;
        this.rot = 0;
        this.rSpeed = 0;
        this.image.src = "images/frame-1.png";
        this.audio = new Audio();
        this.audio.src = "mixkit-bicycle-pedal-accelerating-2104.wav"
    }

draw() {

        let p1 = c.height - noise(t + this.x) * 0.25;
        let p2 = c.height - noise(t + 5 + this.x) * 0.25;
    
        let grounded = 0
    
        if(p1 - size > this.y) {
          this.ySpeed += 0.1;
        } else {
          this.ySpeed -= this.y - (p1 - size);
          this.y = p1 - size;
    
          grounded = 1;
        }
    
        if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
          playing = false;
          this.rSpeed = 5;
          k.ArrowUp = 1;
          this.x -= speed * 5;
        }
    
        let angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x);
    
        // this.rot = angle;
    
        this.y += this.ySpeed;
    
        if(grounded && playing) {
          this.rot -= (this.rot - angle) * 0.5;
          this.rSpeed = this.rSpeed - (angle - this.rot);
        }
    
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        this.rot -= this.rSpeed * 0.1;
    
        if(this.rot > Math.PI) this.rot = -Math.PI;
        if(this.rot < -Math.PI) this.rot = Math.PI;
    
    
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.image, -size, -size, 40, 40);
    
        ctx.restore();
      }

shootPedalingSound() {
		this.audio.volume = 0.1;
        this.audio.play();
    }        
    
stopPedalingSound() {
        this.audio.pause();
    }

loop () {

  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.1;
  t += 10 * speed;
  ctx.fillStyle = "#40B6E7";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "green";

  ctx.beginPath();
  ctx.moveTo(0, c.height);

  for (let i = 0; i < c.width; i++) {
    ctx.lineTo(i, c.height - noise(t + i) * 0.25);
  }

  ctx.lineTo(c.width, c.height);

  ctx.fill();

  this.draw();
}
}
// class Coins extends GameAsset {
//     constructor(x, y, width, height, img) {
//         super(x, y, width, height, img);
//     this.image.src="images/coin-sprite-animation.png"

// sprite(options) {
//     let that = {}
//     that.context = options.context;
//     that.width = options.width;
//     that.height = options.height;
//     that.image = options.image;

//     return that;

// }
//     }

// }

playerImage = "images/frame-1.png"
let player = new Character(-15,-15,50,50,playerImage)


// var coinImage = new Image();
// coinImage.src = "images/coin-sprite-animation.png";

// function sprite (options) {
				
//     var that = {};
					
//     that.context = options.context;
//     that.width = options.width;
//     that.height = options.height;
//     that.image = options.image;

//     return that;
// }

// var coin = sprite({
//     context: c.getContext("2d")
//     width: 50,
//     height: 50,
//     image: coinImage
// });

// function sprite (options) {

         
//         that.render = function () {
    
//         // Draw the animation
//         that.context.drawImage(
//             that.image,
//             frameIndex * that.width / numberOfFrames,
//             0,
//             that.width / numberOfFrames,
//             that.height,
//             0,
//             0,
//             that.width / numberOfFrames,
//             that.height);
//      };   
        

//     var that = {},
//     frameIndex = 0,
//     tickCount = 0,
//     ticksPerFrame = 0,
//     numberOfFrames = options.numberOfFrames || 1;

// that.loop = options.loop;

//     that.update = function () {

//         tickCount += 1;
			
//         if (tickCount > ticksPerFrame) {
        
//             tickCount = 0;
        
//             // If the current frame index is in range
//             if (frameIndex < numberOfFrames - 1) {	
//                 // Go to the next frame
//                 frameIndex += 1;
//             } else if (that.loop) {
//                 frameIndex = 0;
//             }
//         }
//     };

// }
    
// function gameLoop () {

//     window.requestAnimationFrame(gameLoop);
    
//     coin.update();
//     coin.render();
//   }
  
//   // Start the game loop as soon as the sprite sheet is loaded
//   coinImage.addEventListener("load", gameLoop);

function start() {
	if (intervalId) return;
	intervalId = setInterval(() => {
		update();
	}, 1000 / 60);
}

function update() {
    player.loop();
    player.draw();
    checkKeys();
}

function checkKeys() {
onkeydown = d => k[d.key] = 1;

onkeyup = d => k[d.key] = 0;

if(onkeyup) {
player.shootPedalingSound()
}

// if(onkeydown) {
// player.stopPedalingSound()
// }
}

start()
