class Game {
  constructor() {
    this.allNodeValues = {};
  }
  bestMoveForO(s, bigBoard, previousMoveCell) {
    if (!this.action(s, bigBoard, previousMoveCell)) {
      return 0;
    }
    let best_val = this.minimumValue(s, bigBoard, previousMoveCell);
    let allBestMoves = [];
    for (let ele in this.allNodeValues) {
      let result = structuredClone(s);
      let l = ele.split(" ");
      let i = parseInt(l[0]);
      let j = parseInt(l[1]);
      result[i][j] = "O";
      if (
        this.allNodeValues[ele] == best_val &&
        this.terminal(result, bigBoard)
      ) {
        let best_move = [i, j];
        allBestMoves.push(best_move);
      }
    }
    if (allBestMoves.length != 0)
      return allBestMoves[Math.floor(Math.random() * allBestMoves.length)];
    for (let ele in this.allNodeValues) {
      let result = structuredClone(s);
      let l = ele.split(" ");
      let i = parseInt(l[0]);
      let j = parseInt(l[1]);
      result[i][j] = "X";
      if (
        this.allNodeValues[ele] == best_val &&
        this.terminal(result, bigBoard)
      ) {
        let best_move = [i, j];
        allBestMoves.push(best_move);
      }
    }
    if (allBestMoves.length != 0)
      return allBestMoves[Math.floor(Math.random() * allBestMoves.length)];
    for (let ele in this.allNodeValues) {
      let l = ele.split(" ");
      let i = parseInt(l[0]);
      let j = parseInt(l[1]);
      if (this.allNodeValues[ele] == best_val) {
        let best_move = [i, j];
        allBestMoves.push(best_move);
      }
    }
    if (allBestMoves.length != 0)
      return allBestMoves[Math.floor(Math.random() * allBestMoves.length)];
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
  result(s, a) {
    let r = structuredClone(s);
    let l = a.split(" ");
    let i = parseInt(l[0]);
    let j = parseInt(l[1]);
    // r[i] = [];
    if (this.player(s) == "X") r[i][j] = "X";
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
  utility(s) {
    if (this.player(s) == "O" && this.terminalForBigBoard(s, "D")) return 1;
    else if (this.player(s) == "X" && this.terminalForBigBoard(s, "D"))
      return -1;
    else if (!this.terminalForBigBoard(s, "D")) return 0;
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
  minimumValue(s, bigBoard, previousMoveCell) {
    let v = 99;
    for (let act of this.action(s, bigBoard, previousMoveCell)) {
      let result = this.result(s, act);
      let l = act.split(" ");
      let currentCellMove = parseInt(l[1]);
      let val = this.maximumValue(result, bigBoard, currentCellMove);
      this.allNodeValues[act] = val;
      if (val < v) v = val;
    }
    return v;
  }
  maximumValue(s, bigBoard, previousMoveCell) {
    let maxVal = -99;
    for (let act of this.action(s, bigBoard, previousMoveCell)) {
      let bigBoardCopy = structuredClone(bigBoard);
      let result = this.result(s, act);
      if (this.terminal(result, bigBoard)) {
        let l = act.split(" ");
        let i = parseInt(l[0]);
        bigBoardCopy[i] = "X";
        if (this.terminalForBigBoard(bigBoardCopy, 999)) {
          if (1 > maxVal) maxVal = 1;
        } else {
          if (0 > maxVal) maxVal = 0;
        }
      }
    }
    if (maxVal == -99) return -1;
    else return maxVal;
  }
  bigBoardStateUpdater(currentMove, mark, CSBS, CBBS) {
    console.log(this.action(CSBS, CBBS, currentMove).length);
    if (this.terminal(CSBS, CBBS)) CBBS[currentMove] = mark;
    else if (this.action(CSBS, CBBS, currentMove).length == 0) {
      CBBS[currentMove] = "D";
      console.log("YES D");
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
}

