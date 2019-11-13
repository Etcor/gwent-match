$(document).ready(initializeApp);

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null; //increment after every successful match
var gamesPlayed = 0; //increment after all cards have been matched
var attempts = null;//increment after an attempted match


function initializeApp(){
  var cardElement = $('.card');
  cardElement.on('click', handleCardClick); //click handler for cards
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

function displayStats(){
  var accuracy = calculateAccuracy();
  $('#gamesPlayedNumber').text(gamesPlayed);
  $('#attemptsNumber').text(attempts);
  $('#accuracyNumber').text(accuracy + '%');
}
function resetStats(){
  debugger;
  gamesPlayed += 1;
  matches = 0;
  attempts = 0;
  var cardBack = $('.back');
  cardBack.removeClass('hidden');
  displayStats();
}

function handleCardClick(event){
  var currentTarget = $(event.currentTarget); //selects the card that is clicked
  currentTarget.find('.back').addClass('hidden'); //hides the back of the card, revealing the face

  if(firstCardClicked === null){ // uses previous selector to assign clicked card to variable
    firstCardClicked = currentTarget;
  }else{
    secondCardClicked = currentTarget;
  }
  // debugger;
  if(firstCardClicked !== null && secondCardClicked !== null){ //conditional checking if both cards have been clicked
    attempts += 1;//on any match attempt, increments attemps var
    var firstCardImage = firstCardClicked.find('.front').css('background-image');//finds bg img for comp.
    var secondCardImage = secondCardClicked.find('.front').css('background-image');//finds bg img for comp.
    if(firstCardImage !== secondCardImage){//checks if they are the same img
        setTimeout(function () {//timer to reset css on card if img doesnt match
          firstCardClicked.find('.back').removeClass('hidden');
          secondCardClicked.find('.back').removeClass('hidden');
          firstCardClicked = null;
          secondCardClicked = null;
          }, 1500);
      }else{ //resets clicked card variables on success or failure
        firstCardClicked = null;
        secondCardClicked = null;
        matches += 1; //on successful match, increments match var
    }
    displayStats();
  }
}
