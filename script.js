// initializing the board
let cd;
let GB, G1, SOUNDS;
let soundOpen = true;
let playerScore = 0,
  tieScore = 0,
  computerScore = 0;
let depthLevel = 3;
let gameBegin = false;
let gameOver = false;
let infoShown = false;
let singlePlayerMode = true;
let playerX_Turn = true;
///
let canvas = document.getElementById("myCanvas");
let playerScoreEle = document.getElementById("playerScore");
let tieScoreEle = document.getElementById("tieScore");
let computerScoreEle = document.getElementById("computerScore");
let soundButton = document.getElementById("sound_button");
let buttonImg = document.getElementById("button_img");
let diffText = document.getElementById("diff-text");
let dropBtn = document.getElementById("dropbtnID");
let currentDifficultyLevel = document.getElementById("difficulty-level");
let illegalMoveMsg = document.getElementById("illegal_move");
let winnerMsg = document.getElementById("winner");
let winnerContainer = document.getElementById("winner_container");
let winnerParent = document.getElementById("winner_parent");
let resignBtn = document.getElementById("resign");
let modal = document.getElementById("myModal");
let modal2 = document.getElementById("myModal_2");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];
let infoSlide = document.getElementById("info");
let currentMove = document.getElementById("current-move");

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

function resign() {
  document.getElementById("myDropdown").style.display = "block";
  if (soundOpen) SOUNDS.gameStartSound();
  // illegalMoveMsg.classList.remove("hidden");
  illegalMoveMsg.innerHTML = "Please make a move in any area";
  winnerParent.classList.add("hidden");
  winnerContainer.classList.remove("winner-container");
  winnerParent.classList.remove("winner-parent");
  setTimeout(() => {
    winnerParent.classList.remove("hidden");
    winnerMsg.innerHTML = "NEW GAME";
    winnerContainer.classList.add("new-game-animation");
    winnerParent.classList.add("new-game-parent");
  }, 1);
  setTimeout(() => {
    winnerParent.classList.add("hidden");
    winnerParent.classList.remove("new-game-parent");
    winnerParent.classList.add("winner-parent");
    winnerContainer.classList.remove("new-game-animation");
    winnerContainer.classList.add("winner-container");
  }, 3000);
  gameBegin = false;
  if (singlePlayerMode) {
    if (dropBtn.classList.contains("hidden")) {
      dropBtn.classList.remove("hidden");
      diffText.classList.remove("hidden");
      resignBtn.classList.add("hidden");
      currentDifficultyLevel.classList.add("hidden");
    }
    if (!gameOver) {
      computerScore += 1;
      computerScoreEle.innerText = `${computerScore}`;
      computerScoreEle.classList.add("hidden");
      setTimeout(() => {
        computerScoreEle.classList.remove("hidden");
        computerScoreEle.classList.add("w3-container");
        computerScoreEle.classList.add("w3-center");
        computerScoreEle.classList.add("w3-animate-zoom");
      });
    }
  } else {
    document.getElementById("myDropdown").style.display = "none";
    dropBtn.classList.add("hidden");
    currentMove.classList.remove("hidden");
    document.getElementById("move-text").classList.remove("hidden");
    document.getElementById("winner-mpm").classList.add("hidden");
    resignBtn.classList.add("hidden");
    gameBegin = false;
    if (playerX_Turn && !gameOver) {
      computerScore += 1;
      computerScoreEle.innerText = `${computerScore}`;
      computerScoreEle.classList.add("hidden");
      setTimeout(() => {
        computerScoreEle.classList.remove("hidden");
        computerScoreEle.classList.add("w3-container");
        computerScoreEle.classList.add("w3-center");
        computerScoreEle.classList.add("w3-animate-zoom");
      });
    } else if (!playerX_Turn && !gameOver) {
      playerScore += 1;
      playerScoreEle.innerText = `${playerScore}`;
      playerScoreEle.classList.add("hidden");
      setTimeout(() => {
        playerScoreEle.classList.remove("hidden");
        playerScoreEle.classList.add("w3-container");
        playerScoreEle.classList.add("w3-center");
        playerScoreEle.classList.add("w3-animate-zoom");
      });
    }
    playerX_Turn = true;
    currentMove.innerHTML = "PLAYER X";
    currentMove.style.color = "#ff4545";
  }

  gameInitialState();
}

function myFunction() {
  document.getElementById("myDropdown").style.display = "block";
  illegalMoveMsg.classList.add("hidden");
}

function changeMode() {
  if (!gameBegin) {
    if (soundOpen) SOUNDS.clickSound();
    (playerScore = 0), (computerScore = 0), (tieScore = 0);
    playerScoreEle.innerText = `${playerScore}`;
    tieScoreEle.innerText = `${tieScore}`;
    computerScoreEle.innerText = `${computerScore}`;
    if (singlePlayerMode) {
      document.getElementById("mode-button").innerHTML =
        '<img src="images/multi-player.svg" width="30" alt="">';
      document.getElementById("mode-text").innerHTML = "2P";
      singlePlayerMode = false;
      document.getElementById("myDropdown").style.display = "none";
      dropBtn.classList.add("hidden");
      diffText.classList.add("hidden");
      document.getElementById("computer-text").innerHTML = "PLAYER (<b>O</b>)";
      currentMove.classList.remove("hidden");
      document.getElementById("move-text").classList.remove("hidden");
    } else {
      document.getElementById("mode-button").innerHTML =
        '<img src="images/single-player.svg" width="30" alt="">';
      document.getElementById("mode-text").innerHTML = "1P";
      singlePlayerMode = true;
      document.getElementById("myDropdown").style.display = "block";
      dropBtn.classList.remove("hidden");
      diffText.classList.remove("hidden");
      document.getElementById("computer-text").innerHTML =
        "COMPUTER (<b>O</b>)";
      currentMove.classList.add("hidden");
      document.getElementById("move-text").classList.add("hidden");
      illegalMoveMsg.classList.add("hidden");
    }
  } else {
    illegalMoveMsg.innerHTML = "Create a New Game!";
    illegalMoveMsg.classList.remove("hidden");
    illegalMoveMsg.classList.remove("normal-slide-bottom");
    illegalMoveMsg.classList.add("illegal-move-msg-animation");
    setTimeout(() => {
      illegalMoveMsg.classList.add("hidden");
      illegalMoveMsg.classList.add("normal-slide-bottom");
      illegalMoveMsg.classList.remove("illegal-move-msg-animation");
    }, 2900);
  }
}

document.getElementById("score").onclick = changeMode;

btn.onclick = function () {
  modal2.style.display = "block";
};
span.onclick = function () {
  modal2.style.display = "none";
};
modal.classList.add("fade-out-modal1");
setTimeout(() => {
  modal.style.display = "none";
  infoSlide.classList.remove("hidden");
  infoSlide.style.animation = "info-slide 5s ease";
  setTimeout(() => {
    infoSlide.style.display = "none";
    infoShown = true;
  }, 4999);
}, 12990);

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  // dropBtn.innerHTML = "MEDIUM";
  if (event.target.matches(".modal")) {
    btn.style.opacity = "1";
    modal.style.display = "none";
    infoSlide.classList.remove("hidden");
    infoSlide.style.animation = "info-slide 5s ease";
    setTimeout(() => {
      infoSlide.style.display = "none";
      infoShown = true;
    }, 4999);
  } else if (!event.target.matches(".dropbtn")) {
    btn.style.opacity = "1";
    modal.style.display = "none";
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    if (
      document.getElementById("myDropdown").style.display == "none" &&
      !gameBegin
    )
      illegalMoveMsg.classList.remove("hidden");
    // document.getElementById("myDropdown").style.display = "none";
    if (!infoShown) {
      infoSlide.classList.remove("hidden");
      infoSlide.style.animation = "info-slide 5s ease";
      setTimeout(() => {
        infoSlide.style.display = "none";
      }, 4990);
      infoShown = true;
    }
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
};
function easyFunc() {
  depthLevel = 1;
  currentDifficultyLevel.innerHTML = "Difficulty Level - EASY";
  dropBtn.innerHTML = "EASY";
  if (soundOpen) SOUNDS.clickSound();
  document.getElementById("myDropdown").style.display = "none";
  document.getElementById("easy_btn").style.color = "cyan";
  document.getElementById("medium_btn").style.color = "white";
  document.getElementById("hard_btn").style.color = "white";
}
function mediumFunc() {
  depthLevel = 2;
  currentDifficultyLevel.innerHTML = "Difficulty Level - MEDIUM";
  dropBtn.innerHTML = "MEDIUM";
  if (soundOpen) SOUNDS.clickSound();
  document.getElementById("myDropdown").style.display = "none";
  document.getElementById("easy_btn").style.color = "white";
  document.getElementById("medium_btn").style.color = "cyan";
  document.getElementById("hard_btn").style.color = "white";
}
function hardFunc() {
  depthLevel = 4;
  currentDifficultyLevel.innerHTML = "Difficulty Level - HARD";
  dropBtn.innerHTML = "HARD";
  if (soundOpen) SOUNDS.clickSound();
  document.getElementById("myDropdown").style.display = "none";
  document.getElementById("easy_btn").style.color = "white";
  document.getElementById("medium_btn").style.color = "white";
  document.getElementById("hard_btn").style.color = "cyan";
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

  if (singlePlayerMode) {
    //New Game Set Up
    if (gameOver) {
      myFunction();
      if (soundOpen) SOUNDS.gameStartSound();
      illegalMoveMsg.innerHTML = "Please make a move in any area";
      winnerParent.classList.add("hidden");
      winnerContainer.classList.remove("winner-container");
      winnerParent.classList.remove("winner-parent");
      setTimeout(() => {
        winnerParent.classList.remove("hidden");
        winnerMsg.innerHTML = "NEW GAME";
        winnerContainer.classList.add("new-game-animation");
        winnerParent.classList.add("new-game-parent");
      }, 1);
      setTimeout(() => {
        winnerParent.classList.add("hidden");
        winnerParent.classList.remove("new-game-parent");
        winnerParent.classList.add("winner-parent");
        winnerContainer.classList.remove("new-game-animation");
        winnerContainer.classList.add("winner-container");
      }, 3000);
      gameBegin = false;
      if (dropBtn.classList.contains("hidden")) {
        dropBtn.classList.remove("hidden");
        diffText.classList.remove("hidden");
        resignBtn.classList.add("hidden");
        currentDifficultyLevel.classList.add("hidden");
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

      document.getElementById("myDropdown").style.display = "none";
      dropBtn.classList.add("hidden");
      winnerParent.classList.add("hidden");
      diffText.classList.add("hidden");
      resignBtn.innerHTML =
        "<img src='images/resign-flag.svg' alt='' /> Resign";
      resignBtn.classList.remove("hidden");
      currentDifficultyLevel.classList.remove("hidden");

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
            "red"
          );
          GB.drawBigMarks(currentBigBoardState, "white");
        }, 500);
      }
      // console.log(currentBigBoardState);
      // console.log(currentSmallBoardState);
    } //For Illegal Move
    else if (!gameOver) {
      if (soundOpen) SOUNDS.illegalSound();
      navigator.vibrate(200);
      illegalMoveMsg.innerHTML = "Please make a move in the indicated area";
      illegalMoveMsg.classList.remove("hidden");
      illegalMoveMsg.classList.remove("normal-slide-bottom");
      illegalMoveMsg.classList.add("illegal-move-msg-animation");
      setTimeout(() => {
        illegalMoveMsg.classList.add("hidden");
        illegalMoveMsg.classList.add("normal-slide-bottom");
        illegalMoveMsg.classList.remove("illegal-move-msg-animation");
      }, 2900);
      illegalMove();
    }

    //Game Over
    if (
      (!gameOver &&
        G1.terminalForBigBoard(currentBigBoardState, 999) &&
        G1.terminalForBigBoard(currentBigBoardState, "D")) ||
      !G1.action(currentSmallBoardState, currentBigBoardState, j) ||
      !G1.isAnyBlockEmpty(currentBigBoardState)
    ) {
      if (soundOpen) setTimeout(SOUNDS.gameEndSound(), 1000);
      updateScore();
      gameOverAnimantion();
      // resignBtn.classList.add("hidden");
      resignBtn.innerHTML = "<img src='images/plus.svg' alt='' /> New Game";
      illegalMoveMsg.innerHTML = "Click anywhere on the board to Play Again";
      illegalMoveMsg.classList.remove("hidden");
      illegalMoveMsg.classList.remove("normal-slide-bottom");
      illegalMoveMsg.classList.add("illegal-move-msg-animation");
      setTimeout(() => {
        illegalMoveMsg.classList.add("hidden");
        illegalMoveMsg.classList.add("normal-slide-bottom");
        illegalMoveMsg.classList.remove("illegal-move-msg-animation");
      }, 2900);
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
  // Multiplayer Mode
  else {
    //New Game Set Up MPM
    if (gameOver) {
      myFunction();
      if (soundOpen) SOUNDS.gameStartSound();
      illegalMoveMsg.innerHTML = "Please make a move in any area";
      winnerParent.classList.add("hidden");
      winnerContainer.classList.remove("winner-container");
      winnerParent.classList.remove("winner-parent");
      setTimeout(() => {
        winnerParent.classList.remove("hidden");
        winnerMsg.innerHTML = "NEW GAME";
        winnerContainer.classList.add("new-game-animation");
        winnerParent.classList.add("new-game-parent");
      }, 1);
      setTimeout(() => {
        winnerParent.classList.add("hidden");
        winnerParent.classList.remove("new-game-parent");
        winnerParent.classList.add("winner-parent");
        winnerContainer.classList.remove("new-game-animation");
        winnerContainer.classList.add("winner-container");
      }, 3000);
      document.getElementById("myDropdown").style.display = "none";
      dropBtn.classList.add("hidden");
      currentMove.classList.remove("hidden");
      document.getElementById("move-text").classList.remove("hidden");
      document.getElementById("winner-mpm").classList.add("hidden");
      resignBtn.classList.add("hidden");
      gameBegin = false;
      gameInitialState();
      return 0;
    }
    // Legal Move Code MPM
    if (
      currentMoveForX.includes(i) &&
      currentSmallBoardState[i][j] == 999 &&
      !G1.terminalForBigBoard(currentBigBoardState, 999) &&
      !gameOver
    ) {
      resignBtn.innerHTML =
        "<img src='images/resign-flag.svg' alt='' /> Resign";
      resignBtn.classList.remove("hidden");
      winnerParent.classList.add("hidden");
      illegalMoveMsg.classList.add("hidden");
      gameBegin = true;
      // Player X move
      if (playerX_Turn) {
        currentMove.style.color = "#2AAA8A";
        currentMove.innerHTML = "PLAYER O";
        GB.drawBoard();
        currentSmallBoardState[i][j] = "X";
        G1.bigBoardStateUpdater(
          i,
          "X",
          currentSmallBoardState,
          currentBigBoardState
        );
        if (soundOpen) SOUNDS.moveSound2();
        GB.drawBigMarks(currentBigBoardState, "white");
        playerX_Turn = false;
        currentMoveForX = G1.currentLegalMoveForX(
          currentSmallBoardState,
          currentBigBoardState,
          j
        );
        GB.highlightLegalMoves(currentMoveForX, "#8e44ad");
        GB.drawSmallMarks(currentSmallBoardState, "white");
        GB.drawBigMarks(currentBigBoardState, "white");
      }
      // Player O move
      else {
        currentMove.style.color = "#FF4545";
        currentMove.innerHTML = "PLAYER X";
        GB.drawBoard();
        currentSmallBoardState[i][j] = "O";
        G1.bigBoardStateUpdater(
          i,
          "O",
          currentSmallBoardState,
          currentBigBoardState
        );

        if (soundOpen) SOUNDS.moveSound2();
        GB.drawBigMarks(currentBigBoardState, "white");
        playerX_Turn = true;
        currentMoveForX = G1.currentLegalMoveForX(
          currentSmallBoardState,
          currentBigBoardState,
          j
        );
        GB.highlightLegalMoves(currentMoveForX, "#8e44ad");
        GB.drawSmallMarks(currentSmallBoardState, "white");
        GB.drawBigMarks(currentBigBoardState, "white");
      }
    }
    // Illegal Move MPM
    else if (!gameOver) {
      if (soundOpen) SOUNDS.illegalSound();
      navigator.vibrate(200);
      illegalMoveMsg.innerHTML = "Please make a move in the indicated area";
      illegalMoveMsg.classList.remove("hidden");
      illegalMoveMsg.classList.remove("normal-slide-bottom");
      illegalMoveMsg.classList.add("illegal-move-msg-animation");
      setTimeout(() => {
        illegalMoveMsg.classList.add("hidden");
        illegalMoveMsg.classList.add("normal-slide-bottom");
        illegalMoveMsg.classList.remove("illegal-move-msg-animation");
      }, 2900);
      illegalMove();
    }
    //Game Over MPM
    if (
      (!gameOver &&
        G1.terminalForBigBoard(currentBigBoardState, 999) &&
        G1.terminalForBigBoard(currentBigBoardState, "D")) ||
      !G1.action(currentSmallBoardState, currentBigBoardState, j) ||
      !G1.isAnyBlockEmpty(currentBigBoardState)
    ) {
      if (soundOpen) setTimeout(SOUNDS.gameEndSound(), 1000);
      updateScore();
      gameOverAnimantion();
      resignBtn.innerHTML = "<img src='images/plus.svg' alt='' /> New Game";
      illegalMoveMsg.innerHTML = "Click anywhere on the board to Play Again";
      illegalMoveMsg.classList.remove("hidden");
      illegalMoveMsg.classList.remove("normal-slide-bottom");
      illegalMoveMsg.classList.add("illegal-move-msg-animation");
      setTimeout(() => {
        illegalMoveMsg.classList.add("hidden");
        illegalMoveMsg.classList.add("normal-slide-bottom");
        illegalMoveMsg.classList.remove("illegal-move-msg-animation");
      }, 2900);
      let winner = "GAME DRAW";
      if (G1.utility(currentSmallBoardState, currentBigBoardState) == 1) {
        winner = "X WON";
        document.getElementById("winner-mpm").innerHTML = "Winner - PLAYER X";
      } else if (
        G1.utility(currentSmallBoardState, currentBigBoardState) == -1
      ) {
        winner = "O WON";
        document.getElementById("winner-mpm").innerHTML = "Winner - PLAYER O";
      } else {
        document.getElementById("winner-mpm").innerHTML = "Result - GAME DRAW";
      }
      document.getElementById("winner-mpm").classList.remove("hidden");
      winnerMsg.innerHTML = winner;
      winnerParent.classList.remove("hidden");
      currentMove.classList.add("hidden");
      document.getElementById("move-text").classList.add("hidden");
      gameOver = true;
    }
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
      playerScoreEle.classList.add("w3-container");
      playerScoreEle.classList.add("w3-center");
      playerScoreEle.classList.add("w3-animate-zoom");
    });
  } else if (G1.utility(currentSmallBoardState, currentBigBoardState) == -1) {
    computerScore += 1;
    computerScoreEle.innerText = `${computerScore}`;
    computerScoreEle.classList.add("hidden");
    setTimeout(() => {
      computerScoreEle.classList.remove("hidden");
      computerScoreEle.classList.add("w3-container");
      computerScoreEle.classList.add("w3-center");
      computerScoreEle.classList.add("w3-animate-zoom");
    });
  } else {
    tieScore += 1;
    tieScoreEle.innerText = `${tieScore}`;
    tieScoreEle.classList.add("hidden");
    setTimeout(() => {
      tieScoreEle.classList.remove("hidden");
      tieScoreEle.classList.add("w3-container");
      tieScoreEle.classList.add("w3-center");
      tieScoreEle.classList.add("w3-animate-zoom");
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
