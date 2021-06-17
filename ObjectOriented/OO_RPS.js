/* eslint-disable max-len */
/*
The classical approach to planning an object-oriented application includes several steps:

1. Write a textual description of the problem or exercise.
2. Extract the significant nouns and verbs from the description.
3. Organize and associate the verbs with the nouns.
*/

/*
Step 1:
  RPS is a game where the 2 ppl (in this case, user and comp) choose an attack, either rock, ppr, scssrs and a winner is determined
  by comparing the choices.
  Rock > Scissors
  Scissors > Paper
  Paper > Rock

Step 2:
  Nouns:
    Player:
      User
      Computer
    Rule
    choices:
      rock, paper, scissors

  Verbs:
    choose
    compare

Step 3:
  Player:
    choose
  Rule:
    compare
  Choices
*/
let readline = require("readline-sync");

function createPlayer() {
  return {
    move: null,
    history: [],
    score: 0,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose(moveChangeVal) {
      if (moveChangeVal) {
        const choices = ['paper', 'scissors', 'lizard', 'spock'];
        let randomIndex = Math.floor(Math.random() * choices.length);
        this.move = choices[randomIndex];
      } else {
        const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        let randomIndex = Math.floor(Math.random() * choices.length);
        this.move = choices[randomIndex];
      }
    },
  };
  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let userChoice;
      while (true) {
        console.log(`Please enter your choice of Rock/Paper/Scissors/Lizard/Spock`);
        userChoice = readline.question().toLowerCase();
        if (['rock', 'paper', 'scissors', 'lizard', 'spock'].includes(userChoice)) break;
        console.log(`Invalid choice.`);
      }
      console.clear();
      this.move = userChoice;
    },
    humanRockRoundWinner: 0,
  };
  return Object.assign(playerObject, humanObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  winningScore: 5,
  winningHand: {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['spock', 'paper'],
    spock: ['rock', 'scissors']
  },
  winner: null,
  totalRoundCounter: 0,
  percentageChanger: 0.6,

  calculateMoveChange() {
    let length = this.human.history.length - 1;
    let checker = false;

    if (this.computer.history[length] === 'rock' &&
        this.winningHand[this.human.history[length]].includes(this.computer.history[length])) {
      this.human.humanRockRoundWinner++;
    }
    if (this.human.humanRockRoundWinner / this.totalRoundCounter >= this.percentageChanger) {
      checker = true;
    } else {
      checker = false;
    }
    return checker;
  },

  trackHistory() {
    this.human.history.push(this.human.move);
    this.computer.history.push(this.computer.move);
  },

  displayHistory() {
    let ans;
    while (true) {
      console.log(`Would you like to see the history of moves?`);
      ans = readline.question().toLowerCase();
      if (['yes', 'no'].includes(ans)) break;
      console.log(`Invalid response`);
    }
    if (ans === 'yes') {
      for (let i1 = 0; i1 < this.human.history.length; i1++) {
        console.log(`Human:    ${this.human.history[i1]}`);
        console.log(`Computer: ${this.computer.history[i1]}`);
        console.log(`---`);
      }
    }
  },

  displayWelcomeMessage() {
    console.log(`Welcome to Rock Paper Scissors Lizard Spock!`);
  },

  displayGoodbyeMessage() {
    console.log(`Thanks for playing Rock Paper Scissors Lizard Spock. Goodbye!`);
  },

  // eslint-disable-next-line max-lines-per-function
  displayRoundWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

    if (humanMove === computerMove) {
      console.log(`That round was a tie!`);
      this.winner = false;
    } else if (this.winningHand[humanMove].includes(computerMove)) {
      this.winner = 'Human';
      this.human.score++;
    } else {
      this.winner = 'Computer';
      this.computer.score++;
    }

    if (this.winner) {
      console.log(`${this.winner} wins that round!`);
    }
    console.log(`The current score is: Human:${this.human.score}, Computer:${this.computer.score}`);
    this.totalRoundCounter++;
  },

  playAgain() {
    let response;
    while (true) {
      console.log(`Would you like to play again? (yes/no)`);
      response = readline.question().toLowerCase();
      if (['yes', 'no'].includes(response)) {
        this.human.score = 0;
        this.computer.score = 0;
        break;
      }
      console.log(`Not a valid response.`);
    }
    console.clear();
    return response === 'yes';
  },

  displayFinalWinner() {
    let humanScore = this.human.score;
    let compScore = this.computer.score;
    if (humanScore === 5) {
      console.log(`Human wins the match!`);
    } else {
      console.log(`Computer wins the match!`);
    }
    console.log(`Final score was: Human:${humanScore}, Computer: ${compScore}.`);
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      while (this.human.score < this.winningScore && this.computer.score < this.winningScore) {
        this.human.choose();
        this.computer.choose(this.calculateMoveChange());
        this.displayRoundWinner();
        this.trackHistory();
      }
      console.clear();
      this.displayFinalWinner();
      this.displayHistory();
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();