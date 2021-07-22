var canvas;
var ctx;
var game;
var newGameButton;
var canvasElements=[];
var selectedCard;
var moveStack=[];
function draw(){
  canvas = document.getElementById('myCanvas');
  canvas.addEventListener('click',(e) => {
    canvasElements.forEach((item) => {
      item.clickHandler(e.offsetX, e.offsetY,);
    });
  });
  ctx = canvas.getContext('2d');
  newGameButton = document.getElementById('newGameButton');
  newGameButton.addEventListener('click',(e) => {
    handleNewGameButton();
  });
  ctx.fillStyle = 'rgb(37, 128, 25)';
  ctx.fillRect(0, 0, 695, 406);
  game = new FreeCellGame();
}
function handleNewGameButton(){
  ctx.fillStyle = 'rgb(37, 128, 25)';
  ctx.fillRect(0, 0, 695, 406);
  canvasElements=[];
  selectedCard=null;

  game = new FreeCellGame();
}
class FreeSpace{
  card=null;
  isOccupied=false;
  constructor(x, y){
    this.x=x;
    this.y=y;
    this.drawSpace();
    canvasElements.push(this);
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
        if (selectedCard && this.isOccupied===false) {
          this.card= selectedCard;
          this.card.setNewXY(this.x, this.y);
          this.isOccupied = true;
          selectedCard=null;
        }
        else if ((!selectedCard) &&this.isOccupied===true) {
          selectedCard = this.card;
          this.card=null;
          this.isOccupied = false;
          this.drawSpace();
        }
      }
    }
  }

}
class Foundation{
  card=null;
  nextValue=1;
  constructor(x, y, suit){
    this.x=x;
    this.y=y;
    this.suit=suit;
    this.drawSpace();
    canvasElements.push(this);
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
        if (selectedCard) {
          if (selectedCard.suit===this.suit&&selectedCard.value===this.nextValue) {
            this.card= selectedCard.setNewXY(this.x, this.y);
            this.nextValue++;
            selectedCard=null;
          }
        }
      }
    }
  }
}

class CardDisplay{
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
    this.freeceels= [new FreeSpace(2, 2), new FreeSpace( 79, 2), new FreeSpace( 156, 2), new FreeSpace( 233, 2)];
    this.foundations= [new Foundation( 387, 2,"Hearts"), new Foundation( 464, 2, "Clubs"), new Foundation( 541, 2,"Diamonds"), new Foundation( 618, 2, "Spades")];
  }
  deal(){
    var shuffledDeck = getShuffledCardDeck();
    var cascades = [new Cascade(2,112),new Cascade(79,112),new Cascade(156,112),new Cascade(233,112),new Cascade(387,112),new Cascade(464,112),new Cascade(541,112),new Cascade(618,112)];
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
  constructor(x,y){
    this.x=x;
    this.y=y;
    canvasElements.push(this);
  }
  clickHandler(x, y){
    if( x> this.x && x<(this.x+75)){
      if (y> this.y && y<(this.y+(this.count()*15)+100)) {
        if (!selectedCard) {
          selectedCard = this.pop();
          this.reDraw();
        }
        else if (selectedCard ) {
          if (selectedCard.red===true) {
            if (this.cards[this.tailPtr].cardData.red===false && ((selectedCard.value + 1) ===this.cards[this.tailPtr].cardData.value)) {
              this.push(selectedCard)
              selectedCard=null;
            }
          }
          else if (selectedCard.red===false) {
            if (this.cards[this.tailPtr].cardData.red===true && ((selectedCard.value + 1) ===this.cards[this.tailPtr].cardData.value)) {
              this.push(selectedCard)
              selectedCard=null;
            }
          }
          else if (this.count()===0) {
            this.push(selectedCard)
            selectedCard=null;
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
  push(card){

    if(this.count()===0){
      var newKey = card.id;
      this.headPtr = newKey;
      this.tailPtr= newKey;
      this.cards[newKey]={
        cardData: new CardDisplay(card, this.x, this.y+(this.count()*15)),
        ptrNext: null,
        ptrPrevious: null,
      };
    }
    else{
      var newKey = card.id;
      this.cards[newKey]={
        cardData: new CardDisplay(card, this.x, this.y+(this.count()*15)),
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
    return tail.cardData;
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
