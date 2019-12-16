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
    let cardBoard = {
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
