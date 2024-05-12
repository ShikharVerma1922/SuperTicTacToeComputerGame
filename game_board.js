class GameBoard {
  constructor(cd, ctx) {
    this.cd = cd;
    this.ctx = ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cd, cd);
    this.coordinatesOfEachCell = [
      this.coordinatesOfSingleBlock(0, 0),
      this.coordinatesOfSingleBlock(this.cd / 3, 0),
      this.coordinatesOfSingleBlock((this.cd * 2) / 3, 0),
      this.coordinatesOfSingleBlock(0, this.cd / 3),
      this.coordinatesOfSingleBlock(this.cd / 3, this.cd / 3),
      this.coordinatesOfSingleBlock((this.cd * 2) / 3, this.cd / 3),
      this.coordinatesOfSingleBlock(0, (this.cd * 2) / 3),
      this.coordinatesOfSingleBlock(this.cd / 3, (this.cd * 2) / 3),
      this.coordinatesOfSingleBlock((this.cd * 2) / 3, (this.cd * 2) / 3),
    ];
    this.drawBoard();
  }
  drawSmallMarks(s, color) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let k = this.coordinatesOfEachCell[i][j][0];
        let l = this.coordinatesOfEachCell[i][j][1];
        if (s[i][j] == "X") {
          this.drawX(k, l, color);
        } else if (s[i][j] == "O") {
          this.drawO(k, l, color);
        }
      }
    }
  }
  drawBigMarks(bigBoard, color) {
    for (let i = 0; i < 9; i++) {
      let m = this.coordinatesOfEachBlock()[i][0];
      let n = this.coordinatesOfEachBlock()[i][1];
      if (bigBoard[i] == "X") this.drawBigX(m, n, color);
      else if (bigBoard[i] == "O") this.drawBigO(m, n, color);
    }
  }
  coordinatesOfEachBlock() {
    let lst = [
      [0, 0],
      [this.cd / 3, 0],
      [(this.cd * 2) / 3, 0],
      [0, this.cd / 3],
      [this.cd / 3, this.cd / 3],
      [(this.cd * 2) / 3, this.cd / 3],
      [0, (this.cd * 2) / 3],
      [this.cd / 3, (this.cd * 2) / 3],
      [(this.cd * 2) / 3, (this.cd * 2) / 3],
    ];
    return lst;
  }
  coordinatesOfSingleBlock(topLeftX, topLeftY) {
    let lst = [
      [topLeftX + 0, topLeftY + 0],
      [topLeftX + this.cd / 9, topLeftY + 0],
      [topLeftX + (this.cd * 2) / 9, topLeftY + 0],
      [topLeftX + 0, topLeftY + this.cd / 9],
      [topLeftX + this.cd / 9, topLeftY + this.cd / 9],
      [topLeftX + (this.cd * 2) / 9, topLeftY + this.cd / 9],
      [topLeftX + 0, topLeftY + (this.cd * 2) / 9],
      [topLeftX + this.cd / 9, topLeftY + (this.cd * 2) / 9],
      [topLeftX + (this.cd * 2) / 9, topLeftY + (this.cd * 2) / 9],
    ];
    return lst;
  }
  drawLine(
    moveTo_x,
    moveTo_y,
    lineTo_x,
    lineTo_y,
    lineWidth,
    strokeStyle,
    lineCap
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(moveTo_x, moveTo_y);
    this.ctx.lineTo(lineTo_x, lineTo_y);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineCap = lineCap;
    this.ctx.stroke();
  }
  drawBoard() {
    for (let j = 0; j <= 2; j++) {
      for (let i = 0; i <= 7; i++) {
        this.drawLine(
          (this.cd / 9) * i + this.cd / 9,
          this.cd * 0.02 + (this.cd / 3) * j,
          (this.cd / 9) * i + this.cd / 9,
          this.cd / 3 - this.cd * 0.02 + (this.cd / 3) * j,
          this.cd * 0.005,
          "white",
          "square"
        );

        this.drawLine(
          this.cd * 0.02 + (this.cd / 3) * j,
          (this.cd / 9) * i + this.cd / 9,
          this.cd / 3 - this.cd * 0.02 + (this.cd / 3) * j,
          (this.cd / 9) * i + this.cd / 9,
          this.cd * 0.005,
          "white",
          "square"
        );
      }
    }
    for (let i = 1; i <= 2; i++) {
      this.drawLine(
        (this.cd / 3) * i,
        0,
        (this.cd / 3) * i,
        this.cd,
        this.cd * 0.012,
        "cyan",
        "square"
      );

      this.drawLine(
        // this.cd * 0.02,
        0,
        (this.cd / 3) * i,
        this.cd,
        (this.cd / 3) * i,
        this.cd * 0.012,
        "cyan",
        "square"
      );
    }
  }
  drawX(x, y, color) {
    this.ctx.beginPath();
    ctx.fillStyle = "#FF4545";
    ctx.fillRect(
      x + this.cd * 0.01,
      y + this.cd * 0.01,
      this.cd / 9 - this.cd * 0.02,
      this.cd / 9 - this.cd * 0.02
    );
    this.ctx.beginPath();
    this.drawLine(
      x + this.cd * 0.035,
      y + this.cd * 0.025,
      x + this.cd / 9 - this.cd * 0.035,
      y + this.cd / 9 - this.cd * 0.025,
      this.cd * 0.008,
      color,
      "butt"
    );
    this.drawLine(
      x + this.cd / 9 - this.cd * 0.035,
      y + this.cd * 0.025,
      x + this.cd * 0.035,
      y + this.cd / 9 - this.cd * 0.025,
      this.cd * 0.008,
      color,
      "butt"
    );
  }
  drawO(x, y, color) {
    this.ctx.beginPath();
    ctx.fillStyle = "#2AAA8A";
    ctx.fillRect(
      x + this.cd * 0.01,
      y + this.cd * 0.01,
      this.cd / 9 - this.cd * 0.02,
      this.cd / 9 - this.cd * 0.02
    );
    this.ctx.beginPath();
    this.ctx.arc(
      x + this.cd / 18,
      y + this.cd / 18,
      this.cd / 18 - this.cd * 0.02,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.webkitImageSmoothingEnabled = true;
    this.ctx.beginPath();
    this.ctx.arc(
      x + this.cd / 18,
      y + this.cd / 18,
      this.cd / 18 - this.cd * 0.03,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = "#2AAA8A";
    this.ctx.fill();
  }
  drawBigX(x, y, color) {
    this.ctx.beginPath();
    this.ctx.rect(
      x + this.cd * 0.009,
      y + this.cd * 0.009,
      this.cd / 3 - this.cd * 0.018,
      this.cd / 3 - this.cd * 0.018
    );
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.beginPath();
    this.drawLine(
      x + this.cd * 0.06,
      y + this.cd * 0.06,
      x + this.cd / 3 - this.cd * 0.06,
      y + this.cd / 3 - this.cd * 0.06,
      this.cd * 0.045,
      color,
      "butt"
    );
    this.drawLine(
      x + this.cd / 3 - this.cd * 0.06,
      y + this.cd * 0.06,
      x + this.cd * 0.06,
      y + this.cd / 3 - this.cd * 0.06,
      this.cd * 0.045,
      color,
      "butt"
    );
  }
  drawBigO(x, y, color) {
    this.ctx.beginPath();
    this.ctx.rect(
      x + this.cd * 0.009,
      y + this.cd * 0.009,
      this.cd / 3 - this.cd * 0.018,
      this.cd / 3 - this.cd * 0.018
    );
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(
      x + this.cd / 6,
      y + this.cd / 6,
      this.cd / 6 - this.cd * 0.04,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(
      x + this.cd / 6,
      y + this.cd / 6,
      this.cd / 6 - this.cd * 0.08,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }
  defineCellInSingleBoard(canvs_x, canvs_y, topLeftX, topLeftY) {
    let block11 =
      canvs_x > topLeftX &&
      canvs_x < topLeftX + this.cd / 9 &&
      canvs_y > topLeftY &&
      canvs_y < topLeftY + this.cd / 9;
    let block12 =
      canvs_x > topLeftX + this.cd / 9 &&
      canvs_x < topLeftX + (this.cd * 2) / 9 &&
      canvs_y > topLeftY &&
      canvs_y < topLeftY + this.cd / 9;
    let block13 =
      canvs_x >= topLeftX + (this.cd * 2) / 9 &&
      canvs_x <= topLeftX + this.cd / 3 &&
      canvs_y >= topLeftY &&
      canvs_y <= topLeftY + this.cd / 9;
    let block21 =
      canvs_x >= topLeftX &&
      canvs_x <= topLeftX + this.cd / 9 &&
      canvs_y >= topLeftY + this.cd / 9 &&
      canvs_y <= topLeftY + (this.cd * 2) / 9;
    let block22 =
      canvs_x >= topLeftX + this.cd / 9 &&
      canvs_x <= topLeftX + (this.cd * 2) / 9 &&
      canvs_y >= topLeftY + this.cd / 9 &&
      canvs_y <= topLeftY + (this.cd * 2) / 9;
    let block23 =
      canvs_x >= topLeftX + (this.cd * 2) / 9 &&
      canvs_x <= topLeftX + this.cd / 3 &&
      canvs_y >= topLeftY + this.cd / 9 &&
      canvs_y <= topLeftY + (this.cd * 2) / 9;
    let block31 =
      canvs_x >= topLeftX &&
      canvs_x <= topLeftX + this.cd / 9 &&
      canvs_y >= topLeftY + (this.cd * 2) / 9 &&
      canvs_y <= topLeftY + this.cd / 3;
    let block32 =
      canvs_x >= topLeftX + this.cd / 9 &&
      canvs_x <= topLeftX + (this.cd * 2) / 9 &&
      canvs_y >= topLeftY + (this.cd * 2) / 9 &&
      canvs_y <= topLeftY + this.cd / 3;
    let block33 =
      canvs_x >= topLeftX + (this.cd * 2) / 9 &&
      canvs_x <= topLeftX + this.cd / 3 &&
      canvs_y >= topLeftY + (this.cd * 2) / 9 &&
      canvs_y <= topLeftY + this.cd / 3;
    return [
      block11,
      block12,
      block13,
      block21,
      block22,
      block23,
      block31,
      block32,
      block33,
    ];
  }
  giveCurrentCellClick(canvs_x, canvs_y) {
    let definingEveryCellList = [
      this.defineCellInSingleBoard(canvs_x, canvs_y, 0, 0),
      this.defineCellInSingleBoard(canvs_x, canvs_y, this.cd / 3, 0),
      this.defineCellInSingleBoard(canvs_x, canvs_y, (this.cd * 2) / 3, 0),
      this.defineCellInSingleBoard(canvs_x, canvs_y, 0, this.cd / 3),
      this.defineCellInSingleBoard(canvs_x, canvs_y, this.cd / 3, this.cd / 3),
      this.defineCellInSingleBoard(
        canvs_x,
        canvs_y,
        (this.cd * 2) / 3,
        this.cd / 3
      ),
      this.defineCellInSingleBoard(canvs_x, canvs_y, 0, (this.cd * 2) / 3),
      this.defineCellInSingleBoard(
        canvs_x,
        canvs_y,
        this.cd / 3,
        (this.cd * 2) / 3
      ),
      this.defineCellInSingleBoard(
        canvs_x,
        canvs_y,
        (this.cd * 2) / 3,
        (this.cd * 2) / 3
      ),
    ];
    let row = 0;
    let column = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (definingEveryCellList[i][j]) {
          row = i;
          column = j;
        }
      }
    }
    return [row, column];
  }
  highlightLegalMoves(cmfx, color) {
    this.drawBoard();
    for (let ele of cmfx) {
      let p = this.coordinatesOfEachBlock()[ele][0];
      let q = this.coordinatesOfEachBlock()[ele][1];
      this.highlightOneBoard(p, q, color);
    }
  }
  highlightOneBoard(x, y, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x + this.cd * 0.005,
      y + this.cd * 0.005,
      this.cd / 3 - this.cd * 0.01,
      this.cd / 3 - this.cd * 0.01
    );
    for (let i = 1; i <= 2; i++) {
      this.drawLine(
        x + (this.cd / 9) * i,
        y + this.cd * 0.02,
        x + (this.cd / 9) * i,
        y + this.cd / 3 - this.cd * 0.02,
        this.cd * 0.005,
        "white",
        "square"
      );

      this.drawLine(
        x + this.cd * 0.02,
        y + (this.cd / 9) * i,
        x + this.cd / 3 - this.cd * 0.02,
        y + (this.cd / 9) * i,
        this.cd * 0.005,
        "white",
        "square"
      );
    }
  }
  drawOnlyBigBoard(color) {
    for (let i = 1; i <= 2; i++) {
      this.drawLine(
        (this.cd / 3) * i,
        this.cd * 0.02,
        (this.cd / 3) * i,
        this.cd - this.cd * 0.02,
        this.cd * 0.01,
        color,
        "square"
      );

      this.drawLine(
        this.cd * 0.02,
        (this.cd / 3) * i,
        this.cd - this.cd * 0.02,
        (this.cd / 3) * i,
        this.cd * 0.01,
        color,
        "square"
      );
    }
  }
}

