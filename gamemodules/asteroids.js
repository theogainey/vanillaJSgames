var canvas;
var ctx;
var canvasDiv;
var gameHeadingDiv;
var buttonDiv;
var newGameButton;
var killable=false;
var spaceShip;
var bullets={};
var asteroids={};
var score=0;
var drawInterval;
var asteroidInterval;
var asteroidIntervalTime =2000;
var sliderDiv;
var shipSize=20;
var shipSpeed=10;
var shipAngularVelocity=10;
var shipAngularVelocitySlider;
var asteroidMaxSpeed=100;
var asteroidMinSpeed=20;
var asteroidMaxSize=20;
var asteroidMinSize=5;

export function unloadAsteroids(){
  gameHeadingDiv.remove();
  buttonDiv.remove();
  canvasDiv.remove();
  sliderDiv.remove();
  clearInterval(drawInterval);
  clearInterval(asteroidInterval);

}


export function initAsteroids(){
  gameHeadingDiv = document.createElement("div");
  gameHeadingDiv.setAttribute("id", "gameHeadingDiv") ;
  document.getElementById("mainSection").appendChild(gameHeadingDiv);
  var heading =  document.createElement("h1");
  heading.innerHTML = "Asteroid's Playground";
  document.getElementById("gameHeadingDiv").appendChild(heading);
  canvasDiv = document.createElement("div");
  canvasDiv.setAttribute("id", "canvasDiv") ;
  document.getElementById("mainSection").appendChild(canvasDiv);
  canvas = document.createElement("canvas");
  canvas.setAttribute("height", 450);
  canvas.setAttribute("width", 700);
  document.getElementById("canvasDiv").appendChild(canvas);
  sliderDiv = document.createElement("div");
  sliderDiv.setAttribute("id", "sliderDiv") ;
  sliderDiv.setAttribute("class", "asteroidsSettingsDiv") ;
  buttonDiv  = document.createElement("div");
  buttonDiv.setAttribute("id", "buttonDiv") ;
  buttonDiv.setAttribute("class", "buttonDiv") ;
  document.getElementById("mainSection").appendChild(buttonDiv);
  newGameButton = document.createElement("button");
  newGameButton.innerHTML = "New Game";
  document.getElementById("buttonDiv").appendChild(newGameButton);
  newGameButton.addEventListener('click',(e) => {
    handleNewGameButton();
  });
  document.getElementById("mainSection").appendChild(sliderDiv);
  addShipSliders();
  addAsteriodSliders();
  ctx = canvas.getContext('2d');
  spaceShip = new SpaceShip();
  document.addEventListener("keydown", event => {
    event.preventDefault();
    spaceShip.doSomething(event);
  });
  drawInterval = setInterval(draw, 10);
  asteroidInterval = setInterval(newAsteroid, asteroidIntervalTime);
}
function handleNewGameButton(){
  clearInterval(drawInterval);
  clearInterval(asteroidInterval);
  score=0;
  spaceShip = new SpaceShip();
  bullets={};
  asteroids={};
  drawInterval = setInterval(draw, 10);
  asteroidInterval = setInterval(newAsteroid, 2000);
}
function draw() {
  ctx.fillStyle = '#303030';
  ctx.fillRect(0, 0, 700, 700);
  spaceShip.drawShip();
  if (bullets) {
    Object.keys(bullets).forEach((item) => {
      bullets[item].move()
    });
  }
  if (asteroids) {
    Object.keys(asteroids).forEach((item) => {
      asteroids[item].move();
      if (bullets && asteroids[item] && spaceShip ) {
        Object.keys(bullets).forEach((b) => {
          let bulletX = bullets[b].x;
          let bulletY = bullets[b].y;
          if (asteroids[item]) {
            let asteroidX = asteroids[item].x;
            let asteroidY = asteroids[item].y;
            let asteroidsSize = asteroids[item].size;
          if (bulletX>= asteroidX -asteroidsSize && bulletX<= asteroidX+asteroidsSize) {
            if (bulletY>= asteroidY -asteroidsSize && bulletY<= asteroidY+asteroidsSize) {
              asteroids[item].blowUp();
              bullets[b].explode();
              score++;
            }
          }

        }
        });
        if (asteroids[item] && killable) {
        let spaceShipX = spaceShip.pos[0];
        let spaceShipY = spaceShip.pos[1];
        let spaceShipR = shipSize*(2/3);
        // if distace betweem spaceship and asteroids venter less than spaceShipR check if point is isInsideShip
        let asteroidX = asteroids[item].x;
        let asteroidY = asteroids[item].y;
        let asteroidSize = asteroids[item].size;
        let distaceBetweenCenters = Math.sqrt(((asteroidX - spaceShipX)**2) +((asteroidY - spaceShipY)**2 ));
        if (distaceBetweenCenters  < (asteroidSize + spaceShipR)) {
                gameOver();
        }
      }
      }
    });
  }

  ctx.textAlign = 'right';
  ctx.font = '18px serif';
  ctx.fillStyle='#fff';
  ctx.fillText('Score ' + score.toString(), 600, 400);
}
function gameOver(){
  clearInterval(drawInterval);
  clearInterval(asteroidInterval);
  ctx.textAlign = 'center';
  ctx.font = '24px serif';
  ctx.fillStyle='#fff';
  ctx.fillText('Game Over ', 350, 200);
}

function newAsteroid(){
  var xStart;
  var yStart;
  var xEnd;
  var yEnd;
  var speed = Math.floor(Math.random() * (asteroidMaxSpeed - asteroidMinSpeed) + asteroidMinSpeed);
  var size = Math.floor(Math.random() * (asteroidMaxSize - asteroidMinSize) + asteroidMinSize);
  var xOrY =Math.floor(Math.random() * 2);
  if (xOrY===1) {
    xStart =0;
    yStart = Math.floor(Math.random() * 450);
    xEnd = Math.floor(Math.random() * 700);
    yEnd= Math.floor(Math.random() * 450);
    new Asteroid(xStart, yStart, xEnd, yEnd, size, speed);
  }
   if (xOrY===0) {
    xStart = Math.floor(Math.random() * 700);
    yStart = 0;
    xEnd = Math.floor(Math.random() * 700);
    yEnd= Math.floor(Math.random() * 450);
    new Asteroid(xStart, yStart, xEnd,  yEnd, size, speed);
  }
}


class SpaceShip{
  constructor(){
    this.pos=[350, 225];
//    this.h= shipSize;
    this.theta= Math.PI/2;
  }
  drawShip(){
    ctx.strokeStyle = '#fff'
    ctx.beginPath();
    ctx.moveTo(this.pos[0] + (2/3)*shipSize*Math.cos(this.theta), this.pos[1] - (2/3)*shipSize*Math.sin(this.theta));
    ctx.lineTo(this.pos[0] - (1/3)*shipSize*Math.cos(this.theta) + (shipSize/Math.sqrt(3))*Math.cos((Math.PI/2)-this.theta), this.pos[1] + (1/3)*shipSize*Math.sin(this.theta)+ (shipSize/Math.sqrt(3))*Math.sin((Math.PI/2)+this.theta));
    ctx.lineTo(this.pos[0] - (1/3)*shipSize*Math.cos(this.theta) - (shipSize/Math.sqrt(3))*Math.cos((Math.PI/2)-this.theta), this.pos[1] + (1/3)*shipSize*Math.sin(this.theta)- (shipSize/Math.sqrt(3))*Math.sin((Math.PI/2)+this.theta));
    ctx.closePath();
    ctx.stroke();

  }
  doSomething(e){
    if (e.key==="ArrowRight") {
      this.theta= this.theta - ((Math.PI/180)*shipAngularVelocity);
    }
    if (e.key==="ArrowLeft") {
      this.theta= this.theta + ((Math.PI/180)* shipAngularVelocity);
    }
    if (e.key==="ArrowUp") {
      this.pos[0]= this.pos[0] + shipSpeed*Math.cos(this.theta);
      this.pos[1]= this.pos[1] - shipSpeed*Math.sin(this.theta);
    }
    if (e.key==="ArrowDown") {
      this.pos[0]= this.pos[0] - shipSpeed*Math.cos(this.theta);
      this.pos[1]= this.pos[1] + shipSpeed*Math.sin(this.theta);
    }
    if (e.code==="Space" && e.repeat===false) {
      new SpaceBullet(this.pos[0] + (2/3)*shipSize*Math.cos(this.theta), this.pos[1] - (2/3)*shipSize*Math.sin(this.theta), this.theta);
    }
    if (this.pos[0]>699) {
      this.pos[0]=0;
    }
    else if (this.pos[0]<1) {
      this.pos[0]=700;
    }
    if (this.pos[1]<1) {
      this.pos[1]= 450;
    }
    else if (this.pos[1]>450) {
      this.pos[1]= 0;
    }
  }
}

class SpaceBullet {
  constructor(x,y, theta) {
    this.x=x;
    this.y=y;
    this.theta= theta;
    this.speed=1;
    this.key = x * y * theta * Math.random();
    bullets[this.key]=this;
    this.drawBullet();
  }
  drawBullet(){
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  explode(){
    delete bullets[this.key];

  }
  move(){
    this.x= this.x + this.speed*Math.cos(this.theta);
    this.y = this.y - this.speed*Math.sin(this.theta);
    if (this.x>700 || this.x<0 || this.y<0 || this.y>450) {
      delete bullets[this.key];
    }
    this.drawBullet();
  }
}

class Asteroid {
  constructor(x, y, xEnd, yEnd, size, speed) {
    this.x=x;
    this.y=y;
    this.size= size;
    this.theta=  Math.atan2((yEnd-y), (xEnd-x));
    this.speed= speed* .01;
    this.key = x * y + 1000* Math.random();
    asteroids[this.key]=this;
  }
  drawAsteroid(){
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  move(){
    this.x= this.x + this.speed*Math.cos(this.theta);
    this.y = this.y + this.speed*Math.sin(this.theta);
    if (this.x>700 || this.x<0 || this.y<0 || this.y>450) {
      delete asteroids[this.key];
    }
    this.drawAsteroid();
  }

  blowUp(){
    delete asteroids[this.key];
  }
}

function addAsteriodSliders(){
  //Max Speed slider
  var aMaxSpeedDiv = document.createElement("div");
  aMaxSpeedDiv.setAttribute("id", "aMaxSpeedDiv");
  aMaxSpeedDiv.setAttribute("class", "settingDiv");
  var aMaxSpeedLabel = document.createElement("H3");
  aMaxSpeedLabel.innerHTML= "Max Asteroid Speed " + asteroidMaxSpeed.toString();
  var aMaxSpeedSlider= document.createElement("INPUT");
  aMaxSpeedSlider.setAttribute("type", "range");
  aMaxSpeedSlider.setAttribute("min", "20");
  aMaxSpeedSlider.setAttribute("max", "400");
  aMaxSpeedSlider.setAttribute("value", asteroidMaxSpeed);
  aMaxSpeedSlider.onchange = ()=> {
    let newSpeed = parseInt(aMaxSpeedSlider.value);
    if (newSpeed>= asteroidMinSpeed) {
      asteroidMaxSpeed = newSpeed;
    }
    else {
      asteroidMaxSpeed = asteroidMinSpeed;
      aMaxSpeedSlider.value= asteroidMinSpeed;
    }
    aMaxSpeedLabel.innerHTML= "Max Asteroid Speed " + asteroidMaxSpeed.toString();
  };
  document.getElementById("sliderDiv").appendChild(aMaxSpeedDiv);
  document.getElementById("aMaxSpeedDiv").appendChild(aMaxSpeedLabel);
  document.getElementById("aMaxSpeedDiv").appendChild(aMaxSpeedSlider);

  //Min Speed slider
  var aMinSpeedDiv = document.createElement("div");
  aMinSpeedDiv.setAttribute("id", "aMinSpeedDiv");
  aMinSpeedDiv.setAttribute("class", "settingDiv");
  var aMinSpeedLabel = document.createElement("H3");
  aMinSpeedLabel.innerHTML= "Min Asteroid Speed " + asteroidMinSpeed.toString();
  var aMinSpeedSlider= document.createElement("INPUT");
  aMinSpeedSlider.setAttribute("type", "range");
  aMinSpeedSlider.setAttribute("min", "10");
  aMinSpeedSlider.setAttribute("max", "100");
  aMinSpeedSlider.setAttribute("value", asteroidMinSpeed);
  aMinSpeedSlider.onchange = ()=> {
    let newSpeed = parseInt(aMinSpeedSlider.value);
    if (newSpeed<= asteroidMaxSpeed) {
      asteroidMinSpeed = newSpeed;
    }
    else {
      asteroidMinSpeed = asteroidMaxSpeed;
      aMinSpeedSlider.value = asteroidMaxSpeed;
    }
    aMinSpeedLabel.innerHTML= "Min Asteroid Speed " + asteroidMinSpeed.toString();
  };
  document.getElementById("sliderDiv").appendChild(aMinSpeedDiv);
  document.getElementById("aMinSpeedDiv").appendChild(aMinSpeedLabel);
  document.getElementById("aMinSpeedDiv").appendChild(aMinSpeedSlider);

  //Max Size slider
  var aMaxSizeDiv = document.createElement("div");
  aMaxSizeDiv.setAttribute("id", "aMaxSizeDiv");
  aMaxSizeDiv.setAttribute("class", "settingDiv");
  var aMaxSizeLabel = document.createElement("H3");
  aMaxSizeLabel.innerHTML= "Max Asteroid Size " + asteroidMaxSize.toString();
  var aMaxSizeSlider= document.createElement("INPUT");
  aMaxSizeSlider.setAttribute("type", "range");
  aMaxSizeSlider.setAttribute("min", "10");
  aMaxSizeSlider.setAttribute("max", "100");
  aMaxSizeSlider.setAttribute("value", asteroidMaxSize);
  aMaxSizeSlider.onchange = ()=> {
    let newMaxSize = parseInt(aMaxSizeSlider.value);
    if (newMaxSize >= asteroidMinSize) {
      asteroidMaxSize = newMaxSize;
    }
    else {
      aMaxSizeSlider.value = asteroidMinSize;
      asteroidMaxSize = asteroidMinSize;
    }
    aMaxSizeLabel.innerHTML= "Max Asteroid Size " + asteroidMaxSize.toString();
  };
  document.getElementById("sliderDiv").appendChild(aMaxSizeDiv);
  document.getElementById("aMaxSizeDiv").appendChild(aMaxSizeLabel);
  document.getElementById("aMaxSizeDiv").appendChild(aMaxSizeSlider);

  //Max Size slider
  var aMinSizeDiv = document.createElement("div");
  aMinSizeDiv.setAttribute("id", "aMinSizeDiv") ;
  aMinSizeDiv.setAttribute("class", "settingDiv");
  var aMinSizeLabel = document.createElement("H3");
  aMinSizeLabel.innerHTML= "Min Asteroid Size " + asteroidMinSize.toString();
  var aMinSizeSlider= document.createElement("INPUT");
  aMinSizeSlider.setAttribute("type", "range");
  aMinSizeSlider.setAttribute("min", "1");
  aMinSizeSlider.setAttribute("max", "100");
  aMinSizeSlider.setAttribute("value", asteroidMinSize);
  aMinSizeSlider.onchange = ()=> {
    let newMinSize = parseInt(aMinSizeSlider.value);
    if (newMinSize <= asteroidMaxSize) {
      asteroidMinSize = newMinSize;
    }
    else {
      aMinSizeSlider.value = asteroidMaxSize;
      asteroidMinSize = asteroidMaxSize;
    }

    aMinSizeLabel.innerHTML= "Min Asteroid Size " + asteroidMinSize.toString();
  };
  document.getElementById("sliderDiv").appendChild(aMinSizeDiv);
  document.getElementById("aMinSizeDiv").appendChild(aMinSizeLabel);
  document.getElementById("aMinSizeDiv").appendChild(aMinSizeSlider);

//Asteroid interval slider
  var aTimeDiv = document.createElement("div");
  aTimeDiv.setAttribute("id", "aTimeDiv") ;
  aTimeDiv.setAttribute("class", "settingDiv");
  var aTimeLabel = document.createElement("H3");
  aTimeLabel.innerHTML= "Time Between Asteroids " + asteroidIntervalTime.toString();
  var aTimeSlider= document.createElement("INPUT");
  aTimeSlider.setAttribute("type", "range");
  aTimeSlider.setAttribute("min", "100");
  aTimeSlider.setAttribute("max", "5000");
  aTimeSlider.setAttribute("value", asteroidIntervalTime);
  aTimeSlider.onchange = ()=> {
    clearInterval(asteroidInterval);
    asteroidIntervalTime= parseInt(aTimeSlider.value)
    asteroidInterval = setInterval(newAsteroid, asteroidIntervalTime);
    aTimeLabel.innerHTML= "Time Between Asteroids(ms) " + asteroidIntervalTime.toString();
  };
  document.getElementById("sliderDiv").appendChild(aTimeDiv);
  document.getElementById("aTimeDiv").appendChild(aTimeLabel);
  document.getElementById("aTimeDiv").appendChild(aTimeSlider);

}

function addShipSliders(){
  //Ship killable
  var killableDiv = document.createElement("div");
  killableDiv.setAttribute("id", "killableDiv") ;
  killableDiv.setAttribute("class", "settingDiv") ;
  var killableLabel = document.createElement("H3");
  killableLabel.innerHTML= "Check Box To Make Ship Destroyable";
  var killableButton= document.createElement("INPUT");
  killableButton.setAttribute("type", "checkbox");
  killableButton.onchange = ()=> {
    killable = !(killable);
  };
  document.getElementById("sliderDiv").appendChild(killableDiv);
  document.getElementById("killableDiv").appendChild(killableLabel);
  document.getElementById("killableDiv").appendChild(killableButton);

  //ship size
  var shipSizeDiv = document.createElement("div");
  shipSizeDiv.setAttribute("id", "shipSizeDiv") ;
  shipSizeDiv.setAttribute("class", "settingDiv") ;
  var shipSizeLabel = document.createElement("H3");
  shipSizeLabel.innerHTML= "Ship Size " + shipSize.toString();
  var shipSizeSlider= document.createElement("INPUT");
  shipSizeSlider.setAttribute("type", "range");
  shipSizeSlider.setAttribute("min", "10");
  shipSizeSlider.setAttribute("max", "100");
  shipSizeSlider.setAttribute("value", shipSize);
  shipSizeSlider.onchange = ()=> {
    shipSize = parseInt(shipSizeSlider.value);
    shipSizeLabel.innerHTML= "Ship Size " + shipSize.toString();
  };
  document.getElementById("sliderDiv").appendChild(shipSizeDiv);
  document.getElementById("shipSizeDiv").appendChild(shipSizeLabel);
  document.getElementById("shipSizeDiv").appendChild(shipSizeSlider);

  //ship speed
  var speedDiv = document.createElement("div");
  speedDiv.setAttribute("id", "speedDiv") ;
  speedDiv.setAttribute("class", "settingDiv") ;
  var speedLabel = document.createElement("H3");
  speedLabel.innerHTML= "Ship Speed " + shipSpeed.toString();
  var shipSpeedSlider= document.createElement("INPUT");
  shipSpeedSlider.setAttribute("type", "range");
  shipSpeedSlider.setAttribute("min", "1");
  shipSpeedSlider.setAttribute("max", "100");
  shipSpeedSlider.setAttribute("value", shipSpeed);
  shipSpeedSlider.onchange = ()=> {
    shipSpeed = parseInt(shipSpeedSlider.value);
    speedLabel.innerHTML= "Ship Speed " + shipSpeed.toString();
  };
  document.getElementById("sliderDiv").appendChild(speedDiv);
  document.getElementById("speedDiv").appendChild(speedLabel);
  document.getElementById("speedDiv").appendChild(shipSpeedSlider);

  // shipAngularVelocity
  var angularDiv =document.createElement("div");
  angularDiv.setAttribute("id", "angularDiv") ;
  angularDiv.setAttribute("class", "settingDiv") ;
  var avLabel = document.createElement("H3");
  avLabel.innerHTML= "Ship Angular Velocity " + shipAngularVelocity.toString();
  var shipAngularVelocitySlider= document.createElement("INPUT");
  shipAngularVelocitySlider.setAttribute("type", "range");
  shipAngularVelocitySlider.setAttribute("min", "1");
  shipAngularVelocitySlider.setAttribute("max", "90");
  shipAngularVelocitySlider.setAttribute("value", shipAngularVelocity);
  shipAngularVelocitySlider.onchange = ()=> {
    shipAngularVelocity = parseInt(shipAngularVelocitySlider.value);
    avLabel.innerHTML= "Ship Angular Velocity " + shipAngularVelocity.toString();
  };
  document.getElementById("sliderDiv").appendChild(angularDiv);
  document.getElementById("angularDiv").appendChild(avLabel);
  document.getElementById("angularDiv").appendChild(shipAngularVelocitySlider);

}
