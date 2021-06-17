
let readline = require('readline-sync');

class Card {
  constructor() {
    this.deck = [];
  }

  createDeck() {
    this.deck = [];
    for (let suit = 1; suit <= 4; suit++) {
      for (let value = 1; value <= 13; value++) {
        let faceVal = this.getFaceValue(value);
        let suitVal = this.getSuitValue(suit);
        this.deck.push([suitVal, faceVal]);
      }
    }
  }

  getFaceValue(val) {
    switch (val) {
      case 1:
        return 'Ace';
      case 11:
        return 'Jack';
      case 12:
        return 'Queen';
      case 13:
        return 'King';
      default:
        return String(val);
    }
  }

  getSuitValue(suit) {
    switch (suit) {
      case 1:
        return 'Hearts';
      case 2:
        return 'Diamonds';
      case 3:
        return 'Clubs';
      default:
        return 'Spades';
    }
  }
}

class Participant {
  constructor() {
    this.currentHand = [];
  }

  emptyHand() {
    this.currentHand = [];
  }
}

class Player extends Participant {
  constructor() {
    super();
    this.dollars = 5;
  }
}

class Dealer extends Participant {
  constructor() {
    super();
  }
}

class TwentyOneGame {
  static START_DOLLAR_AMOUNT = 5;
  static LOSE_DOLLAR_AMOUNT = 0;
  static WIN_DOLLAR_AMOUNT = 10;
  static DEALER_MAX_VAL = 17;
  static OBJECTIVE_POINT_VAL = 21;

  constructor() {
    this.card = new Card();
    this.player = new Player();
    this.dealer = new Dealer();
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    while (this.player.dollars > TwentyOneGame.LOSE_DOLLAR_AMOUNT
      && this.player.dollars < TwentyOneGame.WIN_DOLLAR_AMOUNT) {
      this.mainGameLoop();
      if (!this.checkDollars()) break;
      console.clear();
    }
    this.displayGoodbyeMessage();
  }

  mainGameLoop() {
    this.initializeGame();
    this.showOneDealerCard();
    this.showingCards(this.player);
    this.hitOrStay();
    this.displayBust(this.player);
    if (!this.checkIfBusted(this.player)) {
      this.showingCards(this.dealer);
      this.dealerPlays();
      this.displayBust(this.dealer);
    }
    if (!this.checkIfBusted(this.dealer) &&
      !this.checkIfBusted(this.player)) {
      this.checkWinner();
    }
    this.displayRoundScore();
    this.displayDollarVal();
  }

  initializeGame() {
    this.player.emptyHand();
    this.dealer.emptyHand();
    this.card.createDeck();
    this.dealFirstTwoCards(this.player);
    this.dealFirstTwoCards(this.dealer);
  }

  showingCards(user) {
    this.showCards(user);
    this.displayCurrentHandScore(user);
  }

  displayWelcomeMessage() {
    console.log(`Welcome to the game of 21! Score as close to 21 as possible to win, Good Luck!`);
    console.log('You are starting with $5.00.');
    console.log('For each round you win, you will gain $1.00; each round lost will be a deduction of $1.00.');
    console.log('If you reach $0.00 or $10.00 you will lose/win and the game will then quit. Good Luck!');
    console.log('');
  }

  displayGoodbyeMessage() {
    console.log(`Thank you for playing. Have a good day!`);
  }

  displayDollarVal() {
    console.log(`You now have $${this.player.dollars}.`);
    console.log(`-----`);
  }

  resetDollars() {
    this.player.dollars = 5;
  }

  checkWinner() {
    if (this.calculateHand(this.player) > this.calculateHand(this.dealer)) {
      console.log(`You won!`);
      this.player.dollars += 1;
    } else if (this.calculateHand(this.player) <
      this.calculateHand(this.dealer)) {
      console.log(`Dealer won!`);
      this.player.dollars -= 1;
    } else {
      console.log(`It was a tie!`);
    }
  }

  checkDollars() {
    if (this.player.dollars === TwentyOneGame.LOSE_DOLLAR_AMOUNT) {
      console.log(`Tough luck, you ran out of money!`);
      this.resetDollars();
      return this.askNewGame();
    } else if (this.player.dollars === TwentyOneGame.WIN_DOLLAR_AMOUNT) {
      console.log(`Nice job, you maxed out on winnings!`);
      this.resetDollars();
      return this.askNewGame();
    }
    return this.askToContinue();
  }

  displayRoundScore() {
    console.log(`The final score was: Player - ${this.calculateHand(this.player)}. Dealer - ${this.calculateHand(this.dealer)}`);
    console.log(`-----`);
  }

  dealFirstTwoCards(user) {
    let rndmNum = this.getRandomNum();
    user.currentHand.push(this.card.deck[rndmNum]);
    this.card.deck.splice([rndmNum], 1);
    rndmNum = this.getRandomNum();
    user.currentHand.push(this.card.deck[rndmNum]);
    this.card.deck.splice([rndmNum], 1);
  }

  getRandomNum() {
    return Math.floor(Math.random() * this.card.deck.length);
  }

  showCards(user) {
    if (user === this.player) {
      console.log(`Your current hand is:`);
    } else {
      console.log(`Dealers' current hand is:`);
    }

    for (let idx = 0; idx < user.currentHand.length; idx++) {
      console.log(`- ${user.currentHand[idx][1]} of ${user.currentHand[idx][0]}`);
    }
    console.log('');
  }

  showOneDealerCard() {
    console.log(`Dealers' current hand is:`);
    console.log(`- ${this.dealer.currentHand[0][1]} of ${this.dealer.currentHand[0][0]}`);
    console.log(`- **HIDDEN**`);
    console.log('');
  }

  displayCurrentHandScore(user) {
    if (user === this.player) {
      console.log(`Your current score is: ${this.calculateHand(this.player)}`);
      console.log('');
    } else {
      console.log(`Dealers' current score is: ${this.calculateHand(this.dealer)}`);
      console.log('');
    }
  }

  calculateHand(user) {
    let values = user.currentHand.map(card => card[1]);

    let sum = 0;
    values.forEach(value => {
      if (value === "Ace") {
        sum += 11;
      } else if (['Jack', 'Queen', 'King'].includes(value)) {
        sum += 10;
      } else {
        sum += Number(value);
      }
    });

    values.filter(value => value === "Ace").forEach(_ => {
      if (sum > TwentyOneGame.OBJECTIVE_POINT_VAL) sum -= 10;
    });

    return sum;
  }

  hitOrStay() {
    let ans;
    while (true) {
      while (true) {
        console.log(`Would you like to hit or stay? (h or s)`);
        ans = readline.question().toLowerCase();
        if (['h', 's'].includes(ans)) break;
        console.log(`Please enter a valid response`);
      }
      if (!this.playersMove(ans)) break;
    }
  }

  playersMove(ans) {
    if (ans === 's') {
      console.log(`You chose to stay!`);
      console.log(``);
      return false;
    }
    console.clear();
    console.log(`You chose to hit!`);
    console.log(``);
    this.showOneDealerCard();
    this.dealACard(this.player);
    if (this.checkIfBusted(this.player)) return false;
    return true;
  }

  dealACard(user) {
    let rndmNum = this.getRandomNum();
    user.currentHand.push(this.card.deck[rndmNum]);
    this.card.deck.splice([rndmNum], 1);
    this.showCards(user);
    this.displayCurrentHandScore(user);
  }

  checkIfBusted(user) {
    return this.calculateHand(user) > TwentyOneGame.OBJECTIVE_POINT_VAL;
  }

  displayBust(user) {
    if (this.calculateHand(user) > TwentyOneGame.OBJECTIVE_POINT_VAL) {
      if (user === this.player) {
        console.log(`You busted with a score of ${this.calculateHand(user)}!`);
        console.log(`-----`);
        this.player.dollars -= 1;
      } else {
        console.log(`Dealer busted with a score of ${this.calculateHand(user)}!`);
        console.log(`-----`);
        this.player.dollars += 1;
      }
    }
  }

  dealerPlays() {
    while (this.calculateHand(this.dealer) < TwentyOneGame.DEALER_MAX_VAL) {
      console.log(`Dealer chose to hit!`);
      console.log('');
      this.dealACard(this.dealer);
    }
    if (!this.checkIfBusted(this.dealer)) {
      console.log(`Dealer chose to stay with a score of ${this.calculateHand(this.dealer)}!`);
      console.log('');
    }
  }

  askToContinue() {
    let ans;
    while (true) {
      console.log(`Would you like to continue? (y or n)`);
      ans = readline.question().toLowerCase();
      if (['y', 'n'].includes(ans)) break;
      console.log(`Please enter a valid response`);
    }
    return ans === 'y';
  }

  askNewGame() {
    let ans;
    while (true) {
      console.log(`Would you like to start a new game? (y or n)`);
      ans = readline.question().toLowerCase();
      if (['y', 'n'].includes(ans)) break;
      console.log(`Please enter a valid response`);
    }
    return ans === 'y';
  }
}

let game = new TwentyOneGame();
game.start();
