// initializing the board
let cd;
let GB, G1, SOUNDS;
let soundOpen = true;
let playerScore = 0,
  tieScore = 0,
  computerScore = 0;
let depthLevel = 3;
let gameBegin = false;
///
let canvas = document.getElementById("myCanvas");
let playerScoreEle = document.getElementById("playerScore");
let tieScoreEle = document.getElementById("tieScore");
let computerScoreEle = document.getElementById("computerScore");
let soundButton = document.getElementById("sound_button");
let buttonImg = document.getElementById("button_img");
let level = document.getElementById("level");
let dropBtn = document.getElementById("dropbtnID");
let currentDifficultyLevel = document.getElementById("difficulty-level");
let illegalMoveMsg = document.getElementById("illegal_move");
let winnerMsg = document.getElementById("winner");
let winnerContainer = document.getElementById("winner_container");
let winnerParent = document.getElementById("winner_parent");

let ctx = canvas.getContext("2d");
gameInitialState();
myFunction();

window.addEventListener("resize", resizeCanvas, false);

resizeCanvas();

function resizeCanvas() {
  if (window.innerWidth < window.innerHeight) {
    cd = (window.innerWidth * 9) / 10;
  } else {
    cd = (window.innerHeight * 7) / 10;
  }
  canvas.width = cd;
  canvas.height = cd;
  GB = new GameBoard(cd, ctx);
  if (gameBegin && !gameOver)
    GB.highlightLegalMoves(currentMoveForX, "#8e44ad");
  GB.drawSmallMarks(currentSmallBoardState, "white");
  GB.drawBigMarks(currentBigBoardState, "white");
  if (gameOver) gameOverAnimantion();
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  illegalMoveMsg.classList.add("hidden");
}
// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  dropBtn.innerHTML = "CHANGE DIFFICULTY LEVEL";
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
        if (!gameBegin) illegalMoveMsg.classList.remove("hidden");
      }
    }
  }
};
function easyFunc() {
  depthLevel = 1;
  level.innerHTML = "Easy";
}
function mediumFunc() {
  depthLevel = 2;
  level.innerHTML = "Medium";
}
function hardFunc() {
  depthLevel = 4;
  level.innerHTML = "Hard";
}

soundButton.addEventListener("click", () => {
  if (soundOpen) {
    buttonImg.src = "images/sound-close.svg";
    soundOpen = false;
  } else {
    buttonImg.src = "images/sound-open.svg";
    soundOpen = true;
  }
});

canvas.addEventListener("mousedown", doMouseDown);
function doMouseDown(event) {
  G1.allNodeValues = {};
  let rect = canvas.getBoundingClientRect();
  let canvs_x = event.clientX - rect.left;
  let canvs_y = event.clientY - rect.top;
  let i = GB.giveCurrentCellClick(canvs_x, canvs_y)[0];
  let j = GB.giveCurrentCellClick(canvs_x, canvs_y)[1];

  //New Game Set Up
  if (gameOver) {
    if (soundOpen) SOUNDS.gameStartSound();
    illegalMoveMsg.innerHTML = "Please make a move in any area";
    winnerParent.classList.add("hidden");
    gameBegin = false;
    if (!gameBegin) {
      if (dropBtn.classList.contains("hidden")) {
        dropBtn.classList.remove("hidden");
        currentDifficultyLevel.classList.add("hidden");
      }
    } else {
      dropBtn.classList.add("hidden");
      currentDifficultyLevel.classList.remove("hidden");
    }
    gameInitialState();
    return 0;
  }
  //For Legal Move
  if (
    currentMoveForX.includes(i) &&
    currentSmallBoardState[i][j] == 999 &&
    !G1.terminalForBigBoard(currentBigBoardState, 999) &&
    !gameOver
  ) {
    illegalMoveMsg.classList.add("hidden");
    gameBegin = true;
    if (!gameBegin) {
      if (dropBtn.classList.contains("hidden")) {
        dropBtn.classList.remove("hidden");
        currentDifficultyLevel.classList.add("hidden");
      }
    } else {
      dropBtn.classList.add("hidden");
      currentDifficultyLevel.classList.remove("hidden");
    }
    currentSmallBoardState[i][j] = "X";
    G1.bigBoardStateUpdater(
      i,
      "X",
      currentSmallBoardState,
      currentBigBoardState
    );
    GB.drawSmallMarks(currentSmallBoardState, "white");
    GB.drawX(
      GB.coordinatesOfEachCell[i][j][0],
      GB.coordinatesOfEachCell[i][j][1],
      "#8e44ad"
    );
    if (soundOpen) SOUNDS.moveSound();
    GB.drawBigMarks(currentBigBoardState, "white");
    let bestMove = G1.bestMoveForMiniMax(
      currentSmallBoardState,
      currentBigBoardState,
      j,
      depthLevel,
      false
    );
    if (
      !G1.terminalForBigBoard(currentBigBoardState, 999) &&
      bestMove &&
      !gameOver
    ) {
      currentSmallBoardState[bestMove[0]][bestMove[1]] = "O";
      G1.bigBoardStateUpdater(
        bestMove[0],
        "O",
        currentSmallBoardState,
        currentBigBoardState
      );

      currentMoveForX = G1.currentLegalMoveForX(
        currentSmallBoardState,
        currentBigBoardState,
        bestMove[1]
      );

      setTimeout(function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, cd, cd);
        GB.highlightLegalMoves(currentMoveForX, "#8e44ad");
        GB.drawSmallMarks(currentSmallBoardState, "white");
        GB.drawO(
          GB.coordinatesOfEachCell[bestMove[0]][bestMove[1]][0],
          GB.coordinatesOfEachCell[bestMove[0]][bestMove[1]][1],
          "#8e44ad"
        );
        GB.drawBigMarks(currentBigBoardState, "white");
      }, 500);
    }
    // console.log(currentBigBoardState);
    // console.log(currentSmallBoardState);
  } //For Illegal Move
  else if (!gameOver) {
    if (soundOpen) SOUNDS.illegalSound();
    illegalMoveMsg.innerHTML = "Please make a move in the indicated area";
    illegalMoveMsg.classList.remove("hidden");
    illegalMoveMsg.classList.add("fade-out-animation");
    setTimeout(() => {
      illegalMoveMsg.classList.add("hidden");
      illegalMoveMsg.classList.remove("fade-out-animation");
    }, 2900);
    illegalMove();
  }

  //Game Over
  if (
    (!gameOver &&
      G1.terminalForBigBoard(currentBigBoardState, 999) &&
      G1.terminalForBigBoard(currentBigBoardState, "D")) ||
    !G1.bestMoveForO(currentSmallBoardState, currentBigBoardState, j)
  ) {
    if (soundOpen) setTimeout(SOUNDS.gameEndSound(), 1000);
    updateScore();
    gameOverAnimantion();
    illegalMoveMsg.innerHTML = "Click anywhere on the board to Play Again";
    if (illegalMoveMsg.classList.contains("hidden"))
      illegalMoveMsg.classList.remove("hidden");
    let winner = "GAME DRAW";
    if (G1.utility(currentSmallBoardState, currentBigBoardState) == 1)
      winner = "YOU WON";
    else if (G1.utility(currentSmallBoardState, currentBigBoardState) == -1)
      winner = "YOU LOST";
    winnerMsg.innerHTML = winner;
    winnerParent.classList.remove("hidden");
    gameOver = true;
  }
}

function illegalMove() {
  for (let i = 0; i < 3; i++) {
    setTimeout(function () {
      // GB.drawBoard();
      // GB.highlightLegalMoves(currentMoveForX, "black");
      GB.highlightLegalMoves(currentMoveForX, "black");
      GB.drawSmallMarks(currentSmallBoardState, "white");
      GB.drawBigMarks(currentBigBoardState, "white");
    }, 100 + 200 * i);
    setTimeout(function () {
      GB.highlightLegalMoves(currentMoveForX, "#8e44ad");
      GB.drawSmallMarks(currentSmallBoardState, "white");
      GB.drawBigMarks(currentBigBoardState, "white");
    }, 200 + 200 * i);
  }
}
function updateScore() {
  if (G1.utility(currentSmallBoardState, currentBigBoardState) == 1) {
    playerScore += 1;
    playerScoreEle.innerText = `${playerScore}`;
    playerScoreEle.classList.add("hidden");
    setTimeout(() => {
      playerScoreEle.classList.remove("hidden");
      playerScoreEle.classList.add("w3-container w3-center w3-animate-zoom");
    });
  } else if (G1.utility(currentSmallBoardState, currentBigBoardState) == -1) {
    computerScore += 1;
    computerScoreEle.innerText = `${computerScore}`;
    computerScoreEle.classList.add("hidden");
    setTimeout(() => {
      computerScoreEle.classList.remove("hidden");
      computerScoreEle.classList.add("w3-container w3-center w3-animate-zoom");
    });
  } else {
    tieScore += 1;
    tieScoreEle.innerText = `${tieScore}`;
    tieScoreEle.classList.add("hidden");
    setTimeout(() => {
      tieScoreEle.classList.remove("hidden");
      tieScoreEle.classList.add("w3-container w3-center w3-animate-zoom");
    });
  }
  return 0;
}
function gameOverAnimantion() {
  winningRow = G1.winningRow(currentBigBoardState);
  GB.highlightLegalMoves(currentMoveForX, "black");
  GB.drawSmallMarks(currentSmallBoardState, "grey");
  GB.drawBigMarks(currentBigBoardState, "grey");
  setTimeout(() => {
    GB.highlightLegalMoves(currentMoveForX, "black");
    GB.drawSmallMarks(currentSmallBoardState, "grey");
    GB.drawBigMarks(currentBigBoardState, "grey");
  }, 500);

  if (winningRow) {
    for (let i = 0; i < 2; i++) {
      setTimeout(function () {
        for (let ele of winningRow) {
          let p = GB.coordinatesOfEachBlock()[ele][0];
          let q = GB.coordinatesOfEachBlock()[ele][1];
          if (G1.utility(currentSmallBoardState, currentBigBoardState) == -1) {
            GB.drawBigO(p, q, "black");
          } else if (
            G1.utility(currentSmallBoardState, currentBigBoardState) == 1
          ) {
            GB.drawBigX(p, q, "black");
          } else {
            GB.drawOnlyBigBoard("black");
          }
        }
      }, 150 + 300 * i);
      setTimeout(function () {
        for (let ele of winningRow) {
          let p = GB.coordinatesOfEachBlock()[ele][0];
          let q = GB.coordinatesOfEachBlock()[ele][1];
          if (G1.utility(currentSmallBoardState, currentBigBoardState) == -1) {
            GB.drawBigO(p, q, "white");
          } else if (
            G1.utility(currentSmallBoardState, currentBigBoardState) == 1
          ) {
            GB.drawBigX(p, q, "white");
          } else {
            GB.drawOnlyBigBoard("cyan");
          }
        }
      }, 300 + 300 * i);
    }
  } else {
    tieScoreEle.innerText = `${tieScore}`;
    for (let i = 0; i < 3; i++) {
      setTimeout(function () {
        GB.drawOnlyBigBoard("black");
      }, 150 + 300 * i);
      setTimeout(function () {
        GB.drawOnlyBigBoard("cyan");
      }, 300 + 300 * i);
    }
  }
}
function gameInitialState() {
  currentSmallBoardState = [];
  for (let i = 0; i < 9; i++) {
    currentSmallBoardState[i] = new Array(9).fill(999);
  }
  currentBigBoardState = [999, 999, 999, 999, 999, 999, 999, 999, 999];
  currentMoveForX = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  gameOver = false;
  GB = new GameBoard(cd, ctx);
  G1 = new Game();
  SOUNDS = new Sounds();
}

