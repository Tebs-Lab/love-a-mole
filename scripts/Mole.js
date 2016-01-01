/**
 * @constructor
 * A mole object represents a mole in the game.
 *
 * timeSpentUp: controls the amount of time this mole spends above ground
 * occupiedHole: a DOM element representing this Mole's hole
 *
 *  Once a Mole Object is created, it travels through time and state-space through closures.
 */
function Mole(){

    // one second for the static css animation time, then 0-5 seconds after that.
    var timeSpentUp = (MOLE_ANIMATE_TIME + this.getRandomBetween(MOLE_UP_MIN, MOLE_UP_MAX)) * 1000;

    // These variables will be populated as a mole travels through closures and time.
    var occupiedHole;
    var moleElement;

    /**
     * @public
     * Moles are born in randomly selected holes.
     */
    this.emerge = function() {
        occupiedHole = this.selectHole();

        // If a hole wasn't available then this mole never gets a chance at love
        if(occupiedHole === undefined){
            return;
        }

        // claim the hole
        occupiedHole.setAttribute('data-hole-occupied', 'true');

        // A mole is born to pop-up
        moleElement = document.createElement('div');
        moleElement.className = 'mole popping-up';

        // It learns to love
        moleElement.addEventListener('click', receiveLove);

        // It travels up, and into the world
        occupiedHole.appendChild(moleElement);

        // But life is fleeting, and random.
        setTimeout(faceDeath, timeSpentUp);
    }

    /**
     * If a mole receives love before it leaves this world, the player scores.
     */
     var receiveLove = function() {

        // Love at last,
        moleElement.className += ' in-love';

        // and the player scored!
        // (scoreboard is a global reference to a dom element)
        var newScore = parseInt(scoreBoard.getAttribute('data-score')) + 1;
        scoreBoard.setAttribute('data-score', newScore);
        scoreBoard.innerHTML = newScore;

        // Having found love the mole is bold, confronting it's mortality now. 
        // Not beholden to it's predetermined approximate timing.
        faceDeath();
    }

    /**
     * Every mole ends it's life by facing death.
     * But a mole may face it's death early if it receives love.
     */
    var faceDeath = function() {

        // The joy of not-exactly-serial execution and finding love:
        // This mole found love, and so faced its death early.
        // In doing so, perhaps this mole enjoyed living in a free state.
        // Removed from the dom, but not destroyed until this return triggers.
        // As all references to mole are lost, it is finally forgotten.
        if(moleElement.classList.contains('popping-down')){
            return;
        }

        // If this mole is facing death for the first time at the cruel hand of the event loop
        // it goes underground to face it's maker.
        moleElement.className += ' popping-down';

        // If the mole faces death without the power of love
        // then in MOLE_ANIMATE_TIME seconds it will be free from references
        // and my modern browser will (probably) free it's former bits for use
        setTimeout(function(){
            occupiedHole.setAttribute('data-hole-occupied', 'false');
            occupiedHole.removeChild(moleElement);
        }, 
        MOLE_ANIMATE_TIME * 1000);
    }
}

/**
 * A mole selects a hole randomly from the list of unoccupied holes.
 * The DOM contains 100% of the information about the state of the holes (html5, bang!)
 * 
 * returns the dom element representing the selected hole, undefined if all holes are occupied
 */
Mole.prototype.selectHole = function() {
    var moleHoles = document.querySelectorAll('[data-hole-occupied="false"]');
    return moleHoles[this.getRandomIntBetween(0, moleHoles.length)];
};

/**
 * Moles are good at picking random numbers because it makes their constructor read better,
 * as well as to keep off global scope.
 * 
 * As well as to illustrate another component of Object Oriented JavaScript
 */
Mole.prototype.getRandomBetween = function(min, max) {
    return Math.random() * (max - min) + min;
};

Mole.prototype.getRandomIntBetween = function(min, max) {
    return Math.floor(this.getRandomBetween(min, max));
};
