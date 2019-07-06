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

let cards = document.querySelectorAll('.card');
let movesSpan = document.querySelector('.moves');
let starsEl = document.querySelector('.stars');

// shuffle(cards)

const decrementStarsLimit = FOUND = cards.length / 2
const BEST_MOVES = 8
const cardsToCompare = []
let score = 0
let moves = 0
let stars = starsEl.children.length
let slot = 0

console.log(stars)

initialise ()

cards.forEach(card => {

  card.addEventListener('click', cardClickEvent);

});


function cardClickEvent (e) {

  let selected = e.target

  flipUp(selected)

  runCheck(selected)
}

function runCheck (selected) {

  cardsToCompare.push(selected)
  slot++

  if (slot !== 2) {
    return;
  }

  if (compareCards()) {
    persistMatches()
    score ++

    if (gameCompleted()) {
      document.querySelector('.overlay').style.display = 'flex'
      document.querySelector('.movesResult').innerText = moves
      document.querySelector('.starsResult').innerText = stars
    }

    reset()
  }

  if ((moves % BEST_MOVES === 0) && stars > 1) {
    removeStar()
  }

  let timeout = setTimeout(() => {
    flipDown()
    reset()
  }, 500);

}

function initialise () {
  movesSpan.innerText = moves
}

function gameCompleted () {
  if (score === FOUND) {
    return true
  }

  return false
}

function persistMatches () {
  cardsToCompare.forEach((card) => {
    card.removeEventListener('click', cardClickEvent)
    card.classList.remove('open', 'show')
    card.classList.add('match')
  })
}

function flipUp (selected) {
  selected.classList.add('open', 'show')
}

function flipDown () {
  cardsToCompare.forEach((card) => {
    card.classList.remove('open', 'show')
  })
}

function compareCards () {
  moves++;
  movesSpan.innerText = moves

  return cardsToCompare[0].firstElementChild.classList.toString() === cardsToCompare[cardsToCompare.length - 1].firstElementChild.classList.toString()
}

function removeStar () {
  starsEl.children[stars-1].firstElementChild.classList.add('fa-star-o')
  stars--
}

function reset () {
  slot = 0;
  cardsToCompare.length = 0
}

function restartGame () {
  window.location.reload()
}
