$(document).ready(initializeApp);

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null; //increment after every successful match
var gamesPlayed = 0; //increment after all cards have been matched
var attempts = null;//increment after an attempted match
var maxMatches = 1;

function initializeApp(){
  buildCardGame();
  var cardContainer = $('#container');
  cardContainer.on('click', '.card', handleCardClick); //click handler for cards
  var resetGame = $('#resetStats');
  resetGame.on('click', resetStats);
}

function calculateAccuracy(){
  var accFraction = matches / attempts; // WHEN RESETTING GAME 0/0 & null/null is NaN
  if(isNaN(accFraction)){ //ASK FOR HELP ON THIS
    accFraction = 0;
  }
  var accuracyPercentage = 0;  //calculates accuracy of user
  if(accFraction !== 0){
    accuracyPercentage = Math.round(accFraction * 100);
  }
  return accuracyPercentage;
}

function handleModal() {
  var modalOnVictory = $('#modalResetStats');
  modalOnVictory.removeClass('hidden');
}

function displayStats(){
  var accuracy = calculateAccuracy();
  $('#gamesPlayedNumber').text(gamesPlayed);
  $('#attemptsNumber').text(attempts);
  $('#accuracyNumber').text(accuracy + '%');
}

function resetStats(){
  gamesPlayed++;
  matches = 0;
  attempts = 0;
  var cardContainer = $('#container');
  var modalElement = $('#modalResetStats');
  modalElement.addClass('hidden');
  cardContainer.empty();
  buildCardGame();
  displayStats();
}

function handleCardClick(event){
  var currentTarget = $(event.currentTarget); //selects the card that is clicked
  currentTarget.find('.back').addClass('hidden'); //hides the back of the card, revealing the face
  if (currentTarget.hasClass('clicked')) {
    return;
  }
  if(firstCardClicked === null){ // uses previous selector to assign clicked card to variable
    firstCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  } else if(secondCardClicked === null){
    secondCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  }
  if(firstCardClicked !== null && secondCardClicked !== null){ //conditional checking if both cards have been clicked
    attempts += 1;//on any match attempt, increments attemps var
    var firstCardImage = firstCardClicked.find('.front').css('background-image');//finds bg img for comp.
    var secondCardImage = secondCardClicked.find('.front').css('background-image');//finds bg img for comp.

    if(firstCardImage !== secondCardImage){//checks if they are the same img
      var cardContainer = $('#container');
      cardContainer.off('click', '.card', handleCardClick); //click handler for cards
        setTimeout(function () {//timer to reset css on card if img doesnt match
          firstCardClicked.find('.back').removeClass('hidden');
          secondCardClicked.find('.back').removeClass('hidden');
          firstCardClicked.removeClass('clicked');
          secondCardClicked.removeClass('clicked');
          firstCardClicked = null;
          secondCardClicked = null;
          cardContainer.on('click', '.card', handleCardClick);
          }, 1500);
      }else{ //resets clicked card variables on success or failure
        firstCardClicked = null;
        secondCardClicked = null;
        matches += 1; //on successful match, increments match var
        }
    displayStats();
    }
  if (matches === maxMatches) {
    setTimeout(function(){handleModal()}, 1000);
  }
}

function buildCardGame(){
  var cardBoard = {rows: 3, cards: 6};
  var cardGame = $('#container');
  var randomClasses = randomizeCards();

  for (var rows = 0; rows < cardBoard.rows; rows++) {
    var newCardRow = $('<div>').addClass('row');
    for (var cards = 0; cards < cardBoard.cards; cards++) {
      var newCardDiv = $('<div>').addClass('card');
      var randomClassFront = randomClasses.pop();
      var newCardFront = $('<div>').addClass('front').addClass(randomClassFront);
      var newCardBack = $('<div>').addClass('back')
      newCardDiv.append(newCardFront, newCardBack);
      newCardRow.append(newCardDiv);
    }
    cardGame.append(newCardRow);
  }
}

function randomizeCards(){
  var classArray = [
    'cssLogo',
    'dockerLogo',
    'jsLogo',
    'nodeLogo',
    'reactLogo',
    'gitHubLogo',
    'htmlLogo',
    'phpLogo',
    'mySqlLogo',
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
