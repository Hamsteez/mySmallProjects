let readline = require('readline-sync');

console.log('Welcome to the monthly mortgage payment calculator!');

function numTestLoanApr(num) {
  return num.toString().trim() === '' ||
         num <= 0   ||
         Number.isNaN(Number(num));
}

function numTestDur(num) {
  return num.toString().trim() === '' ||
         num < 0   ||
         Number.isNaN(Number(num));
}

function numTestIntDur(num) {
  return ((num % 1) !== 0);
}

let keepGoing = true;

while (keepGoing) {
  let loanAmount = (readline.question('What is the total loan amount (i.e 5000 is $5000)? -->'));
  while (numTestLoanApr(loanAmount)) {
    console.log('Please enter an appropriate value -->');
    loanAmount = Number(readline.question());
  }

  let apr = Number(readline.question('What is the Annual Percentage Rate (i.e 5 is 5%)? -->'));
  while (numTestLoanApr(apr)) {
    console.log('Please enter an appropriate value -->');
    apr = Number(readline.question());
  }

  let loanDurYears = Number(readline.question('What is total number of years the loan will be (i.e 5 is 5 years) -->?'));
  while (numTestDur(loanDurYears) || numTestIntDur(loanDurYears)) {
    console.log('Please enter an appropriate value -->');
    loanDurYears = Number(readline.question());
  }

  let loanDurMonths = Number(readline.question('Any extra months in addition to the number of years? (i.e 5 is 5 months)? -->'));
  if (numTestIntDur(loanDurMonths)) {
    console.log('ok');
  }
  while (numTestDur(loanDurMonths) || numTestIntDur(loanDurMonths)) {
    console.log('Please enter an appropriate value -->');
    loanDurMonths = Number(readline.question());
  }

  while (loanDurYears === 0 && loanDurMonths === 0) {
    console.log('You entered a value of 0 for both years and months, please enter a value for either years or months, Thank you -->');
    console.log('Please enter a positive value for years -->');
    loanDurYears = Number(readline.question());
    console.log('Please enter a positive value for months -->');
    loanDurMonths = Number(readline.question());
  }

  let monthlyIntRate = (apr / 100) / 12;
  let totLoanMonths = (loanDurYears * 12) + loanDurMonths;

  let monthlyPayment = loanAmount *
    (monthlyIntRate / (1 - Math.pow((1 + monthlyIntRate), (-totLoanMonths))));

  console.log(`Your monthly payment is: $${monthlyPayment.toFixed(2)}`);

  let go = readline.question('Would you like another calculation? (Enter yes/no) -->').toLowerCase();
  const VALID_CHOICES = ['yes', 'no', 'y', 'n'];
  while (!VALID_CHOICES.includes(go)) {
    go = readline.question('Please enter yes/no -->').toLowerCase();
  }

  if (go === 'no' || go === 'n') {
    keepGoing = false;
    console.log('Have a good day!');
  }
}
