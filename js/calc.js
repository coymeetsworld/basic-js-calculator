$(document).ready(() => {

  const MAX_NUMBER_SIZE = 8;
  const OP_MULTIPLY_SYMBOL = "*";
  const OP_ADD_SYMBOL = "+";
  const OP_MINUS_SYMBOL = "-";
  const OP_DIVIDE_SYMBOL = "/";

  $("#screen").append("<p id=\"screen-val\">0</p>");

  let operators = [OP_ADD_SYMBOL, OP_MINUS_SYMBOL, OP_MULTIPLY_SYMBOL, OP_DIVIDE_SYMBOL];
  let equationParts = [];

  let currVal = 0;
  let currOperator = null;

  const clearScreen = () => {
    $("#screen-val").html(0);
  }

  /* Updates the current value on the screen. If a operator key was pressed previous to this, that key and the value on the screen prior are stored in the array for future processing. */
  const processNumClick = (numID) => {

    if (currOperator) {
      equationParts.push(currVal);
      currVal = 0;
      equationParts.push(currOperator);
      currOperator = null;
    }

    if (currVal.toString().length === MAX_NUMBER_SIZE) {
      return;
    }
    
    let num;
    switch(numID) {
      case "key-1":
        num = 1;
        break;
      case "key-2":
        num = 2;
        break;
      case "key-3":
        num = 3;
        break;
      case "key-4":
        num = 4;
        break;
      case "key-5":
        num = 5;
        break;
      case "key-6":
        num = 6;
        break;
      case "key-7":
        num = 7;
        break;
      case "key-8":
        num = 8;
        break;
      case "key-9":
        num = 9;
        break;
      case "key-0":
        num = 0;
        break;
      case "key-decimal":
        num = ".";
        break;
      default:
        console.log("Error processing number press.");
    }

    if (currVal === 0) {
      currVal = num.toString();
    } else {
      currVal = currVal.toString().concat(num.toString());
    }

    $("#screen-val").html(currVal);
  }


  /* Determines which operation to put in the array given which operation key was pressed. */
  const processOperationClick = (op_id) => {

    let op;
    switch(op_id) {
      case "key-plus":
        op = OP_ADD_SYMBOL;
        break;
      case "key-minus":
        op = OP_MINUS_SYMBOL;
        break;
      case "key-times":
        op = OP_MULTIPLY_SYMBOL;
        break;
      case "key-divide":
        op = OP_DIVIDE_SYMBOL;
        break;
      case "key-percent":
        generatePercentValue();
        break;
      case "key-equals":
        calculateValue();
        break;
      default:
        console.log("Error processing operator press.");
    }

    currOperator = op;
  }


  /* Truncates the number to something printable up to 8 decimals. */
  const getPrintedValue = (value) => Number(Math.round(value*1000000)/1000000);

  /* Divides current value on screen by 100. */
  const generatePercentValue = () => {
    currVal /= 100;
    currVal = getPrintedValue(currVal);
    $("#screen-val").html(currVal);
  }

  /* Calculates the equation from beginning to when the equals key was pressed. */
  const calculateValue = () => {

    equationParts.push(currVal);
    currOperator = null; /* Marking it null for next equation. */

    let value;

    /* Perform order of operations. First handle multiply and divide from left to right*/
    for (let i = 0, items = equationParts.length; i < items; i++) {
      if (equationParts[i] === OP_MULTIPLY_SYMBOL) {
        value = (parseFloat(equationParts[i-1]) * parseFloat(equationParts[i+1]));
        equationParts.splice(i - 1, 3);
        equationParts.splice(i - 1, 0, value.toString());
        i--;
      }
      if (equationParts[i] === OP_DIVIDE_SYMBOL) {
        value = (parseFloat(equationParts[i-1]) / parseFloat(equationParts[i+1]));
        equationParts.splice(i - 1, 3);
        equationParts.splice(i - 1, 0, value.toString());
        i--;
      }
    }

    /* Now process addition/subtraction, from left to right. */
    for (let i = 0, items = equationParts.length; i < items; i++) {
      if (equationParts[i] === OP_ADD_SYMBOL) {
        value = (parseFloat(equationParts[i-1]) + parseFloat(equationParts[i+1]));
        equationParts.splice(i - 1, 3);
        equationParts.splice(i - 1, 0, value.toString());
        i--;
      }
      if (equationParts[i] === OP_MINUS_SYMBOL) {
        value = (parseFloat(equationParts[i-1]) - parseFloat(equationParts[i+1]));
        equationParts.splice(i - 1, 3);
        equationParts.splice(i - 1, 0, value.toString());
        i--;
      }
    }

    currVal = getPrintedValue(equationParts[0]);
    $("#screen-val").html(currVal);
    equationParts = [];
  };

  /* Handles clicking one of the number keys (0-9). */
  $(".num-key").click(function() {
    processNumClick(this.id);
  });

  /* Handles clicking an operation key (+,-,*,/,%) */
  $(".operator-key").click(function() {
    processOperationClick(this.id);
  });

  /* Handles clicking the CE button. Leaves memory in tact but clears out current value on the screen. */
  $("#key-ce").click(() => {
    currVal = 0;
    clearScreen();
  });

  /* Handles clicking the AC button. Clears out memory and the screen. */
  $("#key-ac").click(() => {
    currVal = 0;
    clearScreen();
    equationParts = [];
  });
});
