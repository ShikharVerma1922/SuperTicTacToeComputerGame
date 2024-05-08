// initializing the board
let currentSmallBoardState = [];
for (let i = 0; i < 9; i++) {
  currentSmallBoardState[i] = new Array(9).fill(999);
}
let currentBigBoardState = [999, 999, 999, 999, 999, 999, 999, 999, 999];
let currentMoveForX = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let cd;
let GB = undefined;
let gameOver = false;
let soundOpen = true;
let playerScore = 0,
  tieScore = 0,
  computerScore = 0;
///
(function () {
  canvas = document.getElementById("myCanvas");
  playerScoreEle = document.getElementById("playerScore");
  tieScoreEle = document.getElementById("tieScore");
  computerScoreEle = document.getElementById("computerScore");
  soundButton = document.getElementById("sound_button");
  buttonImg = document.getElementById("button_img");
  ctx = canvas.getContext("2d");
  window.addEventListener("resize", resizeCanvas, false);

  resizeCanvas();
})();

function resizeCanvas() {
  canvas.style.border = "1px solid white";

  if (window.innerWidth < window.innerHeight) {
    cd = (window.innerWidth * 9) / 10;
  } else {
    cd = (window.innerHeight * 7) / 10;
  }
  canvas.width = cd;
  canvas.height = cd;
  GB = new GameBoard(cd, ctx);
  GB.drawSmallMarks(currentSmallBoardState);
  GB.drawBigMarks(currentBigBoardState);
}

let G1 = new Game();
let SOUNDS = new Sounds();

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

  //New Game
  if (gameOver) {
    if (soundOpen) SOUNDS.gameStartSound();
    currentSmallBoardState = [];
    for (let i = 0; i < 9; i++) {
      currentSmallBoardState[i] = new Array(9).fill(999);
    }
    currentBigBoardState = [999, 999, 999, 999, 999, 999, 999, 999, 999];
    currentMoveForX = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    gameOver = false;
    GB = new GameBoard(cd, ctx);
    return 0;
  }
  //For Legal Move
  if (
    currentMoveForX.includes(i) &&
    currentSmallBoardState[i][j] == 999 &&
    !G1.terminalForBigBoard(currentBigBoardState, 999) &&
    !gameOver
  ) {
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
        "#FF4545"
      );
      if (soundOpen) SOUNDS.moveSound();
      GB.drawBigMarks(currentBigBoardState, "white");
    let bestMove = G1.bestMoveForO(
      currentSmallBoardState,
      currentBigBoardState,
      j
    );
    if (!G1.terminalForBigBoard(currentBigBoardState, 999) && bestMove) {
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
          GB.drawSmallMarks(currentSmallBoardState, "white");
          GB.drawO(
            GB.coordinatesOfEachCell[bestMove[0]][bestMove[1]][0],
            GB.coordinatesOfEachCell[bestMove[0]][bestMove[1]][1],
            "#FF4545"
          );
          // SOUNDS.moveSound();

          GB.highlightLegalMoves(currentMoveForX);
          GB.drawBigMarks(currentBigBoardState, "white");
        }, 500);
    }
  } //For Illegal Move
  else {
    if (!gameOver){ 
      if (soundOpen) SOUNDS.illegalSound();
      for (let i = 0; i < 3; i++) {
        setTimeout(function () {
          GB.drawBoard();
          GB.drawBigMarks(currentBigBoardState, "white");
        }, 100 + 200 * i);
        setTimeout(function () {
          GB.highlightLegalMoves(currentMoveForX);
          GB.drawBigMarks(currentBigBoardState, "white");
        }, 200 + 200 * i);
      }
    }
  }

  //Game Over
  if (
    (G1.terminalForBigBoard(currentBigBoardState, 999) &&
      G1.terminalForBigBoard(currentBigBoardState, "D")) ||
    !G1.bestMoveForO(currentSmallBoardState, currentBigBoardState, j)
  ) {
    if (!gameOver) {
      if (soundOpen) setTimeout(SOUNDS.gameEndSound(), 1000);
      winningRow = G1.winningRow(currentBigBoardState);
      GB.drawSmallMarks(currentSmallBoardState, "grey");
      GB.drawBigMarks(currentBigBoardState, "grey");
      setTimeout(() => {
        GB.drawSmallMarks(currentSmallBoardState, "grey");
        GB.drawBigMarks(currentBigBoardState, "grey");
      }, 500);

      if (winningRow) {
        if (G1.utility(currentBigBoardState) == 1) {
          playerScore += 1;
          playerScoreEle.innerText = `${playerScore}`;
        } else if (G1.utility(currentBigBoardState) == -1) {
          computerScore += 1;
          computerScoreEle.innerText = `${computerScore}`;
        } else {
          tieScore += 1;
          tieScoreEle.innerText = `${tieScore}`;
        }
        for (let i = 0; i < 3; i++) {
          setTimeout(function () {
            for (let ele of winningRow) {
              let p = GB.coordinatesOfEachBlock()[ele][0];
              let q = GB.coordinatesOfEachBlock()[ele][1];
              if (G1.utility(currentBigBoardState) == 1) {
                GB.drawBigX(p, q, "black");
              } else if (G1.utility(currentBigBoardState) == -1) {
                GB.drawBigO(p, q, "black");
              } else {
                GB.drawOnlyBigBoard("black");
              }
            }
          }, 150 + 300 * i);
          setTimeout(function () {
            for (let ele of winningRow) {
              let p = GB.coordinatesOfEachBlock()[ele][0];
              let q = GB.coordinatesOfEachBlock()[ele][1];
              if (G1.utility(currentBigBoardState) == 1) {
                GB.drawBigX(p, q, "white");
              } else if (G1.utility(currentBigBoardState) == -1) {
                GB.drawBigO(p, q, "white");
              } else {
                GB.drawOnlyBigBoard("white");
              }
            }
          }, 300 + 300 * i);
        }
      } else {
        tieScore += 1;
        tieScoreEle.innerText = `${tieScore}`;
        for (let i = 0; i < 3; i++) {
          setTimeout(function () {
            GB.drawOnlyBigBoard("black");
          }, 150 + 300 * i);
          setTimeout(function () {
            GB.drawOnlyBigBoard("white");
          }, 300 + 300 * i);
        }
      }
    }
    gameOver = true;
  }
}
