const readline = require('readline-sync');
const VALID_CHOICES = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
const SHORTHAND_CHOICES = ['r', 'p', 'sc', 'l', 'sp'];
const CONTINUE_CHOICES = ['y', 'n', 'yes', 'no'];
const WINNING_MOVES = {
  r: ['sc', 'l'],
  p: ['r', 'sp'],
  sc: ['p', 'l'],
  l: ['p', 'sp'],
  sp: ['r', 'sc'],
};

function prompt(message) {
  console.log(`=> ${message}`);
}

function choiceConverter(choice) {
  switch (choice) {
    case 'rock':
      choice = 'r';
      break;
    case 'paper':
      choice = 'p';
      break;
    case 'scissors':
      choice = 'sc';
      break;
    case 'lizard':
      choice = 'l';
      break;
    case 'spock':
      choice = 'sp';
      break;
  }
  return choice;
}

function displayChoice(choice, computerChoice) {
  let myChoice = SHORTHAND_CHOICES.indexOf(choice);
  let compChoice = SHORTHAND_CHOICES.indexOf(computerChoice);
  prompt(`You chose ${VALID_CHOICES[myChoice]}, computer chose ${VALID_CHOICES[compChoice]}.`);
}

function roundWon(choice, computerChoice) {
  if (whoWon(choice, computerChoice)) {
    prompt('You won that round.');
    return 'human';
  } else if (whoWon(computerChoice, choice)) {
    prompt('Computer won that round.');
    return 'bot';
  } else {
    prompt("That round was a tie! Score is unchanged.");
    return 'tie';
  }
}

let matchOngoing = true;
let humanScore = 0;
let botScore = 0;

function scoreKeeper(roundWinner) {
  if (roundWinner === 'human') {
    humanScore++;
  } else if (roundWinner === 'bot') {
    botScore++;
  }
}

function displayScore() {
  if (humanScore === 5) {
    prompt(`You win best of 5: Your score ${humanScore}, Computer score: ${botScore}.`);
  } else if (botScore === 5) {
    prompt(`You lose best of 5: Your score ${humanScore}, Computer score: ${botScore}.`);
  } else {
    prompt(`You got this! The current score is: you: ${humanScore} computer: ${botScore}.`);
  }
}

function updateScore() {
  if (humanScore === 5) {
    humanScore = 0;
    botScore = 0;
  } else if (botScore === 5) {
    humanScore = 0;
    botScore = 0;
  }
}

function isGameOver() {
  if (humanScore === 5) {
    matchOngoing = false;
  } else if (botScore === 5) {
    matchOngoing = false;
  }
}

function matchIsOngoing() {
  return matchOngoing;
}

function whoWon(choice, computerChoice) {
  return WINNING_MOVES[choice].includes(computerChoice);
}

function userChooses() {
  prompt(`Choose one: ${VALID_CHOICES.join(', ')}; key: r p sc sp l`);
  let userChoice = readline.question().toLowerCase();
  while (!SHORTHAND_CHOICES.includes(userChoice) &&
     !VALID_CHOICES.includes(userChoice)) {
    prompt("That's not a valid choice");
    userChoice = readline.question().toLowerCase();
  }
  return userChoice;
}

function computerChooses() {
  let randomIndex = Math.floor(Math.random() * VALID_CHOICES.length);
  let compChoice = SHORTHAND_CHOICES[randomIndex];
  return compChoice;
}

function playAgain() {
  prompt('Do you want to play again (y/n)?');
  let answers = readline.question().toLowerCase();
  while (!CONTINUE_CHOICES.includes(answers)) {
    prompt('Please enter "y" or "n".');
    answers = readline.question().toLowerCase();
  }
  return answers;
}

while (true) {
  while (matchIsOngoing()) {
    let choice = userChooses();
    choice = choiceConverter(choice);
    let computerChoice = computerChooses();
    displayChoice(choice, computerChoice);
    let pointTracker = roundWon(choice, computerChoice);
    scoreKeeper(pointTracker);
    displayScore();
    isGameOver();
    updateScore();
  }
  let answer = playAgain();

  if (answer === 'y' || answer === 'yes') {
    matchOngoing = true;
  } else {
    break;
  }
}