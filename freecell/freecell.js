var canvas;
var ctx;
var game;
var undoButton;
var newGameButton;

function draw(){
  ctx.clearRect(0, 0, 695, 406);
  ctx.fillStyle = 'rgb(37, 128, 25)';
  ctx.fillRect(0, 0, 695, 406);
  game.cascades.forEach((item) => {
    item.reDraw();
  });
  game.freecells.forEach((item) => {
    if (item.card) {
      item.card.drawCard();
    }
    else {
      item.drawSpace();
    }
  });
  game.foundations.forEach((item) => {
    if (item.stackPointer) {
      item.cards[item.stackPointer].cardData.drawCard();
    }
    else {
      item.drawSpace();
    }
  });
}

function loadCanvas(){
  canvas = document.getElementById('myCanvas');
  canvas.addEventListener('click',(e) => {
    game.cascades.forEach((item) => {
      item.clickHandler(e.offsetX, e.offsetY,);
    });
    game.foundations.forEach((item) => {
      item.clickHandler(e.offsetX, e.offsetY,);
    });
    game.freecells.forEach((item) => {
      item.clickHandler(e.offsetX, e.offsetY,);
    });
    draw();
    if (game.selectedCard) {
      game.selectedCard.setNewXY( e.offsetX, e.offsetY );

    }
  });
  canvas.addEventListener('mousemove', e => {
  if (game.selectedCard) {
    draw();
    game.selectedCard.setNewXY( e.offsetX, e.offsetY );
  }
});

  ctx = canvas.getContext('2d');
  newGameButton = document.getElementById('newGameButton');
  newGameButton.addEventListener('click',(e) => {
    handleNewGameButton();
  });
  undoButton = document.getElementById('undoButton');
  undoButton.addEventListener('click',(e) => {
    handleUndoMove();
  });

  ctx.fillStyle = 'rgb(37, 128, 25)';
  ctx.fillRect(0, 0, 695, 406);
  game = new FreeCellGame();
}


function handleNewGameButton(){
  ctx.fillStyle = 'rgb(37, 128, 25)';
  ctx.fillRect(0, 0, 695, 406);
  game = new FreeCellGame();
}
function handleUndoMove(){
  if (!(game.selectedCard)) {
    var lastCardMoved = game.moveStack.pop();
    if (lastCardMoved) {
    var currentLocation = lastCardMoved.currentLocation;
     var previousLocation = lastCardMoved.previousLocation;
    //remove
    var cardBeingMoved;
    if (currentLocation<8) {
      cardBeingMoved = game.cascades[currentLocation].pop();
      game.cascades[currentLocation].reDraw();

    }
    else if (currentLocation<12) {
      cardBeingMoved=  game.freecells[currentLocation-8].pop();
    }
    else if(currentLocation<16){
      cardBeingMoved=  game.foundations[currentLocation-12].pop();
    }

    //now place
    if (previousLocation<8) {
      game.cascades[previousLocation].push(cardBeingMoved, true);
      game.cascades[previousLocation].reDraw();

    }
    //if last location a freecell
   else if (previousLocation<12) {
      game.freecells[previousLocation-8].push(cardBeingMoved);
    }
  }
  draw();

  }
}
class MoveStack {

  //I think I need to fix it here. store move data and not a card
  moves= {};

  push(currentLocation, previousLocation){
    if (!(this.stackPointer)) {
      var newKey =(previousLocation + currentLocation)+  Math.floor(Math.random() * 52);
      this.moves[newKey]={
        currentLocation: currentLocation,
        previousLocation: previousLocation,
        ptrPrevious:null,
      };
      this.stackPointer = newKey
    }
    else {
      var newKey =(previousLocation + currentLocation)+  Math.floor(Math.random() * 52);
      this.moves[newKey]={
        currentLocation: currentLocation,
        previousLocation: previousLocation,
        ptrPrevious:this.stackPointer,
      };
      this.stackPointer = newKey
    }
  }
  pop(){

    if(this.stackPointer){
      var move = this.moves[this.stackPointer];
      delete this.moves[this.stackPointer];
      this.stackPointer=move.ptrPrevious;

    return move;
   }
  }
}

class FreeSpace{
  card=null;
  isOccupied=false;
  constructor(id, x, y){
    this.id=id;
    this.x=x;
    this.y=y;
    this.drawSpace();
  }
  drawSpace(){
    ctx.fillStyle ='white';
    ctx.fillRect(this.x, this.y, 75, 100);
    ctx.strokeRect(this.x, this.y, 75, 100);
    ctx.fillStyle ='black';
    ctx.textAlign = 'center';
    ctx.fillText("Freecell", this.x+38, this.y+50);
  }
  clickHandler(x, y){
    if( x> this.x && x<(this.x+75)){
      if (y> this.y && y<(this.y+100)) {
        if (game.selectedCard && this.isOccupied===false) {
          this.push(game.selectedCard);
          game.moveStack.push(this.card.currentLocation, this.card.previousLocation);
        }
        else if ((!game.selectedCard) &&this.isOccupied===true) {
          game.selectedCard=this.pop();
        }
      }
    }
  }
  push(card){
    this.card= card;
    this.card.currentLocation=this.id;
    this.card.setNewXY(this.x, this.y);
    this.isOccupied = true;
    game.selectedCard=null;
  }
  pop(){
    this.card.previousLocation=this.id;
    let tempCard = this.card;
    this.card=null;
    this.isOccupied = false;
    this.drawSpace();
    return tempCard
  }
}
class Foundation{
  cards={};
  stackPointer=null;
  nextValue=1;
  constructor(id, x, y, suit){
    this.id=id;
    this.x=x;
    this.y=y;
    this.suit=suit;
    this.drawSpace();
  }
  drawSpace(){
    ctx.fillStyle ='white';
    ctx.fillRect(this.x, this.y, 75, 100);
    ctx.strokeRect(this.x, this.y, 75, 100);
    ctx.fillStyle ='black';
    ctx.textAlign = 'center';
    ctx.fillText(this.suit, this.x+38, this.y+50);
  }
  clickHandler(x, y){
    if( x> this.x && x<(this.x+75)){
      if (y> this.y && y<(this.y+100)) {
        if (game.selectedCard) {
          if (game.selectedCard.suit===this.suit&&game.selectedCard.value===this.nextValue) {
            let tempCard = game.selectedCard;
            tempCard.currentLocation=this.id;
            this.push(tempCard);
            game.moveStack.push(tempCard.currentLocation, tempCard.previousLocation);
            game.selectedCard=null;
          }
        }
      }
    }
  }
  push(card){
    var newKey = card.id;
    this.cards[newKey]={
      cardData: card,
      ptrPrevious: this.stackPointer,
    };
    this.stackPointer= newKey;
    card.setNewXY(this.x, this.y);
    this.nextValue++;
  }
  pop(){
    if (this.stackPointer) {
      this.nextValue--;
      let returnCard = this.cards[this.stackPointer].cardData;
      let tempPointer = this.stackPointer;
      this.stackPointer =  this.cards[this.stackPointer].ptrPrevious;
      if (this.stackPointer) {
        this.cards[this.stackPointer].cardData.drawCard();
      }
      else {
        this.drawSpace();
      }
      delete this.cards[tempPointer];
      return returnCard
    }
  }
}

class Card{
  constructor(card, x, y){
    this.x=x;
    this.y=y;
    this.suit = card.suit;
    this.id = card.id;
    this.red = card.red;
    this.value = card.value;
    this.drawCard();
  }
  drawCard(){
    ctx.fillStyle ='black';
    ctx.strokeRect(this.x, this.y, 75, 100);
    ctx.fillStyle ='white';
    ctx.fillRect(this.x, this.y, 75, 100);
    if (this.red) {
      ctx.fillStyle ='red';
    }
    else {
      ctx.fillStyle ='black';
    }
    ctx.textAlign = 'center';
    if (this.value>1 && this.value <11) {
      ctx.fillText(this.value.toString(), this.x+38, this.y+50);
      ctx.textAlign = 'left';
      ctx.fillText(this.value.toString()+" " + this.suit, this.x+2, this.y +10);
      ctx.textAlign = 'right';
      ctx.fillText(this.value.toString()+ " " + this.suit, this.x+73, this.y+90);
    }
    else if (this.value===1) {
      ctx.fillText("Ace", this.x+38, this.y+50);
      ctx.textAlign = 'left';
      ctx.fillText("A "+ this.suit, this.x+2, this.y +10);
      ctx.textAlign = 'right';
      ctx.fillText("A " + this.suit, this.x+73, this.y+90);
    }
    else if (this.value===11) {
      ctx.fillText("Jack", this.x+38, this.y+50);
      ctx.textAlign = 'left';
      ctx.fillText("J "+ this.suit, this.x+2, this.y +10);
      ctx.textAlign = 'right';
      ctx.fillText("J " + this.suit, this.x+73, this.y+90);
    }
    else if (this.value===12) {
      ctx.fillText("Queen", this.x+38, this.y+50);
      ctx.textAlign = 'left';
      ctx.fillText("Q "+ this.suit, this.x+2, this.y +10);
      ctx.textAlign = 'right';
      ctx.fillText("Q " + this.suit, this.x+73, this.y+90);
    }
    else if (this.value===13) {
      ctx.fillText("King", this.x+38, this.y+50);
      ctx.textAlign = 'left';
      ctx.fillText("K "+ this.suit, this.x+2, this.y +10);
      ctx.textAlign = 'right';
      ctx.fillText("K " + this.suit, this.x+73, this.y+90);
    }
  }
  setNewXY(x,y){
    this.x=x;
    this.y=y;
    this.drawCard();
  }
}


class FreeCellGame{
  constructor(){
    this.cascades = this.deal();
    this.freecells= [new FreeSpace(8, 2, 2), new FreeSpace(9, 79, 2), new FreeSpace(10, 156, 2), new FreeSpace(11, 233, 2)];
    this.foundations= [new Foundation(12, 387, 2,"Hearts"), new Foundation(13, 464, 2, "Clubs"), new Foundation(14, 541, 2,"Diamonds"), new Foundation(15, 618, 2, "Spades")];
    this.moveStack= new MoveStack();
    this.selectedCard = null;
  }
  deal(){
    var shuffledDeck = getShuffledCardDeck();
    var cascades = [new Cascade(0, 2,112),new Cascade(1, 79,112),new Cascade(2, 156,112),new Cascade(3, 233,112),new Cascade(4, 387,112),new Cascade(5, 464,112),new Cascade(6, 541,112),new Cascade(7, 618,112)];
    var cascadeIndex=0;
    shuffledDeck.forEach((item) => {
      let tempcascade = cascades[cascadeIndex];
      tempcascade.push(item);
      cascades[cascadeIndex] = tempcascade;
      if (cascadeIndex===7) {
        cascadeIndex=0;
      }
      else {
        cascadeIndex++;
      }
    });
    return cascades;
  }
}

class Cascade {
  cards= {};
  constructor(id, x,y){
    this.id= id;
    this.x=x;
    this.y=y;
  }
  clickHandler(x, y){
    if( x> this.x && x<(this.x+75)){
      if (y> this.y && y<(this.y+(this.count()*15)+100)) {
        if (!game.selectedCard) {
          game.selectedCard = this.pop();
          this.perviousTail= game.selectedCard;
          this.reDraw();
        }
        else if (game.selectedCard.currentLocation===this.id) {
          this.push(game.selectedCard);
          game.selectedCard=null;
          this.perviousTail=null;
        }
        else if (game.selectedCard ) {
          if (game.selectedCard.red===true) {
            if (this.cards[this.tailPtr]){
              if (this.cards[this.tailPtr].cardData.red===false && ((game.selectedCard.value + 1) ===this.cards[this.tailPtr].cardData.value)){
                this.push(game.selectedCard)
                game.selectedCard=null;
              }
            }
            else {
              this.push(game.selectedCard)
              game.selectedCard=null;
            }
          }
          else if (game.selectedCard.red===false) {
            if (this.cards[this.tailPtr]) {
              if (this.cards[this.tailPtr].cardData.red===true && ((game.selectedCard.value + 1) ===this.cards[this.tailPtr].cardData.value)) {
                this.push(game.selectedCard)
                game.selectedCard=null;
              }
            }
            else {
              this.push(game.selectedCard)
              game.selectedCard=null;
            }
          }
        }
      }
    }

  }
  reDraw(){
    ctx.fillStyle = 'rgb(37, 128, 25)';
    ctx.fillRect(this.x-2, this.y-2, 79, 294);
    var pointerNext=this.headPtr;
    while (pointerNext!=null) {
      let tempCard =this.cards[pointerNext];
      tempCard.cardData.drawCard();
      pointerNext = tempCard.ptrNext;
    }
  }
  push(card, isUndo){
    if (!(card instanceof Card) ) {
      card = new Card(card, this.x, this.y+(this.count()*15));
      card.currentLocation = this.id;
      card.previousLocation = this.id;
    }
    else {
      card.setNewXY(this.x, this.y+(this.count()*15));
      card.currentLocation = this.id;
      if (!isUndo) {
        game.moveStack.push(card.currentLocation, card.previousLocation);
      }
    }
    if(this.count()===0){
      var newKey = card.id;
      this.headPtr = newKey;
      this.tailPtr= newKey;
      this.cards[newKey]={
        cardData: card,
        ptrNext: null,
        ptrPrevious: null,
      };
    }
    else{
      var newKey = card.id;
      this.cards[newKey]={
        cardData: card,
        ptrNext: null,
        ptrPrevious: this.tailPtr,
      };
      this.cards[this.tailPtr].ptrNext = newKey;
      this.tailPtr= newKey;
    }
  }
  pop(){
    if(this.tailPtr){
      var tail = this.cards[this.tailPtr];
      if(this.cards[tail.ptrPrevious]){
        this.cards[tail.ptrPrevious].ptrNext = null;
      }
      else {
        this.headPtr=null;
      }
      delete this.cards[this.tailPtr];
      this.tailPtr=tail.ptrPrevious;
      var returnCard = tail.cardData;
      returnCard.previousLocation=this.id;
    return returnCard;
   }
  }
  count() {
    var sum =0;
    if (Object.keys(this.cards)){
      Object.keys(this.cards).forEach((item) => {
        sum=sum+1;
      });
    }
    return sum;
  }
}


function getShuffledCardDeck(){
  //init unshuffledDeck
  var unshuffledDeck = [];
  var id=1;
  var tempCardObject;
    for (let i = 0; i < 4; i++) {
      for (let ii = 0; ii < 13; ii++) {
        switch (i) {
          case 0:
            tempCardObject = {
              id: id,
              suit: "Hearts",
              red: true,
              value: (ii+1)
            }
            break;
          case 1:
            tempCardObject = {
              id: id,
              suit: "Diamonds",
              red: true,
              value: (ii+1)
            }
            break;
          case 2:
            tempCardObject = {
              id: id,
              suit: "Clubs",
              red: false,
              value: (ii+1)
            }
            break;
          case 3:
            tempCardObject = {
              id: id,
              suit: "Spades",
              red:false,
              value: (ii+1)
            }
            break;
        }
        unshuffledDeck.push(tempCardObject);
        id++;
      }
    }
  //get an array of ids in a random order
  var shuffledCardDeck = new Array(52);
  shuffledCardDeck.fill(-1);
  var cardID =-1
  for (let i = 0; i < 52; i++) {
    while (shuffledCardDeck.includes(cardID)) {
      cardID = Math.floor(Math.random() * (52));
    }
    shuffledCardDeck[i]=cardID;
  }
  for (let i = 0; i < shuffledCardDeck.length; i++) {
    shuffledCardDeck[i] = unshuffledDeck[shuffledCardDeck[i]];
  }
  return shuffledCardDeck;
}
