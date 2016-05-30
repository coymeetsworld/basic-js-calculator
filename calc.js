$(document).ready(function() {


  $("#screen").append("<p id=\"screen_val\">0</p>");

  var operators = ["+", "-", "*", "/"];
  var equation_parts = [];

  var current_val = "0";
  var current_operator = null;

  function clearScreen() {
    $("#screen_val").html(0);
  }

  /* Updates the current value on the screen. If a operator key was pressed previous to this, that key and the value on the screen prior are stored in the array for future processing. */
  function processNumClick(num_id) {

    if (current_operator) {
      console.log("Pushing " + current_val + " to the queue");
      equation_parts.push(current_val);
      current_val = "0";
      console.log("Pushing " + current_operator + " to the queue");
      equation_parts.push(current_operator);
      current_operator = null;
    }

    /* Screen only takes up to 8-digit numbers */
    if (current_val.toString().length == 8) {
      return;
    }

    var num;
    switch(num_id) {
      case "key_1":
         num = 1;
         break;
      case "key_2":
         num = 2;
         break;
      case "key_3":
         num = 3;
         break;
      case "key_4":
         num = 4;
         break;
      case "key_5":
         num = 5;
         break;
      case "key_6":
         num = 6;
         break;
      case "key_7":
         num = 7;
         break;
      case "key_8":
         num = 8;
         break;
      case "key_9":
         num = 9;
         break;
      case "key_0":
         num = 0;
         break;
      case "key_decimal":
         num = ".";
         break;
      default:
         console.log("Error processing number press.");
    } /* End of switch statement */

    if (current_val == "0") {
      current_val = num.toString();
    } else {
      current_val = current_val.concat(num.toString());
    }

    console.log("current_val: " + current_val);
    $("#screen_val").html(current_val);
  }


  /* Determines which operation to put in the array given which operation key was pressed. */
  function processOperationClick(op_id) {

    console.log("op_id: " + op_id);
    var op;
    switch(op_id) {
      case "key_plus":
         op = "+";
         break;
      case "key_minus":
         op = "-";
         break;
      case "key_times":
         op = "*";
         break;
      case "key_divide":
         op = "/";
         break;
      case "key_percent":
         generatePercentValue();
         break;
      case "key_equals":
         calculateValue();
         break;
      default:
        console.log("Error processing operator press.");
    }

    current_operator = op;
  }


  /* Truncates the number to something printable up to 8 decimals. */
  function getPrintedValue(value) {
    console.log("Calling getPrintedValue(" + value + ")");
    return Number(Math.round(value*1000000)/1000000);
  }


  /* Divides current value on screen by 100. */
  function generatePercentValue() {
    console.log("Generate percent value: " );
    current_val /= 100;
    current_val = getPrintedValue(current_val);
    $("#screen_val").html(current_val);
  }

  /*
    Helper function, just used for troubleshooting.
  */
  function printArray(arr) {
    console.log("Array start: " );
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i]);
    }
    console.log("Array end.");
  }


  /* Calculates the equation from beginning to when the equals key was pressed. */
  function calculateValue() {

    equation_parts.push(current_val);
    current_operator = null; /* Marking it null for next equation. */

    var value;

    /* Perform order of operations. First handle multiply and divide from left to right*/
    for (var i = 0, items = equation_parts.length; i < items; i++) {
        printArray(equation_parts);
        if (equation_parts[i] == "*") {
          value = (parseFloat(equation_parts[i-1]) * parseFloat(equation_parts[i+1]));
          equation_parts.splice(i - 1, 3);
          equation_parts.splice(i - 1, 0, value.toString());
          i--;
        }
        if (equation_parts[i] == "/") {
          value = (parseFloat(equation_parts[i-1]) / parseFloat(equation_parts[i+1]));
          equation_parts.splice(i - 1, 3);
          equation_parts.splice(i - 1, 0, value.toString());
          i--;
        }
    }

    /* Now process addition/subtraction, from left to right. */
    for (var i = 0, items = equation_parts.length; i < items; i++) {
        printArray(equation_parts);
        if (equation_parts[i] == "+") {
          value = (parseFloat(equation_parts[i-1]) + parseFloat(equation_parts[i+1]));
          equation_parts.splice(i - 1, 3);
          equation_parts.splice(i - 1, 0, value.toString());
          i--;
        }
        if (equation_parts[i] == "-") {
          value = (parseFloat(equation_parts[i-1]) - parseFloat(equation_parts[i+1]));
          equation_parts.splice(i - 1, 3);
          equation_parts.splice(i - 1, 0, value.toString());
          i--;
        }
    }

    current_val = equation_parts[0];
    console.log("value (not printed): " + current_val);
    current_val = getPrintedValue(current_val);
    $("#screen_val").html(current_val);
    equation_parts = [];
  };


  /* Handles clicking one of the number keys (0-9). */
  $(".num_key").click(function() {
    console.log("Pressed a number key.");
    console.log("Pressed button " + this.id);
    processNumClick(this.id);
  });


  /* Handles clicking an operation key (+,-,*,/,%) */
  $(".operator_key").click(function() {
    console.log("Pressed an operator key.");
    console.log("Pressed button " + this.id);
    processOperationClick(this.id);
  });


  /* Handles clicking the CE button. Leaves memory in tact but clears out current value on the screen. */
  $("#key_ce").click(function() {
    current_val = 0;
    clearScreen();
  });


  /* Handles clicking the AC button. Clears out memory and the screen. */
  $("#key_ac").click(function() {
    current_val = 0;
    clearScreen();
    equation_parts = [];
  });
});
