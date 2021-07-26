import {initFreecell, unloadFreecell} from './gamemodules/freecell.js';
import {initMineSweeper, unloadMineSweeper}  from './gamemodules/minesweeper.js';
import {initCodeBreaker, unloadCodeBreaker} from './gamemodules/codebreaker.js'

var headingDiv;
var gamelistDiv;
var backButtonDiv;

window.onload = initDoc;
function initDoc(){
  headingDiv = document.createElement("div");
  headingDiv.setAttribute("id", "headingDiv") ;
  document.getElementById("headerSection").appendChild(headingDiv);
  var heading =  document.createElement("h1");
  heading.innerHTML = "Theo's Vanilla JavaScript Games!";
  document.getElementById("headingDiv").appendChild(heading);
  getGameList();
}
function getGameList(){
  gamelistDiv = document.createElement("div");
  gamelistDiv.setAttribute("id", "gamelistDiv");
  document.getElementById("mainSection").appendChild(gamelistDiv);

  var freecellDiv = document.createElement("div");
  freecellDiv.setAttribute("id", "freecellDiv");
  document.getElementById("gamelistDiv").appendChild(freecellDiv);
  var freecellH2 = document.createElement("h2");
  freecellH2.innerHTML="Freecell";
  var freecellP = document.createElement("p");
  freecellP.innerHTML = "Played with a standard 52 card deck, this classic card game is won when the player successfully moves all cards to their respective foundation piles. Included in every release on Windows since 1995, what better game to build with vanilla JavaScript than FreeCell. Right now, the game is playable but is missing a few key features. These missing features include but are not limited too a much-improved GUI.";
  document.getElementById("freecellDiv").appendChild(freecellH2)
  document.getElementById("freecellDiv").appendChild(freecellP);
  var startFreecellButton = document.createElement("button");
  startFreecellButton.innerHTML = "Start Freecell";
  document.getElementById("freecellDiv").appendChild(startFreecellButton);
  startFreecellButton.addEventListener('click',(e) => {
    clearDoc();
    startFreecell();
  });

  var minesweeperDiv = document.createElement("div");
  minesweeperDiv.setAttribute("id", "minesweeperDiv");
  document.getElementById("gamelistDiv").appendChild(minesweeperDiv);
  var minesweeperH2 = document.createElement("h2");
  minesweeperH2.innerHTML="Minesweeper";
  var minesweeperP = document.createElement("p");
  minesweeperP.innerHTML = "As one of the earliest known games to be played on a computer why not take a shot at replicating one the most played computer games of all time. Improved GUI and different board sizes coming soon!";
  document.getElementById("minesweeperDiv").appendChild(minesweeperH2);
  document.getElementById("minesweeperDiv").appendChild(minesweeperP);
  var startMinesweeperButton = document.createElement("button");
  startMinesweeperButton.innerHTML = "Start Minesweeper";
  document.getElementById("minesweeperDiv").appendChild(startMinesweeperButton);
  startMinesweeperButton.addEventListener('click',(e) => {
    clearDoc();
    startMinesweeper();
  });

  var codebreakerDiv = document.createElement("div");
  codebreakerDiv.setAttribute("id", "codebreakerDiv");
  document.getElementById("gamelistDiv").appendChild(codebreakerDiv);
  var codebreakerH2 = document.createElement("h2");
  codebreakerH2.innerHTML="Codebreaker";
  var codebreakerP = document.createElement("p");
  codebreakerP.innerHTML = "Try and break the code";
  document.getElementById("codebreakerDiv").appendChild(codebreakerH2);
  document.getElementById("codebreakerDiv").appendChild(codebreakerP);
  var startCodebreakerButton = document.createElement("button");
  startCodebreakerButton.innerHTML = "Start Codebreaker";
  document.getElementById("codebreakerDiv").appendChild(startCodebreakerButton);
  startCodebreakerButton.addEventListener('click',(e) => {
    clearDoc();
    startCodeBreaker();
  });


}

function clearDoc(){
  headingDiv.remove();
  gamelistDiv.remove();
  if (backButtonDiv) {
    backButtonDiv.remove();
  }
}
function startFreecell(){
  initFreecell();
  backButtonDiv = document.createElement("div");
  backButtonDiv.setAttribute("id", "backButtonDiv");
  document.getElementById("mainSection").appendChild(backButtonDiv);
  var backButton = document.createElement("button");
  backButton.innerHTML = "Back To Games";
  document.getElementById("backButtonDiv").appendChild(backButton);
  backButton.addEventListener('click',(e) => {
    clearDoc();
    unloadFreecell();
    initDoc();
  });
}
function startMinesweeper(){
  initMineSweeper();
  backButtonDiv = document.createElement("div");
  backButtonDiv.setAttribute("id", "backButtonDiv");
  document.getElementById("mainSection").appendChild(backButtonDiv);
  var backButton = document.createElement("button");
  backButton.innerHTML = "Back To Games";
  document.getElementById("backButtonDiv").appendChild(backButton);
  backButton.addEventListener('click',(e) => {
    clearDoc();
    unloadMineSweeper();
    initDoc();
  });
}

function startCodeBreaker(){
  initCodeBreaker();
  backButtonDiv = document.createElement("div");
  backButtonDiv.setAttribute("id", "backButtonDiv");
  document.getElementById("mainSection").appendChild(backButtonDiv);
  var backButton = document.createElement("button");
  backButton.innerHTML = "Back To Games";
  document.getElementById("backButtonDiv").appendChild(backButton);
  backButton.addEventListener('click',(e) => {
    clearDoc();
    unloadCodeBreaker();
    initDoc();
  });
}
