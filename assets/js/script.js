$(document).ready(initializeApp);

//given value by handleCardClick function
var firstCardClicked = null;
//given value by handleCardClick function
var secondCardClicked = null;
//increment after every successful match
var matches = null;
//increment after all cards have been matched
var gamesPlayed = null;
//Used to reset game when I run out of board styles :)
var gameState = 0;
//increment after an attempted match
var attempts = null;
//number of cards / 2
var maxMatches = 9;

//holds class names for styling
var backgroundClass = [
  {location:'inn', cardBack: 'startingBack'},
  {location:'northernKingdoms', cardBack: 'northernBack'},
  {location:'forest', cardBack: 'forestBack'},
  {location:'nilfgaard', cardBack: 'nilfgaardBack'},
  {location:'skellige', cardBack: 'skelligeBack'},
  {location:'monsters', cardBack: 'monstersBack'}
];

function initializeApp(){
  //hides card game at start until modal is clicked
  var elementContainer = $('#containerOfAllTheThings');
  elementContainer.toggle();
  //click handler to hide modal and show game
  var startingModal = $('#startingModal');
  var acceptQuest = $('#acceptQuest');
  acceptQuest.on('click', function(){
    startingModal.toggle();
    elementContainer.toggle();
  });
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
  var messageElement = $('#victoryMessage');
  var resetElement = $('#resetStats');
  modalOnVictory.removeClass('hiddenModal');
  //switch tracks gamestate var to change message on modal
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

//Used to update Stats Div
function displayStats(){
  var accuracy = calculateAccuracy();
  //PH for future use
  // $('#gamesPlayedNumber').text(gamesPlayed);
  // $('#attemptsNumber').text(attempts);
  $('#accuracyNumber').text(accuracy + '%');
}

//Resets game and updates games played
function resetStats(){
  var cardContainer = $('#container');
  var modalElement = $('#modalResetStats');
  var gamesPlayedNum = $('#gamesPlayedNumber');
  var attemptsNum = $('#attemptsNumber');
  //increments gamesPlayed when game is reset
  gamesPlayed++;
  //Using this to reset game when I run out of BG's and Cards
  if(gameState < 5){
    gameState++;
  }else{
    gameState = 0;
  }
  //Add tally mark to track games played
  gamesPlayedNum.append('<li></li>');
  //removes attempts tally when game is reset
  attemptsNum.empty();
  matches = 0;
  attempts = 0;
  modalElement.addClass('hiddenModal');
  cardContainer.empty();
  //rebuilds game when reset is pressed
  buildCardGame();
  //updates Stats Div
  displayStats();
}

function increaseTally() {
  $('#attemptsNumber').append('<li></li>');
}

//Click handler for cards
function handleCardClick(event){
  //selects the card that is clicked
  var currentTarget = $(event.currentTarget);
  //prevents user from continuously clicking on card
  if (currentTarget.hasClass('clicked')) {
    return;
  }
  //checks if any cards have been clicked
  if(!firstCardClicked){
    firstCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  } else if(!secondCardClicked){
    secondCardClicked = currentTarget;
    currentTarget.addClass('clicked');
  }
   //conditional checking if both cards have been clicked
  if(firstCardClicked && secondCardClicked){
    increaseTally();
    attempts++;//on any match attempt, increments attemps var
    var firstCardImage = firstCardClicked.find('.front').css('background-image');//finds bg img for comp.
    var secondCardImage = secondCardClicked.find('.front').css('background-image');//finds bg img for comp.
    //checks if they are the same img
    if(firstCardImage !== secondCardImage){
      var cardContainer = $('#container');
      //stops click handler for cards on a mismatch until they are reset
      cardContainer.off('click', '.card', handleCardClick);
        //timer to reset css on card if img doesnt match
        setTimeout(function () {
          //removes clicked class from cards that are mismatched
          firstCardClicked.removeClass('clicked');
          secondCardClicked.removeClass('clicked');
          //resets clickedCard vars
          firstCardClicked = null;
          secondCardClicked = null;
          //starts card click handler again
          cardContainer.on('click', '.card', handleCardClick);
          }, 1000);
      }else{ //resets clicked card variables on success or failure
        //resets clickedCard vars
        firstCardClicked = null;
        secondCardClicked = null;
        //on successful match, increments match var
        matches++;
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
  var bodyElement = $('body');
  bodyElement.removeClass();
  //Adds styling to BG based on variable incrementation
  bodyElement.addClass(backgroundClass[gameState].location);
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
      var newCardBack = $('<div>').addClass('back').addClass(backgroundClass[gameState].cardBack);
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
