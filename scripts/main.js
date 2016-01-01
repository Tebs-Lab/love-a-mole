// Global game parameters

// The unit for these is "seconds"
var MOLE_UP_MIN = 0;
var MOLE_UP_MAX = 3;
var MOLE_ANIMATE_TIME = 1; // THERE IS A CORESPONDING CSS VARIABLE, SUCH IS THE PRICE OF RAW CSS ANIMATIONS!
var ROUND_COOLDOWN = 2;

// These are unit-less
var NUMBER_OF_ROUNDS = 10;
var MOLES_PER_ROUND = 3;

// Global references to DOM elements
// These will get initialized when window.onload is called
var scoreBoard;
var gameStartButton;
var gameCurrentlyActive;

//
// Main entry point:
// register the start button and scoreboard
//
window.onload = function(){
    scoreBoard = document.getElementById('score-board');
    gameStartButton = document.getElementById('game-starter');

    // Ready when they are!
    gameStartButton.addEventListener('click', startGame);
};

///
/// Game logic for rounds and restarting.
///

/**
 * Reset the score and start round 0
 */
function startGame() {
    // Can't start if a game is in progress
    if(gameCurrentlyActive){
        return;
    }

    // New game new score!
    scoreBoard.setAttribute('data-score', 0);
    scoreBoard.innerHTML = 0;

    // Once you start you can't stop... or start!
    gameStartButton.style.visibility = "hidden";
    initiateRound(0);
}
/**
* Use a closure and the event loop to act every ROUND_COOLDOWN seconds
*/
function initiateRound(roundNumber) {

    // Closing over roundNumber in this context is confusing - but important.

    // Without access to the environment variable roundNumber the rounds would not advance properly.
    // It's recursive, but also in an anonymous function, sent on "timeout", 
    // only to return after ROUND_COOLDOWN seconds. 

    // No matter, this (kind of horrifying to debug) technique works.
    var closureFunction = function() {

        if(roundNumber < NUMBER_OF_ROUNDS) {
            // Create the moles 
            for(var i = 0; i < MOLES_PER_ROUND; i++) new Mole().emerge();

            // Next round, using our precious closed-over parameter 
            initiateRound(roundNumber + 1);
        }
        else {
            endGame();
        }
    };

    // Set it and forget it.
    setTimeout(closureFunction, ROUND_COOLDOWN * 1000);
}

/**
 * When we're sure the last moles are done, let the user try again
 */
function endGame() {

    var maxTimeUp = MOLE_ANIMATE_TIME + MOLE_UP_MAX;
    setTimeout(function(){
        gameStartButton.style.visibility = "visible";
    }, maxTimeUp * 1000);
}

