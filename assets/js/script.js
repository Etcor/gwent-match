$(document).ready(initializeApp);

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var gamesPlayed = null;
var attempts = null;

function initializeApp(){
  console.log('Loaded...');
  var cardElement = $('.card');
  cardElement.on('click', handleCardClick);
}

function resetStats(){
  gamesPlayed += 1;
  matches = null;
  attempts = null;
}

function handleCardClick(event){
  console.log(event);
  var currentTarget = $(event.currentTarget);
  currentTarget.find('.back').addClass('hidden');
  if(firstCardClicked === null){
    firstCardClicked = currentTarget;
  }else/* if(secondCardClicked === null)*/{
    secondCardClicked = currentTarget;
  }
  if(firstCardClicked !== null && secondCardClicked !== null){
    var firstCardImage = firstCardClicked.find('.front').css('background-image');
    var secondCardImage = secondCardClicked.find('.front').css('background-image');
    if(firstCardImage !== secondCardImage){
        console.log('No match');
        setTimeout(function () {
          firstCardClicked.find('.back').removeClass('hidden');
          secondCardClicked.find('.back').removeClass('hidden');
          firstCardClicked = null;
          secondCardClicked = null;
        }, 1500);
      }else{
      console.log('They match');
      firstCardClicked = null;
      secondCardClicked = null;
      matches += 1;
    }
    attempts += 1;
  }
}
