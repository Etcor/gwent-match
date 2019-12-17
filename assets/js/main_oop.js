class Memory_Match {
  constructor(elementConfig) {
    this.elementConfig = {
      contentContainer: elementConfig.contentContainer,
      cardAndStatsContainer: elementConfig.cardAndStatsContainer,
      gameContainer: elementConfig.gameContainer,
      startingModal: elementConfig.startingModal,
      acceptQuest: elementConfig.acceptQuest,
      resetStats: elementConfig.resetStats,
      victoryMessage: elementConfig.victoryMessage,
      resetModal: elementConfig.resetModal,
      statsObj: {
        attempts: elementConfig.statsObj.attempts,
        accuracy: elementConfig.statsObj.accuracy,
        gamesPlayed: elementConfig.statsObj.gamesPlayed
      }
    };
    this.firstCardClicked = null;
    this.secondCardClicked = null;
    this.matches = null;
    this.gamesPlayed = null;
    this.gameState = 0;
    this.attempts = null;
    this.maxMatches = 9;
    this.backgroundClass = [
      { location: 'inn', cardBack: 'starting-back' },
      { location: 'northern-kingdoms', cardBack: 'northern-back' },
      { location: 'forest', cardBack: 'forest-back' },
      { location: 'nilfgaard', cardBack: 'nilfgaard-back' },
      { location: 'skellige', cardBack: 'skellige-back' },
      { location: 'monsters', cardBack: 'monsters-back' }
    ];
    this.startGame = this.startGame.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.createGame();
  }

  addEventHandlers() {
    this.elementConfig.acceptQuest.addEventListener('click', this.startGame);
    this.elementConfig.cardAndStatsContainer.addEventListener('click' , document.querySelector('.card'), this.handleCardClick);
    this.elementConfig.resetStats.addEventListener('click', this.resetStats);
  }

  startGame() {
    this.elementConfig.startingModal.classList.add('hide-modal');
    this.elementConfig.contentContainer.classList.remove('hide-modal');
  }

  createGame() {
    let $bodyElement = document.querySelector('body');
    $bodyElement.removeAttribute('class');
    $bodyElement.classList.add(this.backgroundClass[this.gameState].location);
    const cardBoard = {
      rows: 3,
      cards: 6
    };
    let randomClasses = this.randomizeCards();
    for (let rows = 0; rows < cardBoard.rows; rows++) {
      let $newRowOfCards = document.createElement('div');
      $newRowOfCards.classList.add('row');
      for (let cards = 0; cards < cardBoard.cards; cards++) {
        let randomCardImg = randomClasses.pop();
        let $card = document.createElement('div');
        $card.classList.add('card');
        let $newCardFront = document.createElement('div');
        $newCardFront.classList.add("front", `${randomCardImg}`);
        let $newCardBack = document.createElement('div');
        $newCardBack.classList.add("back", `${this.backgroundClass[this.gameState].cardBack}`);
        $card.appendChild($newCardFront);
        $card.appendChild($newCardBack);
        $newRowOfCards.appendChild($card);
      }
      this.elementConfig.gameContainer.appendChild($newRowOfCards);
    }
  }

  handleModal() {
    this.elementConfig.resetModal.classList.remove('hide-modal');

    switch (this.gameState) {
      case 0:
        this.elementConfig.victoryMessage.innerHTML = 'Greetings! I bring a message. Your prowess in this game of memory has procured an invitation from the Duchess of Toussaint herself!';
        this.elementConfig.resetStats.innerHTML = 'Begin Journey';
        break;
      case 1:
        this.elementConfig.victoryMessage.innerHTML = 'On your way home from Toussaint, you come across a traveler in the forest looking to play a game of memory.';
        this.elementConfig.resetStats.innerHTML = 'Continue Journey';
        break;
      case 2:
        this.elementConfig.victoryMessage.innerHTML = 'Good Sir! Good Sir! Emperor Emhyr requests your presence, he wishes to see you play firsthand!';
        break;
      case 3:
        this.elementConfig.victoryMessage.innerHTML = 'After entertaining the emperor, you sail home and somehow the game of memory finds you again aboard ship.';
        break;
      case 4:
        this.elementConfig.victoryMessage.innerHTML = 'The Chieftain of Skellige has given you a quest to find and defeat the monster of memory, if you succeed you will be rewarded!';
        break;
      case 5:
        this.elementConfig.victoryMessage.innerHTML = 'Congratulations! You have completed the game! You may continue to play however the story such as it is has already been told.';
        this.elementConfig.resetStats.innerHTML = 'Start Over';
        break;
      default:
        this.elementConfig.victoryMessage.innerHTML = 'Switch failed';
        break;
    }
  }

  calculateAccuracy() {
    let accuracy = this.matches / this.attempts;
    let accuracyPercentage = 0;

    if (isNaN(accuracy)) {
      accuracy = 0;
    }
    if (accuracy) {
      accuracyPercentage = Math.round(accuracy * 100);
    }

    return accuracyPercentage;
  }

  displayStats() {
    let accuracy = this.calculateAccuracy();
    this.elementConfig.attempts.innerHTML = this.attempts;
    this.elementConfig.accuracy.innerHTML = `${accuracy}%`;
  }

  resetStats() {
    this.gamesPlayed++;
    this.matches = 0;
    this.attempts = 0;

    if (this.gameState < 5) {
      this.gameState++;
    } else {
      this.gameState = 0;
    }

    this.elementConfig.gamesPlayed.innerHTML = this.gamesPlayed;
    this.elementConfig.resetModal.classList.add('hide-modal');
    this.elementConfig.attempts.innerHTML = '0';
    $('#game-container').empty();

    buildCardGame();
    displayStats();
  }

  randomizeCards() {
    const classArray = [
      'elemental',
      'geralt',
      'knight-dragon',
      'troll',
      'gaunter-o-dimm',
      'redanian-knight',
      'emhyr',
      'radovid',
      'golem'
    ];
    let classArrayDoubled = classArray.concat(classArray);
    return this.shuffle(classArrayDoubled);
  }

  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}
