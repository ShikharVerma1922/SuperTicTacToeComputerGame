class Game {
  constructor() {
    this.allNodeValues = {};
  }
  bestMoveForMiniMax(csbs, cbbs, pmc_j, depth, maximizingPlayer) {
    if (!this.action(csbs, cbbs, pmc_j)) return undefined;
    let bestMoves = [];
    let minimaxValue = this.minimax(
      csbs,
      csbs,
      cbbs,
      cbbs,
      pmc_j,
      depth,
      depth,
      maximizingPlayer,
      -99,
      99
    );
    let bestScore = minimaxValue[0];
    let allChildValues = minimaxValue[1];
    for (let ele in allChildValues) {
      if (allChildValues[ele] == bestScore) bestMoves.push(ele);
    }
    if (bestMoves.length != 0) {
      let bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      let l = bestMove.split(" ");
      return [parseInt(l[0]), parseInt(l[1])];
    }
  }
  player(s) {
    let total_X = 0;
    let total_O = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (s[i][j] == "X") total_X += 1;
        else if (s[i][j] == "O") total_O += 1;
      }
    }
    if (total_X > total_O) return "O";
    else return "X";
  }
  action(s, bigBoard, previousMoveCell) {
    let a = new Array();
    if (bigBoard[previousMoveCell] == 999) {
      for (let i = 0; i < 9; i++) {
        if (s[previousMoveCell][i] == 999) {
          a.push(previousMoveCell.toString().concat(" ", i.toString()));
        }
      }
    } else {
      for (let i = 0; i < 9; i++) {
        if (bigBoard[i] == 999) {
          for (let j = 0; j < 9; j++) {
            if (s[i][j] == 999) a.push(i.toString().concat(" ", j.toString()));
          }
        }
      }
    }
    return a;
  }
  result(s, a, maximizingPlayer) {
    let r = structuredClone(s);
    let l = a.split(" ");
    let i = parseInt(l[0]);
    let j = parseInt(l[1]);
    if (maximizingPlayer) r[i][j] = "X";
    else r[i][j] = "O";
    return r;
  }
  terminal(s, bigBoard) {
    for (let i = 0; i < 9; i++) {
      if (bigBoard[i] == 999) {
        if (
          (s[i][0] == s[i][1] && s[i][0] == s[i][2] && s[i][0] != 999) ||
          (s[i][3] == s[i][4] && s[i][3] == s[i][5] && s[i][3] != 999) ||
          (s[i][6] == s[i][7] && s[i][6] == s[i][8] && s[i][6] != 999) ||
          (s[i][0] == s[i][3] && s[i][0] == s[i][6] && s[i][0] != 999) ||
          (s[i][1] == s[i][4] && s[i][1] == s[i][7] && s[i][1] != 999) ||
          (s[i][2] == s[i][5] && s[i][2] == s[i][8] && s[i][2] != 999) ||
          (s[i][0] == s[i][4] && s[i][0] == s[i][8] && s[i][0] != 999) ||
          (s[i][2] == s[i][4] && s[i][2] == s[i][6] && s[i][2] != 999)
        ) {
          return 1;
        }
      }
    }
    return 0;
  }
  utility(s, bigBoard) {
    if (this.player(s) == "O" && this.terminalForBigBoard(bigBoard, "D"))
      return 1;
    else if (this.player(s) == "X" && this.terminalForBigBoard(bigBoard, "D"))
      return -1;
    else if (!this.terminalForBigBoard(bigBoard, "D")) return 0;
  }
  terminalForBigBoard(bigBoard, placeHolder) {
    if (
      (bigBoard[0] == bigBoard[1] &&
        bigBoard[0] == bigBoard[2] &&
        bigBoard[0] != placeHolder) ||
      (bigBoard[3] == bigBoard[4] &&
        bigBoard[3] == bigBoard[5] &&
        bigBoard[3] != placeHolder) ||
      (bigBoard[6] == bigBoard[7] &&
        bigBoard[6] == bigBoard[8] &&
        bigBoard[6] != placeHolder) ||
      (bigBoard[0] == bigBoard[3] &&
        bigBoard[0] == bigBoard[6] &&
        bigBoard[0] != placeHolder) ||
      (bigBoard[1] == bigBoard[4] &&
        bigBoard[1] == bigBoard[7] &&
        bigBoard[1] != placeHolder) ||
      (bigBoard[2] == bigBoard[5] &&
        bigBoard[2] == bigBoard[8] &&
        bigBoard[2] != placeHolder) ||
      (bigBoard[0] == bigBoard[4] &&
        bigBoard[0] == bigBoard[8] &&
        bigBoard[0] != placeHolder) ||
      (bigBoard[2] == bigBoard[4] &&
        bigBoard[2] == bigBoard[6] &&
        bigBoard[2] != placeHolder)
    )
      return 1;
    else return 0;
  }
 minimax(
    updated_s,
    actual_s,
    updatedBigBoard,
    actualBigBoard,
    previousMoveCell_j,
    updatedDepth,
    actualDepth,
    maximizingPlayer,
    alpha,
    beta
  ) {
    if (
      updatedDepth == 0 ||
      (this.terminalForBigBoard(updatedBigBoard, 999) &&
        this.terminalForBigBoard(updatedBigBoard, "D")) ||
      !this.action(updated_s, updatedBigBoard, previousMoveCell_j)
    ) {
      return [this.evaluation(updatedBigBoard, maximizingPlayer), undefined];
    }

    let bestMove = {};

    if (maximizingPlayer) {
      let max_val = -99;
      for (let act of this.action(
        updated_s,
        updatedBigBoard,
        previousMoveCell_j
      )) {
        let l = act.split(" ");
        let currentCellMove_i = parseInt(l[0]);
        let currentCellMove_j = parseInt(l[1]);
        let result_s = this.result(updated_s, act, maximizingPlayer);
        let result_bigB = this.updatedBigBoardFunc(
          result_s,
          updatedBigBoard,
          currentCellMove_i,
          maximizingPlayer
        );
        let v = this.minimax(
          result_s,
          actual_s,
          result_bigB,
          actualBigBoard,
          currentCellMove_j,
          updatedDepth - 1,
          actualDepth,
          false,
          alpha,
          beta
        )[0];
        if (
          updatedDepth >= actualDepth - 1 &&
          (v == 0 || v == -5 || v == -3 || v == 4)
        ) {
          if (this.terminal(result_s, updatedBigBoard)) {
            if (v == -5 && actualBigBoard > 3) v = -4;
            else v = 5;
          }

          // console.log(this.result(updated_s, act, !maximizingPlayer));
          else if (v != -5 && v != -4 && actualDepth > 1) {
            let result_sForOpponent = this.result(
              updated_s,
              act,
              !maximizingPlayer
            );
            if (this.terminal(result_sForOpponent, updatedBigBoard)) v = 3;
          }
        }
        if (updatedDepth == actualDepth) bestMove[act] = v;
        if (v > max_val) {
          max_val = v;
          // bestMove = [currentCellMove_i, currentCellMove_j];
        }
        if (updatedDepth < actualDepth - 1) {
          if (v > alpha) alpha = v;
          if (beta <= alpha) break;
        }
      }
      return [max_val, bestMove];
    } else {
      let min_val = 99;
      for (let act of this.action(
        updated_s,
        updatedBigBoard,
        previousMoveCell_j
      )) {
        let l = act.split(" ");
        let currentCellMove_i = parseInt(l[0]);
        let currentCellMove_j = parseInt(l[1]);
        let result_s = this.result(updated_s, act, maximizingPlayer);
        let result_bigB = this.updatedBigBoardFunc(
          result_s,
          updatedBigBoard,
          currentCellMove_i,
          maximizingPlayer
        );
        let v = this.minimax(
          result_s,
          actual_s,
          result_bigB,
          actualBigBoard,
          currentCellMove_j,
          updatedDepth - 1,
          actualDepth,
          true,
          alpha,
          beta
        )[0];
        if (
          updatedDepth >= actualDepth - 1 &&
          (v == 0 || v == 5 || v == 3 || v == -4)
        ) {
          if (this.terminal(result_s, updatedBigBoard)) {
            if (v == 5 && actualDepth > 3) v = 4;
            else v = -5;
          } else if (v != 5 && v != 4 && actualDepth > 1) {
            let result_sForOpponent = this.result(
              updated_s,
              act,
              !maximizingPlayer
            );
            if (this.terminal(result_sForOpponent, updatedBigBoard)) v = -3;
          }
        }
        if (v == -99) v = 0;
        if (updatedDepth == actualDepth) bestMove[act] = v;
        if (v < min_val) {
          min_val = v;
          // bestMove = [currentCellMove_i, currentCellMove_j];
        }
        if (updatedDepth < actualDepth - 1) {
          if (v < beta) beta = v;
          if (beta <= alpha) break;
        }
      }
      // if (updatedDepth == 4) console.log(bestMove);
      return [min_val, bestMove];
    }
  }
  evaluation(updatedBigBoard, maximizingPlayer) {
    if (
      this.terminalForBigBoard(updatedBigBoard, 999) &&
      this.terminalForBigBoard(updatedBigBoard, "D")
    ) {
      if (maximizingPlayer) return -10;
      else return 10;
    } else return 0;
  }
  updatedBigBoardFunc(
    updated_s,
    bigBoard,
    currentCellMove_i,
    maximizingPlayer
  ) {
    let temp = structuredClone(bigBoard);
    if (this.terminal(updated_s, bigBoard)) {
      if (maximizingPlayer) temp[currentCellMove_i] = "X";
      else temp[currentCellMove_i] = "O";
    } else if (!this.action(updated_s, bigBoard, currentCellMove_i))
      temp[currentCellMove_i] = "D";
    return temp;
  }
  bigBoardStateUpdater(currentMove, mark, CSBS, CBBS) {
    if (this.terminal(CSBS, CBBS)) CBBS[currentMove] = mark;
    else if (this.action(CSBS, CBBS, currentMove).length == 0) {
      CBBS[currentMove] = "D";
    }
  }
  winningRow(bigBoard) {
    if (
      bigBoard[0] == bigBoard[1] &&
      bigBoard[0] == bigBoard[2] &&
      bigBoard[0] != 999
    )
      return [0, 1, 2];
    else if (
      bigBoard[3] == bigBoard[4] &&
      bigBoard[3] == bigBoard[5] &&
      bigBoard[3] != 999
    )
      return [3, 4, 5];
    else if (
      bigBoard[6] == bigBoard[7] &&
      bigBoard[6] == bigBoard[8] &&
      bigBoard[6] != 999
    )
      return [6, 7, 8];
    else if (
      bigBoard[0] == bigBoard[3] &&
      bigBoard[0] == bigBoard[6] &&
      bigBoard[0] != 999
    )
      return [0, 3, 6];
    else if (
      bigBoard[1] == bigBoard[4] &&
      bigBoard[1] == bigBoard[7] &&
      bigBoard[1] != 999
    )
      return [1, 4, 7];
    else if (
      bigBoard[2] == bigBoard[5] &&
      bigBoard[2] == bigBoard[8] &&
      bigBoard[2] != 999
    )
      return [2, 5, 8];
    else if (
      bigBoard[0] == bigBoard[4] &&
      bigBoard[0] == bigBoard[8] &&
      bigBoard[0] != 999
    )
      return [0, 4, 8];
    else if (
      bigBoard[2] == bigBoard[4] &&
      bigBoard[2] == bigBoard[6] &&
      bigBoard[2] != 999
    )
      return [2, 4, 6];
    else {
      return undefined;
    }
  }
  currentLegalMoveForX(s, bigBoard, previousMove) {
    let a = this.action(s, bigBoard, previousMove);
    let tempList = new Array();
    for (let ele of a) {
      let l = ele.split(" ");
      let i = parseInt(l[0]);
      tempList.push(i);
    }
    return tempList;
  }
  isAnyBlockEmpty(bigBoard) {
    for (let i = 0; i < 9; i++) {
      if (bigBoard[i] == 999) {
        return true;
      }
    }
    return false;
  }
}


