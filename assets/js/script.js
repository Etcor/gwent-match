$(document).ready(initializeApp);

let memoryMatch;

function initGame() {
  memoryMatch = new Memory_Match({
    contentContainer: $('#content-container'),
    cardAndStatsContainer: $('#card-and-stats-container'),
    gameContainer: $('#game-container'),
    startingModal: $('#starting-modal'),
    acceptQuest: $('#accept-quest'),
    resetStats: $('#reset-stats'),
    victoryMessage: $('#victory-message'),
    resetModal: $('#modal-reset-stats'),
    statsObj: {
      attempts: $('#attempts-number'),
      accuracy: $('#accuracy-number'),
      gamesPlayed: $('#games-played-number')
    }
  });
}

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var gamesPlayed = null;
var gameState = 0;
var attempts = null;
var maxMatches = 1;

var backgroundClass = [
  {location:'inn', cardBack: 'starting-back'},
  {location:'northern-kingdoms', cardBack: 'northern-back'},
  {location:'forest', cardBack: 'forest-back'},
  {location:'nilfgaard', cardBack: 'nilfgaard-back'},
  {location:'skellige', cardBack: 'skellige-back'},
  {location:'monsters', cardBack: 'monsters-back'}
];

function initializeApp(){
  var elementContainer = $('#content-container');
  elementContainer.toggle();
  $('#accept-quest').on('click', function(){
    $('#starting-modal').addClass('hidden-modal');
    elementContainer.toggle();
  });
  buildCardGame();
  $('#card-and-stats-container').on('click', '.card', handleCardClick);
  $('#reset-stats').on('click', resetStats);
}

function calculateAccuracy(){
  var accFraction = matches / attempts;
  if(isNaN(accFraction)){
    accFraction = 0;
  }
  var accuracyPercentage = 0;
  if(accFraction !== 0){
    accuracyPercentage = Math.round(accFraction * 100);
  }
  return accuracyPercentage;
}

function handleModal() {
  var messageElement = $('#victory-message');
  var resetElement = $('#reset-stats');
  $('#modal-reset-stats').removeClass('hidden-modal');

  switch(gameState){
    case 0:
      messageElement.text('Greetings! I bring a message. Your prowess in this game of memory has procured an invitation from the Duchess of Toussaint herself!');
      resetElement.text('Begin Journey');
      break;
    case 1:
      messageElement.text('On your way home from Toussaint, you come across a traveler in the forest looking to play a game of memory.');
      resetElement.text('Continue Journey');
      break;
    case 2:
      messageElement.text('Good Sir! Good Sir! Emperor Emhyr requests your presence, he wishes to see you play firsthand!');
      break;
    case 3:
      messageElement.text('After entertaining the emperor, you sail home and somehow the game of memory finds you again aboard ship.');
      break;
    case 4:
      messageElement.text('The Chieftain of Skellige has given you a quest to find and defeat the monster of memory, if you succeed you will be rewarded!');
      break;
    case 5:
      messageElement.text('Congratulations! You have completed the game! You may continue to play however the story such as it is has already been told.');
      resetElement.text('Start Over');
      break;
    default:
      messageElement.text('Switch failed');
      break;
  }
}

function displayStats(){
  var accuracy = calculateAccuracy();
  $('#attempts-number').text(attempts);
  $('#accuracy-number').text(accuracy + '%');
}

function resetStats(){
  gamesPlayed++;
  matches = 0;
  attempts = 0;

  if(gameState < 5){
    gameState++;
  }else{
    gameState = 0;
  }

  $('#games-played-number').text(gamesPlayed);
  $('#modal-reset-stats').addClass('hidden-modal');
  $('#attempts-number').text('0');
  $('#game-container').empty();

  buildCardGame();
  displayStats();
}

function handleCardClick(event){
  var currentTarget = $(event.currentTarget);
  if (currentTarget.hasClass('clicked')) {
    return;
  }
  if(!firstCardClicked){
    firstCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  } else if(!secondCardClicked){
    secondCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  }
  if(firstCardClicked && secondCardClicked){
    attempts++;
    var firstCardImage = firstCardClicked.find('.front').css('background-image');
    var secondCardImage = secondCardClicked.find('.front').css('background-image');
    if(firstCardImage !== secondCardImage){
      var cardContainer = $('#card-and-stats-container');
      cardContainer.off('click', '.card', handleCardClick);
        setTimeout(function () {
          firstCardClicked.removeClass('clicked');
          secondCardClicked.removeClass('clicked');
          firstCardClicked = null;
          secondCardClicked = null;
          cardContainer.on('click', '.card', handleCardClick);
          }, 1000);
      }else{
        firstCardClicked = null;
        secondCardClicked = null;
        matches++;
        }
    displayStats();
    }
  if (matches === maxMatches) {
    setTimeout(function(){handleModal()}, 1000);
  }
}

function buildCardGame(){
  var bodyElement = $('body');
  bodyElement.removeClass();
  bodyElement.addClass(backgroundClass[gameState].location);
  var cardBoard = {rows: 3, cards: 6};
  var randomClasses = randomizeCards();
  for (var rows = 0; rows < cardBoard.rows; rows++) {
    var newCardRow = $('<div>').addClass('row');
    for (var cards = 0; cards < cardBoard.cards; cards++) {
      var newCardDiv = $('<div>').addClass('card');
      var randomClassFront = randomClasses.pop();
      var newCardFront = $('<div>').addClass('front').addClass(randomClassFront);
      var newCardBack = $('<div>').addClass('back').addClass(backgroundClass[gameState].cardBack);
      newCardDiv.append(newCardFront, newCardBack);
      newCardRow.append(newCardDiv);
    }
    $('#game-container').append(newCardRow);
  }
}

function randomizeCards(){
  var classArray = [
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
  var classArrayDoubled = classArray.concat(classArray);
  return shuffle(classArrayDoubled);
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
