// Trae elementos del DOM
const c = document.querySelector("#canvas");
const ctx = c.getContext("2d");
const $button = document.querySelector("button");
const $buttonRestart = document.querySelector("#button-restart");
const size = 15;
let intervalId
let t = 0;
let speed = 0;
let playing = true;
let k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0, SpaceBar: 0};
let isGameOver = false
let perm = [];
let timer = 0
const coin = new Image();
coin.src = "images/coin.png"
const amounts = [20, 30, 40];
let frame = 0
let winningScore = 3
let resources = []
let score = 0
let youWon = false
let numberOfResources = 0
let crush = false
// const GRAVITY = 0.98
let timeLeftDom = 0
let soundOn = 0

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

class Resources {
  constructor(x,y){
   this.x = c.width  // <-- para que los recursos no salgan tanto a la derecha (100px)
   // redondea por las 5 columnas y multiplica para que sea multiplos de 100/200/300/400/500 
   //y para que salgan en medio del cuadro de 100x100 le sumamos 25 de alto
   this.y = c.height -50
  // Do this randomly in Y: ((Math.floor(Math.random() * c.height) -30 ));
   this.width = size * 1.5;
   this.height  = size * 1.5;
   this.amount = amounts[Math.floor(Math.random()* amounts.length)]; // <-- random de recursos generados
   this.frameX = 0;  //<--- num de frames en la fila
   this.frameY = 0; //<--- si hay varias filas seria el numero de filas 
   this.minFrame = 0; //
   this.maxFrame = 5;
   this.spriteWidth = 30; // <-- cuando frame X es 0 se le suma el ancho y empieza el nuevo FrameX en el ancho 144 (cortando)
   this.spriteHeight = 30;
   this.coinTouch = new Audio()
   this.coinTouch.src = "coin-touch.wav"
  }
  draw(){
    this.x -= 1.2
      // ctx.fillStyle = 'yellow';
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = 'white';
      ctx.font = '20px Orbitron';
      ctx.fillText("₿", this.x+2, this.y);
      ctx.drawImage(coin, this.frameX * this.spriteWidth + 5.8,0, this.spriteWidth, this.spriteHeight, this.x, this.y,this.width, this.height);

  
    }
  update(){
      if (frame % 10 === 0) {
           if (this.frameX < this.maxFrame) {
               this.frameX ++;
           } else {
               this.frameX = this.minFrame = 0;
           }    
       }
}
isTouching(player) {
  return (
    this.x < player.x + player.width &&
    this.x + this.width > player.x &&
    this.y < player.y + player.height &&
    this.y + this.height > player.y
  );
}
}

class Timer extends GameAsset {
constructor() {
super();
this.timeleft = 15
this.countDown = new Audio()
this.countDown.src = "countdown.wav"
this.countDownCero = new Audio()
this.countDownCero.src = "runOutOfTime.mp3"
}

timerOn() {
  
  if (youWon === true) {
    document.getElementById("time-left").innerHTML = "WINNER!"
    
  }
  
  if (frame % 60 === 0 && !youWon) {
    this.timeleft --

timeLeftDom = this.timeleft + "s"
document.getElementById("time-left").innerHTML = timeLeftDom
  }


if(this.timeleft <= 6 && this.timeleft >= 4 && !youWon) {
  document.getElementById("time-left").innerHTML = `<span style="color:#E8CF00">  
  ${timeLeftDom}</span>`
}
if(this.timeleft <= 3 && !youWon) {
  document.getElementById("time-left").innerHTML = `<span style="color:#FF0000">  
  ${timeLeftDom}</span>`
  countdownTimerGame.shootCountDownSound()

}
if (this.timeleft == 0) {
  isGameOver = true
  countdownTimerGame.countDown.pause()
  countdownTimerGame.shootCountDownCero() 

}
}

stopCountDownSound() {
countdownTimerGame.countDown.pause()
}

shootCountDownSound() {
  this.countDown.volume = 0.1
  countdownTimerGame.countDown.play()
}

shootCountDownCero() {
  this.countDownCero.volume = 0.1
  countdownTimerGame.countDownCero.play()
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
        this.image.src = "images/1440132437-vector-removebg-preview (1).png";
        this.audio = new Audio();
        this.audio.src = "mixkit-bicycle-pedal-accelerating-2104.wav"
        this.lose = new Image()
        this.won = new Image()
        this.won.src = "images/you-won.png"
        this.lose.src = "images/game-over.jpg"
        this.loseAudio = new Audio()
        this.loseAudio.src = "zapsplat_impacts_body_hit_ground_heavy_thud_001_43759.mp3"
        this.loseMusic = new Audio()
        this.loseMusic.src="mixkit-funny-game-over-2878.wav"
        this.winningSound = new Audio()
        this.winningSound.src = "you-won.mp3"
        this.vy = 0
    }

draw() {
        // this.vy = GRAVITY
        // this.y += this.vy

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
          isGameOver = true
          crush = true
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
    
    if(youWon ===true) {
      ctx.drawImage(player.won, 0, 0, c.width, c.height); 
    }

    if (isGameOver === true && youWon === false) {
        ctx.drawImage(player.lose, 0, 0, c.width, c.height); 

    
    } else {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.image, -size, -size, 40, 40);
        ctx.restore();
      }
    }

jump() {
  this.vy -=5
}

shootPedalingSound() {
		this.audio.volume = 0.1;
        this.audio.play();
    }        
    
stopPedalingSound() {
        this.audio.pause();
    }

shootCrushSound() {
		this.loseAudio.volume = 0.05;
        this.loseAudio.play();
    }    
shootMusicSound() {
		this.loseMusic.volume = 0.05;
        this.loseMusic.play();
    }      
shootWinnerSound() {
  this.winningSound.volume = 0.1
  this.winningSound.play(); 
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


playerImage = "images/1440132437-vector-removebg-preview (1).png"
let player = new Character(-15,-15,50,50,playerImage)
timerImage = "images/1440132437-vector-removebg-preview (1).png"
let countdownTimerGame = new Timer()

function start() {
	if (intervalId) return;
	intervalId = setInterval(() => {
    update()
    countdownTimerGame.timerOn()
    
	}, 1000 / 60);
}

function gameOver() {
	if (isGameOver) {
    player.stopPedalingSound()    
    countdownTimerGame.stopCountDownSound()
    player.shootCrushSound()
    player.shootMusicSound()
    restart();
  }
}

function youCryptoWinner() {
  if (youWon === true && soundOn === 0) {
  
    player.stopPedalingSound()
    countdownTimerGame.stopCountDownSound()  
    player.shootWinnerSound() 
    soundOn += 1
    ctx.restore();
  }
}

function update() {
    player.loop();
    player.draw();
    checkKeys();
    gameOver();
    frame++
    checkCollitions()
    handleResources()
    youCryptoWinner()
    

}

function checkKeys() {
onkeydown = d => k[d.key] = 1;

onkeyup = d => k[d.key] = 0;

if(onkeyup && !youWon) {
player.shootPedalingSound()
}

// if(onkeydown) {
// player.stopPedalingSound()
// }
}

function checkCollitions() {
  for (let i=0; i < resources.length; i++) {
    if (resources[i].isTouching(player)) {
      score +=1;
      resources[i].coinTouch.play()
    numberOfResources += resources[i].amount;
            resources.splice(i,1);
            i --;
    document.getElementById("coins-captured").innerHTML = score
    }
    if (score === winningScore) {
      youWon = true
    }
  };
}


function handleResources() {
  if (frame % 230 === 0 && score < winningScore){   // <-- cada 100 frames crea un recurso (instancia) que se empuja al arreglo SI el score es menor al WINNINGSCORE
      resources.push(new Resources());
  } 
  for (let i = 0; i < resources.length; i++) {
      resources[i].draw();
      resources[i].update();
      } 
  }

function restart() {
    clearInterval(intervalId);
    setTimeout(function () {
    
  }, 6000)
    // intervaIdEnd = setInterval(() => {
    // },1000 / 60);
    // if (intervalIdEnd === 3) {
      // document.location.reload()
    }
   
    function buttonReset() {
    $buttonRestart.addEventListener("click", event => {
      window.location.reload()
    } )  
  }


    $button.addEventListener("click", event => {
      start()
    } )  
    
    