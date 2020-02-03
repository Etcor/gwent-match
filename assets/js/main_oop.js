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
    this.gamesPlayed = null;
    this.gameState = 0;
    this.matches = null;
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
    this.createGame = this.createGame.bind(this);
    this.resetStats = this.resetStats.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);

    this.createGame();
  }

  addEventHandlers() {
    this.elementConfig.acceptQuest.addEventListener('click', this.startGame);
    this.elementConfig.resetStats.addEventListener('click', this.resetStats);
  }

  startGame() {
    this.elementConfig.startingModal.classList.add('hide-modal');
    this.elementConfig.contentContainer.classList.remove('hide-modal');
  }

  createGame() {
    let $body_element = document.querySelector('body');
    $body_element.removeAttribute('class');
    $body_element.classList.add(this.backgroundClass[this.gameState].location);
    const gameSetup = {
      rows: 3,
      cards: 6
    };
    let randomClasses = this.randomizeCards();
    for (let rows = 0; rows < gameSetup.rows; rows++) {
      let $new_row = document.createElement('div');
      $new_row.classList.add('row');
      for (let cards = 0; cards < gameSetup.cards; cards++) {
        let randomCardImg = randomClasses.pop();
        let $card = document.createElement('div');
        let $new_card_front = document.createElement('div');
        let $new_card_back = document.createElement('div');

        $card.classList.add('card');
        $new_card_front.classList.add("front", `${randomCardImg}`);
        $new_card_back.classList.add("back", `${this.backgroundClass[this.gameState].cardBack}`);

        $card.appendChild($new_card_front);
        $card.appendChild($new_card_back);
        $new_row.appendChild($card);

        $card.addEventListener('click', this.handleCardClick);
      }
      this.elementConfig.gameContainer.appendChild($new_row);
    }
  }

  handleCardClick(event) {
    let currentTarget = event.currentTarget;
    if (currentTarget.classList.contains('clicked')) {
      return;
    }
    if (!this.firstCardClicked) {
      this.firstCardClicked = currentTarget;
      this.firstCardClicked.classList.add('clicked');
    } else if (!this.secondCardClicked) {
      this.secondCardClicked = currentTarget;
      currentTarget.classList.add('clicked');
    }
    if (this.firstCardClicked && this.secondCardClicked) {
      this.attempts++;
      let firstCardFront = this.firstCardClicked.querySelector('.front');
      let secondCardFront = this.secondCardClicked.querySelector('.front');
      let firstCardImage = getComputedStyle(firstCardFront).backgroundImage;
      let secondCardImage = getComputedStyle(secondCardFront).backgroundImage;
      if (firstCardImage !== secondCardImage) {
        let allCards = document.querySelectorAll('.card');
        for(let i = 0; i < allCards.length; i++){
          allCards[i].classList.add('loading');
        }
        setTimeout(() => {
          this.firstCardClicked.classList.remove('clicked');
          this.secondCardClicked.classList.remove('clicked');
          this.firstCardClicked = null;
          this.secondCardClicked = null;
          for (let i = 0; i < allCards.length; i++) {
            allCards[i].classList.remove('loading');
          }
        }, 1000);
      } else if (firstCardImage === secondCardImage){
        this.firstCardClicked = null;
        this.secondCardClicked = null;
        this.matches++;
      }
      this.displayStats();
    }
    if (this.matches === this.maxMatches) {
      setTimeout(() => {
        this.handleModal();
      }, 1000);
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
    this.elementConfig.statsObj.attempts.innerHTML = this.attempts;
    this.elementConfig.statsObj.accuracy.innerHTML = `${accuracy}%`;
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

    this.elementConfig.statsObj.gamesPlayed.innerHTML = this.gamesPlayed;
    this.elementConfig.resetModal.classList.add('hide-modal');
    this.elementConfig.statsObj.attempts.innerHTML = '0';
    while(this.elementConfig.gameContainer.lastChild){
      this.elementConfig.gameContainer.removeChild(this.elementConfig.gameContainer.lastChild);
    }

    this.createGame();
    this.displayStats();
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
