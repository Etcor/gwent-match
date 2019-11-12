$(document).ready(initializeApp);

function initializeApp(){
  console.log('Loaded...');
  var cardElement = $('.card');
  cardElement.on('click', flipCard);
}

function flipCard(){
  $(this).find('.back').toggle();
}
