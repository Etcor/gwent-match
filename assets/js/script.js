$(document).ready(initializeApp);

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var gamesPlayed = null;
var gameState = 0;
var attempts = null;
var maxMatches = 9;

var backgroundClass = [
  {location:'inn', cardBack: 'startingBack'},
  {location:'northernKingdoms', cardBack: 'northernBack'},
  {location:'forest', cardBack: 'forestBack'},
  {location:'nilfgaard', cardBack: 'nilfgaardBack'},
  {location:'skellige', cardBack: 'skelligeBack'},
  {location:'monsters', cardBack: 'monstersBack'}
];

function initializeApp(){
  var elementContainer = $('#containerOfAllTheThings');
  elementContainer.toggle();
  var startingModal = $('#startingModal');
  var acceptQuest = $('#acceptQuest');
  acceptQuest.on('click', function(){
    startingModal.toggle();
    elementContainer.toggle();
  });
  buildCardGame();
  var cardContainer = $('#container');
  cardContainer.on('click', '.card', handleCardClick);
  var resetGame = $('#resetStats');
  resetGame.on('click', resetStats);
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
  var modalOnVictory = $('#modalResetStats');
  var messageElement = $('#victoryMessage');
  var resetElement = $('#resetStats');
  modalOnVictory.removeClass('hiddenModal');
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
  $('#accuracyNumber').text(accuracy + '%');
}

function resetStats(){
  var cardContainer = $('#container');
  var modalElement = $('#modalResetStats');
  var gamesPlayedNum = $('#gamesPlayedNumber');
  var attemptsNum = $('#attemptsNumber');
  gamesPlayed++;
  if(gameState < 5){
    gameState++;
  }else{
    gameState = 0;
  }
  gamesPlayedNum.append('<li></li>');
  attemptsNum.empty();
  matches = 0;
  attempts = 0;
  modalElement.addClass('hiddenModal');
  cardContainer.empty();
  buildCardGame();
  displayStats();
}

function increaseTally() {
  $('#attemptsNumber').append('<li></li>');
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
    increaseTally();
    attempts++;
    var firstCardImage = firstCardClicked.find('.front').css('background-image');
    var secondCardImage = secondCardClicked.find('.front').css('background-image');
    if(firstCardImage !== secondCardImage){
      var cardContainer = $('#container');
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
  var cardGame = $('#container');
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
    cardGame.append(newCardRow);
  }
}

function randomizeCards(){
  var classArray = [
    'elemental',
    'geralt',
    'knightDragon',
    'troll',
    'gaunterODimm',
    'redanianKnight',
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
