document.addEventListener('DOMContentLoaded', initGame, false);

let memoryMatch;

function initGame() {
  memoryMatch = new Memory_Match({
    contentContainer: document.getElementById('content-container'),
    cardAndStatsContainer: document.getElementById('card-and-stats-container'),
    gameContainer: document.getElementById('game-container'),
    startingModal: document.getElementById('starting-modal'),
    acceptQuest: document.getElementById('accept-quest'),
    resetStats: document.getElementById('reset-stats'),
    victoryMessage: document.getElementById('victory-message'),
    resetModal: document.getElementById('modal-reset-stats'),
    statsObj: {
      attempts: document.getElementById('attempts-number'),
      accuracy: document.getElementById('accuracy-number'),
      gamesPlayed: document.getElementById('games-played-number')
    }
  });
  memoryMatch.addEventHandlers();
}
