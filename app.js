// input range
class RangeInput {
  constructor(inputSelector, outputSelector) {
    this.input = document.querySelector(inputSelector);
    this.output = document.querySelector(outputSelector);
    this.output.innerHTML = this.input.value;
    this.input.addEventListener("input", this.updateOutput.bind(this));
  }

  updateOutput() {
    this.output.innerHTML = this.input.value;
  }
}

const columnInput = new RangeInput("#columnInput", "#columnValue");
const rowInput = new RangeInput("#rowInput", "#rowValue");
