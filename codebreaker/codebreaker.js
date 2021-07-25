var canvas;
var ctx;
var inputField;
var enterGuessButton;
var game;

function loadCanvas() {
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  enterGuessButton = document.getElementById('guessButton');
  enterGuessButton.addEventListener('click',(e) => {
    guessHandler();
  });
  inputField=document.getElementById('guessInput');

  game = new CodeBreakerGame();
}


function guessHandler(){
  var guess = inputField.value;
  if (guess.match(/[^\d]/gi)) {
    game.draw("Code Only Contains Digits 1-9")
    return;
  }
  if (guess.length===6) {
    var guess = inputField.value;
    var guessArray=guess.match(/[\d]/gi);
    guessArray.forEach((item, i) => {
      guessArray[i] = parseInt(item);
    });
    game.checkGuess(guessArray);
  }
  else {
    game.draw("Code Is 6 Digits Long")
  }
}

class CodeBreakerGame{
  guessCounter=0;
  lineCounter=0;

  constructor(){
    this.generateCode(6);

  }
  draw(string){
    this.lineCounter++
    if (this.lineCounter>15) {
      ctx.clearRect(0,0, 400, 400)
      this.lineCounter=0;
      ctx.fillText(string, 0, 50+(20*this.lineCounter) );
    }
    ctx.fillStyle ='black';
    ctx.textAlign = 'left';
    ctx.fillText(string, 0, 50+(20*this.lineCounter) );

  }
  generateCode(n){
    var digitArray=[];
    for (let i = 0; i < n; i++) {
      digitArray.push(Math.floor(Math.random() * 10));
    }
    this.code = digitArray;
  }

  checkGuess(g) {
    this.guessCounter++;
    var guess =g;
    var codeChecker=[];
    for (var i = 0; i < this.code.length; i++) {
      codeChecker[i]=this.code[i];
    }
    var correctOrder=0;
    //check to see correct order
    var notCorrectGuessDigits=[];
    var notCorrectCodeDigits=[];
    for (let i = 0; i < guess.length; i++) {
        if (guess[i]===codeChecker[i]) {
          correctOrder++;
        }
        else {
          notCorrectGuessDigits.push(guess[i]);
          notCorrectCodeDigits.push(codeChecker[i]);
        }
    }
    //if 6 winner
    if (correctOrder===6) {
      game.draw("winner!!!");
      return;
    }
    //check not correct order to see if still in code
    var correctNotInOrder=0;
    for (let i = 0; i < notCorrectGuessDigits.length; i++) {
      for (let ii = 0; ii < notCorrectCodeDigits.length; ii++) {
        if (notCorrectGuessDigits[i]===notCorrectCodeDigits[ii]) {
          correctNotInOrder++;
          notCorrectCodeDigits.splice(ii,1);
          break
        }
      }
    }
    var returnString = correctOrder.toString() + " digits correct and in the right spot and "+ correctNotInOrder.toString() + " digits correct but in the wrong spot"
    this.draw(returnString)
}

}
