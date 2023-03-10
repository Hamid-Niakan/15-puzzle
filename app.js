// game
class Game {
  difficulties = [50, 200, 800];
  blocks = [];
  indexes = [];
  emptyBlockCoords = [];
  whiteColor = "#f2e9e4";
  blackColor = "#22223b";
  blockSize = 60;

  constructor(cols, rows, difficulty) {
    this.cols = cols;
    this.rows = rows;
    this.count = cols * rows;
    this.difficulty = difficulty;
    this.init();
  }

  init() {
    const puzzleContainer = document.getElementById("puzzle_container");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const totalWidth = this.blockSize * this.cols;
    const totalHeight = this.blockSize * this.rows;
    const containerStyle = puzzleContainer.style;
    if (totalWidth < windowWidth && totalHeight < windowHeight) {
      containerStyle.width = totalWidth + "px";
      containerStyle.height = totalHeight + "px";
    } else {
      const blockSizeByWidth = Math.floor((windowWidth - 20) / this.cols);
      if (blockSizeByWidth * this.rows < windowHeight) {
        this.blockSize = blockSizeByWidth;
      } else {
        this.blockSize = Math.floor((windowHeight - 20) / this.rows);
      }
      containerStyle.width = this.blockSize * this.cols + "px";
      containerStyle.height = this.blockSize * this.rows + "px";
    }
    while (puzzleContainer.firstChild) {
      puzzleContainer.removeChild(puzzleContainer.firstChild);
    }
    for (let i = 1; i <= this.count - 1; i++) {
      const block = document.createElement("div");
      block.className = "puzzle_block";
      block.textContent = i;
      block.style.width = this.blockSize + "px";
      block.style.height = this.blockSize + "px";
      puzzleContainer.appendChild(block);
      this.blocks.push(block);
    }
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const blockIndex = x + y * this.cols;
        if (blockIndex + 1 >= this.count) break;
        const block = this.blocks[blockIndex];
        this.positionBlockAtCoord(blockIndex, x, y);
        block.addEventListener("click", (e) => this.onClickOnBlock(blockIndex));
        this.indexes.push(blockIndex);
      }
    }
    this.indexes.push(this.count - 1);
    this.emptyBlockCoords.push(this.cols - 1, this.rows - 1);
    this.randomize();
  }

  positionBlockAtCoord(blockIndex, x, y) {
    const block = this.blocks[blockIndex];
    block.style.left = x * block.clientWidth + "px";
    block.style.top = y * block.clientWidth + "px";
  }

  onClickOnBlock(blockIndex) {
    if (this.moveBlock(blockIndex)) {
      if (this.checkPuzzleSolved()) {
        setTimeout(() => alert("Puzzle Solved!!"), 300);
      }
    }
  }

  checkPuzzleSolved() {
    for (let i = 0; i < this.indexes.length; i++) {
      if (i === this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols)
        continue;
      if (this.indexes[i] !== i) {
        this.blocks[i].style.color = this.whiteColor;
        return false;
      } else {
        this.blocks[i].style.color = this.blackColor;
      }
    }
    return true;
  }

  moveBlock(blockIndex) {
    const block = this.blocks[blockIndex];
    const blockCoords = this.canMoveBlock(block);
    if (blockCoords !== null) {
      this.positionBlockAtCoord(
        blockIndex,
        this.emptyBlockCoords[0],
        this.emptyBlockCoords[1]
      );
      this.indexes[
        this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols
      ] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols];
      this.emptyBlockCoords[0] = blockCoords[0];
      this.emptyBlockCoords[1] = blockCoords[1];
      return true;
    }
    return false;
  }

  canMoveBlock(block) {
    const blockPos = [parseInt(block.style.left), parseInt(block.style.top)];
    const blockWidth = block.clientWidth;
    const blockCoords = [blockPos[0] / blockWidth, blockPos[1] / blockWidth];
    const diff = [
      Math.abs(blockCoords[0] - this.emptyBlockCoords[0]),
      Math.abs(blockCoords[1] - this.emptyBlockCoords[1]),
    ];
    const canMove =
      (diff[0] === 1 && diff[1] === 0) || (diff[0] === 0 && diff[1] === 1);
    if (canMove) return blockCoords;
    else return null;
  }

  randomize() {
    const iterationCount = this.difficulties[this.difficulty - 1];
    for (let i = 0; i < iterationCount; i++) {
      const randomBlockIndex = Math.floor(Math.random() * (this.count - 1));
      const moved = this.moveBlock(randomBlockIndex);
      if (!moved) i--;
    }
  }
}

let game = new Game(5, 5, 2);

// input range
class RangeInput {
  constructor(inputSelector, outputSelector, initValue) {
    this.input = document.querySelector(inputSelector);
    this.output = document.querySelector(outputSelector);
    this.input.value = initValue;
    this.output.innerHTML = this.input.value;
    this.input.addEventListener("input", this.updateOutput.bind(this));
  }

  updateOutput() {
    this.output.innerHTML = this.input.value;
  }
}

const columnInput = new RangeInput("#columnInput", "#columnValue", "5");
const rowInput = new RangeInput("#rowInput", "#rowValue", "5");
// const blockSizeInput = new RangeInput(
//   "#blockSizeInput",
//   "#blockSizeValue",
//   "50"
// );
const difficultyInput = new RangeInput(
  "#difficultyInput",
  "#difficultyValue",
  "2"
);

columnInput.input.addEventListener("change", (e) => {
  game = new Game(Number(columnInput.input.value), game.rows, game.difficulty);
});

rowInput.input.addEventListener("change", (e) => {
  game = new Game(game.cols, Number(rowInput.input.value), game.difficulty);
});

// blockSizeInput.input.addEventListener("change", (e) => {
//   game = new Game(
//     game.cols,
//     game.rows,
//     Number(blockSizeInput.input.value),
//     game.difficulty
//   );
// });

difficultyInput.input.addEventListener("change", (e) => {
  game = new Game(game.cols, game.rows, Number(difficultyInput.input.value));
});

// buttons
class Button {
  constructor(btnId, action) {
    const btn = document.getElementById(btnId);
    btn.addEventListener("click", action);
  }
}

const toggleVisibility = (querySelector, state) => {
  const elmStyle = document.querySelector(querySelector).style;
  elmStyle.visibility =
    state || elmStyle.visibility === "visible" ? "hidden" : "visible";
};

new Button("btnSettings", () => {
  toggleVisibility(".how-to-play", "hidden");
  toggleVisibility(".puzzle_settings");
});

new Button("btnCloseSetting", () => {
  toggleVisibility(".puzzle_settings");
});

new Button("btnRestart", () => {
  game = new Game(game.cols, game.rows, game.blockSize, game.difficulty);
});

new Button("btnHowTo", () => {
  toggleVisibility(".puzzle_settings", "hidden");
  toggleVisibility(".how-to-play");
});

new Button("btnCloseHowTo", () => {
  toggleVisibility(".how-to-play");
});
