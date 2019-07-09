/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {

    let currentIndex = array.length;
    const deck = document.querySelector('.deck')
    const tempList = document.createDocumentFragment();

    while (currentIndex !== 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        tempList.appendChild(array[randomIndex])
    }

    deck.appendChild(tempList)

}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const cards = document.querySelectorAll('.card');
const movesSpan = document.querySelector('.moves');
const starsEl = document.querySelector('.stars');

shuffle(cards)

const decrementStarsLimit = FOUND = cards.length / 2
const BEST_MOVES = 8
const cardsToCompare = []
let score = 0
let moves = 0
let stars = starsEl.children.length
let slot = 0
let timeout;
let timer;
let seconds = 0;
let minutes = 0;

initialise ()

function cardClickEvent (e) {

  flipUp(e.target)

  runCheck(e.target)
}

function runCheck (selected) {

  if (cardsToCompare.includes(selected)) {
    return;
  }

  cardsToCompare.push(selected)
  slot++

  if (slot !== 2) {
    return;
  }

  if (compareCards()) {
    addSuccessAnimation();
    persistMatches();
    score ++;

    if (gameCompleted()) {
      document.querySelector('.overlay').style.display = 'flex';
      document.querySelector('.movesResult').innerText = moves;
      document.querySelector('.starsResult').innerText = stars;
      document.querySelector('.completed-time').innerText = `${minutes}:${seconds}`;

      getLatestScore()

      appendToLatestScore()

      clearTimeout(timeout);

      clearInterval(timer);
    }

    reset();
  }

  if ((moves % BEST_MOVES === 0) && stars > 1) {
    removeStar();
  }

  addErrorAnimation();

  timeout = setTimeout(() => {
    removeErrorAnimation();
    flipDown();
    reset();
  }, 200);

}

function initialise () {

  // Adding event lick to cards
  cards.forEach(card => {
    card.addEventListener('click', cardClickEvent);
  });

  movesSpan.innerText = moves;
  countdown();
}

function gameCompleted () {
  if (score === FOUND) {
    return true;
  }

  return false;
}

function persistMatches () {
  cardsToCompare.forEach((card) => {
    card.removeEventListener('click', cardClickEvent);
    card.classList.remove('open', 'show');
    card.classList.add('match');
  })
}

function flipUp (selected) {
  selected.classList.add('open', 'show');
}

function flipDown () {
  cardsToCompare.forEach((card) => {
    card.classList.remove('open', 'show');
  })
}

function compareCards () {
  moves++;
  movesSpan.innerText = moves;

  return cardsToCompare[0].firstElementChild.classList.toString() === cardsToCompare[cardsToCompare.length - 1].firstElementChild.classList.toString();
}

function removeStar () {
  starsEl.children[stars-1].firstElementChild.classList.add('fa-star-o');
  stars--;
}

function reset () {
  slot = 0;
  cardsToCompare.length = 0;
}

function restartGame () {
  window.location.reload();
}

function addErrorAnimation () {
  cardsToCompare.forEach((card) => {
    card.classList.add('animated', 'shake', 'fast', 'bg--danger');
  });
}

function removeErrorAnimation () {
  cardsToCompare.forEach((card) => {
    card.classList.remove('animated', 'shake', 'fast', 'bg--danger');
  });
}

function addSuccessAnimation () {
  cardsToCompare.forEach((card) => {
    card.classList.add('animated', 'rubberBand', 'fast');
  });
}

function removeSuccessAnimation () {
  cardsToCompare.forEach((card) => {
    card.classList.remove('animated', 'rubberBand', 'fast');
  })
}

// Timer can be found on: http://jsfiddle.net/fc37nckg/
function countdown () {
  let sec = 0;
  timer = setInterval( () => {
    seconds = pad(++sec % 60)
    minutes = pad(parseInt(sec / 60, 10))
    document.querySelector(".seconds").innerHTML = seconds;
    document.querySelector(".minutes").innerHTML = minutes;
  }, 1000);
}

function pad (val) {
  return val > 9 ? val : "0" + val;
}

// Getting the latest score from localStorage
function getLatestScore (argument) {
  const leaderboardBody = document.querySelector('.leaderboard__body');
  const tempEl = document.createDocumentFragment();

  Object.keys(localStorage).forEach(function(key) {
    const line = document.createElement('p')
    const item = JSON.parse(localStorage.getItem(key));
    line.innerHTML = `Start: ${item.stars} - Moves: ${item.moves} - Time: ${item.time}`;
    tempEl.appendChild(line)
  });

  leaderboardBody.appendChild(tempEl)
}

// adding the current score to localStorage
function appendToLatestScore (argument) {
  localStorage.setItem(Date.now(), JSON.stringify(
    {
      'moves': moves,
      'stars': stars,
      'time': `${minutes}:${seconds}`,
    }
  ));
}
