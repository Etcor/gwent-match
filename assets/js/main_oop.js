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
    this.addEventHandlers();
    this.createGame();
  }

  addEventHandlers() {
    this.elementConfig.acceptQuest.on('click', this.startGame);
    this.elementConfig.cardAndStatsContainer.on('click' , '.card', this.handleCardClick);
    this.elementConfig.resetStats.on('click', this.resetStats);
  }

  startGame() {
    this.elementConfig.acceptQuest.addClass('hide-modal');
    this.elementConfig.contentContainer.removeClass('hide-modal');
  }

  createGame() {
    let $bodyElement = $('body');
    $bodyElement.removeClass();
    $bodyElement.addClass(this.backgroundClass[this.gameState].location);
    let cardBoard = {
      rows: 3,
      cards: 6
    };
    let randomClasses = this.randomizeCards();
    for (let rows = 0; rows < cardBoard.rows; rows++) {
      let $newRowOfCards = $('<div>').addClass('row');
      for (let cards = 0; cards < cardBoard.cards; cards++) {
        let randomCardImg = randomClasses.pop();
        let $card = $('<div>').addClass('card');
        let $newCardFront = $('<div>').addClass(`front ${randomCardImg}`);
        let $newCardBack = $('<div>').addClass(`back ${this.backgroundClass[this.gameState].cardBack}`);
        $card.append($newCardFront, $newCardBack);
        $newRowOfCards.append(card);
      }
      this.elementConfig.gameContainer.append($newRowOfCards);
    }
  }
}
