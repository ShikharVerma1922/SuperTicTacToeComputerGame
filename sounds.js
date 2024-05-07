class Sounds {
  moveSound() {
    let moveSound = new Audio("sounds/move_2.mp3");
    moveSound.play();
  }
  captureSound() {
    let captureSound = new Audio("sounds/capture.mp3");
    captureSound.play();
  }
  illegalSound() {
    let illegalSound = new Audio("sounds/illegal-move.mp3");
    illegalSound.play();
  }
  gameStartSound() {
    let gameStartSound = new Audio("sounds/notify (online-audio-converter.com).mp3");
    gameStartSound.play();
  }
  gameEndSound() {
    let gameEndSound = new Audio("sounds/game-end_2.mp3");
    gameEndSound.play();
  }
}
