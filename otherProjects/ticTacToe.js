/* eslint-disable max-lines-per-function */
const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';
const GAMES_TO_WIN = 5;
const VALID_RESPONSES_TO_CONTINUE = ['yes', 'no', 'y', 'n'];
const VALID_RESPONSES_TO_CHOOSE_PLAYER = ['p', 'c'];
const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9],
  [1, 4, 7], [2, 5, 8], [3, 6, 9],
  [1, 5, 9], [3, 5, 7]
];

let readline = require("readline-sync");

function prompt(question) {
  console.log(`=> ${question}`);
}

function displayBoard(board) {
  console.clear();
  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}`);
  console.log('');
  console.log('     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}`);
  console.log('     |     |');
  console.log('');
}

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = INITIAL_MARKER;
  }

  return board;
}

function joinOr(emptySquares, delimiter = ', ', word = 'or') {
  if (emptySquares.length === 0) {
    return ('');
  } else if (emptySquares.length === 1) {
    return (`${emptySquares[0]}`);
  } else if (emptySquares.length === 2) {
    return (`${emptySquares[0]} ${word} ${emptySquares[1]}`);
  } else {
    let joinedWithDelim = [];
    for (let len = 0; len < emptySquares.length - 1; len++) {
      joinedWithDelim.push(emptySquares[len]);
    }
    return (`${joinedWithDelim.join(`${delimiter}`)}${delimiter}${word} ${emptySquares[emptySquares.length - 1]}`);
  }
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function playerChoosesSquare(board) {
  let square;

  while (true) {
    prompt(`Choose a square ${joinOr(emptySquares(board))}:`);
    square = readline.question().trim();
    if (emptySquares(board).includes(square)) break;
    prompt(`Sorry that's not a valid choice.`);

  }
  board[square] = 'X';
}

function computerChoosesSquare(board) {
  let checkForNextMove = true;

  if (checkForNextMove) {
    checkForNextMove = computerOffense(board);
  }

  if (checkForNextMove) {
    checkForNextMove = computerDefense(board);
  }

  if (checkForNextMove) {
    checkForNextMove = computerChoosesFive(board);
  }

  if (checkForNextMove) {
    computerChoosesRandom(board);
  }
}

function computerChoosesRandom(board) {
  let randomIndex = Math.floor(Math.random() * emptySquares(board).length);
  let square = emptySquares(board)[randomIndex];
  board[square] = COMPUTER_MARKER;
}

function computerChoosesFive(board) {
  if (board['5'] === INITIAL_MARKER) {
    board['5'] = COMPUTER_MARKER;
    return false;
  } else {
    return true;
  }
}

function computerDefense(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] ===  INITIAL_MARKER
    ) {
      board[sq3] = COMPUTER_MARKER;
      return false;
    } else if (
      board[sq3] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq1] ===  INITIAL_MARKER
    ) {
      board[sq1] = COMPUTER_MARKER;
      return false;
    } else if (
      board[sq1] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER &&
      board[sq2] ===  INITIAL_MARKER
    ) {
      board[sq2] = COMPUTER_MARKER;
      return false;
    }
  }
  return true;
}

function computerOffense(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] ===  INITIAL_MARKER
    ) {
      board[sq3] = COMPUTER_MARKER;
      return false;
    } else if (
      board[sq3] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq1] ===  INITIAL_MARKER
    ) {
      board[sq1] = COMPUTER_MARKER;
      return false;
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER &&
      board[sq2] ===  INITIAL_MARKER
    ) {
      board[sq2] = COMPUTER_MARKER;
      return false;
    }
  }
  return true;
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWon(board) {
  return !!detectRoundWinner(board);
}

function detectRoundWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return 'Player';
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return 'Computer';
    }
  }
  return null;
}

function checkForMatchWinner(playerScore, computerScore) {
  return playerScore === GAMES_TO_WIN || computerScore === GAMES_TO_WIN;
}

function selectWhoGoesFirst() {
  prompt(`Please select who you would like to go first this round Player (p) or Computer (c):`);
  let answer = readline.question().toLowerCase()[0];
  while (!VALID_RESPONSES_TO_CHOOSE_PLAYER.includes(answer)) {
    prompt(`Not a valid response, please enter p (Player) or c (Computer):`);
    answer = readline.question().toLowerCase()[0];
  }
  return answer;
}

function determineWhoGoesFirst(board, goesFirst) {
  chooseSquare(board, goesFirst);
  alternatePlayer(goesFirst);
  if (someoneWon(board) || boardFull(board)) return false;
  return true;
}

function chooseSquare(board, currentPlayer) {
  if (currentPlayer.toString() === 'p') {
    playerChoosesSquare(board);
  } else {
    computerChoosesSquare(board);
  }
}

function alternatePlayer(currentPlayer) {
  if (currentPlayer.toString() === 'p') {
    currentPlayer[0] = 'c';
    return currentPlayer;
  } else {
    currentPlayer[0] = 'p';
    return currentPlayer;
  }
}

while (true) {
  let playerScore = 0;
  let computerScore = 0;
  prompt(`Win ${GAMES_TO_WIN} rounds to win a match!`);

  while (true) {
    let board = initializeBoard();
    let goesFirst = [selectWhoGoesFirst()];
    let keepRoundGoing = true;

    while (keepRoundGoing) {
      displayBoard(board);
      keepRoundGoing = determineWhoGoesFirst(board, goesFirst);
    }

    displayBoard(board);

    if (someoneWon(board)) {
      prompt(`${detectRoundWinner(board)} won that round!`);
      if (detectRoundWinner(board) === 'Player') {
        playerScore++;
      } else {
        computerScore++;
      }
      if (checkForMatchWinner(playerScore, computerScore)) {
        prompt(`${detectRoundWinner(board)} wins the match!`);
        prompt(`The final score was player: ${playerScore}, computer: ${computerScore}`);
        break;
      } else {
        prompt(`The current score is player: ${playerScore}, computer: ${computerScore}`);
      }
    } else {
      prompt(`That round was a tie!`);
    }
    prompt(`Continue the match? (yes or no)`);
    let answer = readline.question().toLowerCase();
    while (!VALID_RESPONSES_TO_CONTINUE.includes(answer)) {
      prompt(`Not a valid response, please enter (yes or no / y or n)`);
      answer = readline.question().toLowerCase();
    }
    if (answer !== 'y' && answer !== 'yes') break;
  }
  prompt(`Would you like to play again? (yes or no)`);
  let answer = readline.question().toLowerCase();
  while (!VALID_RESPONSES_TO_CONTINUE.includes(answer)) {
    prompt(`Not a valid response, please enter (yes or no / y or n)`);
    answer = readline.question().toLowerCase();
  }
  if (answer !== 'y' && answer !== 'yes') {
    prompt(`Thanks for playing Tic Tac Toe!`);
    break;
  }
}