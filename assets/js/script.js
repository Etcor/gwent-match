$(document).ready(initializeApp);

//given value by handleCardClick function
var firstCardClicked = null;
//given value by handleCardClick function
var secondCardClicked = null;
//increment after every successful match
var matches = null;
//increment after all cards have been matched
var gamesPlayed = 0;
//increment after an attempted match
var attempts = null;
//number of cards / 2
var maxMatches = 1;

function initializeApp(){
  //builds the cards dynamically
  buildCardGame();
  var cardContainer = $('#container');
  //click handler for cards in container element
  cardContainer.on('click', '.card', handleCardClick);
  //click handler for reset 'button'
  var resetGame = $('#resetStats');
  resetGame.on('click', resetStats);
}

//Updates Accuracy Percentage on Stats Div
function calculateAccuracy(){
  // WHEN RESETTING GAME 0/0 & null/null is NaN
  var accFraction = matches / attempts;
  //if NaN sets var to 0
  if(isNaN(accFraction)){
    accFraction = 0;
  }
  var accuracyPercentage = 0;
  //calculates accuracy of user
  if(accFraction !== 0){
    accuracyPercentage = Math.round(accFraction * 100);
  }
  return accuracyPercentage;
}
//Shows Modal that contains victory message and button to reset game
function handleModal() {
  var modalOnVictory = $('#modalResetStats');
  modalOnVictory.removeClass('hiddenModal');
}

//Used to update Stats Div
function displayStats(){
  var accuracy = calculateAccuracy();
  $('#gamesPlayedNumber').text(gamesPlayed);
  $('#attemptsNumber').text(attempts);
  $('#accuracyNumber').text(accuracy + '%');
}

//Resets game and updates games played
function resetStats(){
  //increments gamesPlayed when game is reset
  gamesPlayed++;
  matches = 0;
  attempts = 0;
  var cardContainer = $('#container');
  var modalElement = $('#modalResetStats');
  modalElement.addClass('hiddenModal');
  cardContainer.empty();
  //rebuilds game when reset is pressed
  buildCardGame();
  //updates Stats Div
  displayStats();
}

//Click handler for cards
function handleCardClick(event){
  //selects the card that is clicked
  var currentTarget = $(event.currentTarget);
  //hides the back of the card, revealing the face
  currentTarget.find('.back').addClass('hidden');
  //prevents user from continuously clicking on card
  if (currentTarget.hasClass('clicked')) {
    return;
  }
  //checks if any cards have been clicked
  if(firstCardClicked === null){
    firstCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  } else if(secondCardClicked === null){
    secondCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  }
   //conditional checking if both cards have been clicked
  if(firstCardClicked !== null && secondCardClicked !== null){
    attempts += 1;//on any match attempt, increments attemps var
    var firstCardImage = firstCardClicked.find('.front').css('background-image');//finds bg img for comp.
    var secondCardImage = secondCardClicked.find('.front').css('background-image');//finds bg img for comp.
    //checks if they are the same img
    if(firstCardImage !== secondCardImage){
      var cardContainer = $('#container');
      //stops click handler for cards on a mismatch until they are reset
      cardContainer.off('click', '.card', handleCardClick);
        //timer to reset css on card if img doesnt match
        setTimeout(function () {
          //unhides back of card and removes clicked class from cards that are mismatched
          firstCardClicked.find('.back').removeClass('hidden');
          secondCardClicked.find('.back').removeClass('hidden');
          firstCardClicked.removeClass('clicked');
          secondCardClicked.removeClass('clicked');
          //resets clickedCard vars
          firstCardClicked = null;
          secondCardClicked = null;
          //starts card click handler again
          cardContainer.on('click', '.card', handleCardClick);
          }, 1500);
      }else{ //resets clicked card variables on success or failure
        //resets clickedCard vars
        firstCardClicked = null;
        secondCardClicked = null;
        //on successful match, increments match var
        matches += 1;
        }
    //updates Stats Div
    displayStats();
    }
  //If you match everything on the game board, calls a modal element used to reset game
  if (matches === maxMatches) {
    setTimeout(function(){handleModal()}, 1000);
  }
}

//Uses DOM Creation to build cards that have randomized faces and locations
function buildCardGame(){
  //sets number of cards to make -- rows*cards
  var cardBoard = {rows: 3, cards: 6};
  var cardGame = $('#container');
  //holds randomized 'classes' array
  var randomClasses = randomizeCards();
  //builds and appends random card to container element
  for (var rows = 0; rows < cardBoard.rows; rows++) {
    var newCardRow = $('<div>').addClass('row');
    for (var cards = 0; cards < cardBoard.cards; cards++) {
      var newCardDiv = $('<div>').addClass('card');
      //on each loop, remove the last element from array
      var randomClassFront = randomClasses.pop();
      //sets the popped string as a class for a new card front
      var newCardFront = $('<div>').addClass('front').addClass(randomClassFront);
      var newCardBack = $('<div>').addClass('back')
      //appends card front and back to container element 'card'
      newCardDiv.append(newCardFront, newCardBack);
      //appends card element to row
      newCardRow.append(newCardDiv);
    }
    //appends row to container element
    cardGame.append(newCardRow);
  }
}

function randomizeCards(){
  //array holding classes for the cards
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
  //doubles the array so that matching cards is possible
  var classArrayDoubled = classArray.concat(classArray);
  return shuffle(classArrayDoubled);
}

//randomizes a passed in array
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    //grabs random number from range 0 - array.length
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    //assigns last item in array to a temp value
    temporaryValue = array[currentIndex];
    //assigns array item at 'randomIndex to array item at 'currentIndex'
    array[currentIndex] = array[randomIndex];
    //assigns the temp value to array at 'randomIndex'
    array[randomIndex] = temporaryValue;
  }
  return array;
}
