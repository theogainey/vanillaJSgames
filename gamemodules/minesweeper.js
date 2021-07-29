var canvas;
var ctx;
var squares;
var flagCounterObject;
var game;
var prevN;
var gameStatus;
var resetButon;
var gameCondition;
var gameHeadingDiv;
var buttonDiv;
var canvasDiv;
var instructionsDiv;
export function unloadMineSweeper(){
  gameHeadingDiv.remove();
  buttonDiv.remove();
  canvasDiv.remove();
  instructionsDiv.remove();
}

export function initMineSweeper() {
  gameHeadingDiv = document.createElement("div");
  gameHeadingDiv.setAttribute("id", "gameHeadingDiv") ;
  buttonDiv  = document.createElement("div");
  buttonDiv.setAttribute("id", "buttonDiv") ;
  canvasDiv = document.createElement("div");
  canvasDiv.setAttribute("id", "canvasDiv") ;
  document.getElementById("mainSection").appendChild(gameHeadingDiv);
  document.getElementById("mainSection").appendChild(canvasDiv);
  document.getElementById("mainSection").appendChild(buttonDiv);
  var heading =  document.createElement("h1");
  heading.innerHTML = "Minesweeper";
  document.getElementById("gameHeadingDiv").appendChild(heading);

  instructionsDiv = document.createElement("div");
  instructionsDiv.setAttribute("id", "instructionsDiv");
  instructionsDiv.setAttribute("class", "instructions");

  document.getElementById("mainSection").appendChild(instructionsDiv);

  var instructionsH2 = document.createElement("h2");
  instructionsH2.innerHTML="Instructions";
  var instructionsP = document.createElement("p");
  instructionsP.innerHTML = "Click a square to reveal if it contains a mine. When clicked, if a square does not contain a mine, the square will reveal the number of mines adjacent to the square. If the square contains no adjacent mines, all adjacent squares will be automatically clicked for you. Hold the shift key then click to flag a square you believe contains a mine. The game is won when all squares containing mines are marked with flags and every square not containing a mine is clicked. IIf you click a square containing a mine, you lose.";
  document.getElementById("instructionsDiv").appendChild(instructionsH2);
  document.getElementById("instructionsDiv").appendChild(instructionsP);


  canvas = document.createElement("canvas");
  canvas.setAttribute("width", 506);
  canvas.setAttribute("height", 406);
  document.getElementById("canvasDiv").appendChild(canvas);
  ctx = canvas.getContext('2d');
  canvas.addEventListener('click',(e) => {
    if(gameCondition==="play"){
      mousePressed(e);
    }
  });
  resetButon = document.createElement("button");
  resetButon.innerHTML = "New Game";
  document.getElementById("buttonDiv").appendChild(resetButon);
  resetButon.addEventListener('click',(e) => {
    handleNewGameButton();
  });
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, 506, 406);
  prevN=10;
  gameCondition="play";
  game = new MineSweeperGame(10);
}
function handleNewGameButton(){
  gameCondition="play";
  game = null;
  clearGame();
  game = new MineSweeperGame(10);
}
function clearGame(){
  squares=[];
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, 506, 406);
}
function mousePressed(e){
  if (e.shiftKey) {
    squares.forEach((item) => {
      item.flagHandler(e.offsetX, e.offsetY);
    });
  }
  else {
    squares.forEach((item) => {
      item.clickHandler(e.offsetX, e.offsetY);
    });
  }
}
class MineSweeperGame{
  constructor(n){
    let sqID=0;
    squares= getSquareProperties(n);
    for (var i = 0; i < n; i++) {
      for (var ii = 0; ii < n; ii++) {
        let sq = new MineSquare( (i*40+2), (ii*40+2), 40, squares[sqID]);
        squares[sqID]=sq;
        sqID++;
      }
    }
    flagCounterObject = new FlagCounter(n, 414, 10, 80);
    gameStatus = new GameStatusBox(n, 414, 110, 80);
  }
}
class GameStatusBox{
  constructor(n, x, y, size){
    this.x=x;
    this.y=y;
    this.squares = n*n;
    this.squaresClicked=0;
    this.size=size;
    ctx.fillStyle ='white';
    ctx.fillRect(x, y, size, size);
  }
  lostGame(){
    gameCondition="lost";
    ctx.fillStyle= 'black';
    ctx.textAlign = 'center';
    ctx.fillText("Game Over", this.x+(this.size/2), this.y+(this.size/2))
  }
  clickSquare(condition){
    if (condition==="click") {
      this.squaresClicked++;
      if (this.squaresClicked === this.squares) {
        gameCondition==="win";
        ctx.fillStyle ='black';
        ctx.textAlign = 'center';
        ctx.fillText("Winner!", this.x+(this.size/2), this.y+(this.size/2))
      }
    }
    else if (condition==="unclick" && this.squaresClicked>0) {
      this.squaresClicked--;
    }
  }
}
class FlagCounter{
  constructor(n, x, y, size){
    this.flagsLeft =n;
    this.x=x;
    this.y=y;
    this.size=size;
    ctx.fillStyle ='white';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle ='black';
    ctx.textAlign = 'center';
    ctx.fillText("Mines:"+ this.flagsLeft.toString(), x+(size/2), y+(size/2))
  }
  handleFlagEvent(condition){
    if (condition==="sub") {
      this.flagsLeft= this.flagsLeft-1;
    }
    if (condition==="add") {
      this.flagsLeft= this.flagsLeft+1;
    }
    ctx.fillStyle ='white';
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.fillStyle ='black';
    ctx.textAlign = 'center';
    ctx.fillText("Mines:"+ this.flagsLeft.toString(), this.x+(this.size/2), this.y+(this.size/2))
  }
}

class MineSquare{
  constructor(x, y, size, properties){
    this.x=x;
    this.y=y;
    this.size = size;
    this.condition="unclicked";
    ctx.fillStyle ='white';
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x+1, y+1, size-2, size-2);
    this.id=properties.id;
    this.adjacentIDs = properties.adjacentSquareIDS;
    this.bombStatus=properties.isBomb;
    this.adjacentBombs = properties.adjacentBombs;
  }
  flagHandler(pointX, pointY){
    if (pointX> this.x && pointX <(this.x+this.size)) {
      if(pointY> this.y && pointY <(this.y+this.size)){
        if(this.condition==="unclicked"){
          this.condition="flag";
          ctx.fillStyle ='white';
          ctx.fillRect(this.x, this.y, this.size, this.size);
          ctx.strokeRect(this.x+1, this.y+1, this.size-2, this.size-2);
          ctx.beginPath();
          ctx.moveTo(this.x+(this.size/4), this.y+(this.size/8));
          ctx.lineTo(this.x+ (this.size-(this.size/4)), this.y+((this.size/2)- this.size/8));
          ctx.lineTo(this.x+(this.size/4), this.y+((this.size/2)+ this.size/8));
          ctx.fillStyle ='red';
          ctx.fill();
          ctx.closePath();
          ctx.lineTo(this.x+(this.size/4), this.y+this.size);
          ctx.stroke();
          ctx.closePath();
          flagCounterObject.handleFlagEvent("sub");
          gameStatus.clickSquare("click");
        }
        else if (this.condition==="flag") {
          this.condition="unclicked"
          ctx.fillStyle ='white';
          ctx.fillRect(this.x, this.y, this.size, this.size);
          ctx.strokeRect(this.x+1, this.y+1, this.size-2, this.size-2);
          flagCounterObject.handleFlagEvent("add");
          gameStatus.clickSquare("unclick");
        }
      }
    }
  }
  clickHandler(pointX, pointY){
    if (pointX> this.x && pointX <(this.x+this.size)) {
      if(pointY> this.y && pointY <(this.y+this.size)){
        this.clickSquare();
      }
    }
  }
  clickSquare(){
    if (this.bombStatus === true) {
      ctx.fillStyle ='red';
      ctx.fillRect(this.x, this.y, this.size, this.size);
      gameStatus.lostGame();
    }
    else if(this.condition==="unclicked"){
      this.condition="clicked";
      if (this.adjacentBombs===0) {
        clickAdjacentSquares(this.id);
        ctx.fillStyle='white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
      else {
        ctx.fillStyle ='white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeRect(this.x+1, this.y+1, this.size-2, this.size-2);
        ctx.fillStyle='black';
        ctx.textAlign = 'center';
        ctx.fillText(this.adjacentBombs.toString(), this.x+(this.size/2), this.y+(this.size/2));
      }
      gameStatus.clickSquare("click");
    }
  }
}
function clickAdjacentSquares(id){
  var thisIDS=squares[id].adjacentIDs;
  thisIDS.forEach((item) => {
    let tempSquare=squares[item];
    tempSquare.clickSquare();
  });
}
function getSquareProperties(n){
  var returnArray = [];
  var randomBombIds = new Array(n);
  randomBombIds.fill(-1);
  var bombID =-1
  for (var i = 0; i < n; i++) {
    while (randomBombIds.includes(bombID)) {
       bombID = Math.floor(Math.random() * (n*n));
    }
    randomBombIds[i]=bombID;
  }
  var squareID=0;
  var tempSquare;
  var tempRow=[];
  for (var i = 0; i < n; i++) {
    tempRow=[];
    for (var ii = 0; ii < n; ii++) {
      if(randomBombIds.includes(squareID)) {
         tempSquare={
          id: squareID,
          isBomb: true,
          adjacentBombs: 0,
          adjacentSquareIDS:[],
        };
      }
      else {
         tempSquare={
          id: squareID,
          isBomb: false,
          adjacentBombs: 0,
          adjacentSquareIDS:[],
        };
      }
      tempRow.push(tempSquare);
      squareID++;
    }
    returnArray.push(tempRow)
  }
  for (let y = 0; y < n; y++) {
    tempRow = returnArray[y];
    for (let x = 0; x < tempRow.length; x++) {
      if(tempRow[x].isBomb===true){
        //up
        if ((y+1)<n) {
          if (returnArray[y+1][x].isBomb===false) {
              returnArray[y+1][x].adjacentBombs++;
          }
          tempRow[x].adjacentSquareIDS.push(returnArray[y+1][x].id);
        }
        //down
        if ((y-1)>=0) {
          if (returnArray[y-1][x].isBomb===false) {
              returnArray[y-1][x].adjacentBombs++;
          }
          tempRow[x].adjacentSquareIDS.push(returnArray[y-1][x].id);
        }
        //right
        if ((x+1)<tempRow.length) {
          if (returnArray[y][x+1].isBomb===false) {
              returnArray[y][x+1].adjacentBombs++;
            }
          tempRow[x].adjacentSquareIDS.push(returnArray[y][x+1].id);
        }
        if ((x-1)>=0) {
          if (returnArray[y][x-1].isBomb===false) {
              returnArray[y][x-1].adjacentBombs++;
          }
          tempRow[x].adjacentSquareIDS.push(returnArray[y][x-1].id);
        }
        //Up and Left
        if (((y-1)>=0) && ((x-1)>=0)) {
          if (returnArray[y-1][x-1].isBomb===false) {
              returnArray[y-1][x-1].adjacentBombs++;
          }
          tempRow[x].adjacentSquareIDS.push(returnArray[y-1][x-1].id);
        }
        //Up and Right
        if (((y-1)>=0) && ((x+1)<tempRow.length)) {
          if (returnArray[y-1][x+1].isBomb===false) {
              returnArray[y-1][x+1].adjacentBombs++;
          }
          tempRow[x].adjacentSquareIDS.push(returnArray[y-1][x+1].id);
        }
        //down and Left
        if (((y+1)<n) && ((x-1)>=0)) {
          if (returnArray[y+1][x-1].isBomb===false) {
              returnArray[y+1][x-1].adjacentBombs++;
          }
          tempRow[x].adjacentSquareIDS.push(returnArray[y+1][x-1].id);
        }
        //down and right
        if (((y+1)<n) && ((x+1)<tempRow.length)) {
          if (returnArray[y+1][x+1].isBomb===false) {
              returnArray[y+1][x+1].adjacentBombs++;
            }
            tempRow[x].adjacentSquareIDS.push(returnArray[y+1][x+1].id);
        }
      }
      //get adjacentSquareIDS for squares that arent Bombs
      else if (tempRow[x].isBomb===false) {
        //up
        if ((y+1)<n) {
          tempRow[x].adjacentSquareIDS.push(returnArray[y+1][x].id);
        }
        //down
        if ((y-1)>=0) {
          tempRow[x].adjacentSquareIDS.push(returnArray[y-1][x].id);
        }
        //right
        if ((x+1)<tempRow.length) {
          tempRow[x].adjacentSquareIDS.push(returnArray[y][x+1].id);
        }
        if ((x-1)>=0) {
          tempRow[x].adjacentSquareIDS.push(returnArray[y][x-1].id);
        }
        //Up and Left
        if (((y-1)>=0) && ((x-1)>=0)) {
          tempRow[x].adjacentSquareIDS.push(returnArray[y-1][x-1].id);
        }
        //Up and Right
        if (((y-1)>=0) && ((x+1)<tempRow.length)) {
          tempRow[x].adjacentSquareIDS.push(returnArray[y-1][x+1].id);
        }
        //down and Left
        if (((y+1)<n) && ((x-1)>=0)) {
          tempRow[x].adjacentSquareIDS.push(returnArray[y+1][x-1].id);
        }
        //down and right
        if (((y+1)<n) && ((x+1)<tempRow.length)) {
            tempRow[x].adjacentSquareIDS.push(returnArray[y+1][x+1].id);
        }
      }
    }
  }
  return returnArray.flat();
}
