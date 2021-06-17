//Request 2 numbers from user
//Then request operation from user (+-*/)
//Check through if statement to see which operation is desired
//In each block, run desired operation
//Return the value and print it

const readline = require('readline-sync');

const MESSAGES = require('./calculator_messages.json');

function prompt(message) {
  console.log(`=> ${message}`);
}

prompt(MESSAGES['welcome']);

let keepGoing;

do {
  function invalidNumber(number) {
    return number.trimStart() === '' || Number.isNaN(Number(number));
  }
  
  prompt(MESSAGES['firstNum']);
  let number1 = readline.question();
  
  while (invalidNumber(number1)) {
    prompt(MESSAGES['invalNum']);
    number1 = readline.question();
  }
  
  prompt(MESSAGES['secNum']);
  let number2 = readline.question();
  
  while (invalidNumber(number2)) {
    prompt(MESSAGES['invalNum']);
    number2 = readline.question();
  }

  prompt(MESSAGES['operation']);
  let operation = readline.question();
  
  while (!['1', '2', '3', '4'].includes(operation)) {
    prompt(MESSAGES['invalOp']);
    operation = readline.question();
  }
  
  let output;
  switch (operation) {
    case '1':
      output = Number(number1) + Number(number2);
      break;
    case '2':
      output = Number(number1) - Number(number2);
      break;
    case '3':
      output = Number(number1) * Number(number2);
      break;
    case '4':
      output = Number(number1) / Number(number2);
      break;
  }
  
  prompt(`The result is: ${output}`);

  prompt(MESSAGES['cont']);
  keepGoing = readline.question();
  
  while (!['Yes', 'No'].includes(keepGoing)) {
    prompt(MESSAGES['invalCont']);
    keepGoing = readline.question();
  }

} while (keepGoing === 'Yes');

