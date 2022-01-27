document.addEventListener("DOMContentLoaded", () => {

  createSquares();

  const guessedWords = [[]];
  const currentSpace = 1;

  let word;
  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".k-row button");

  function getNewWord() {
    fetch(
      `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": "<YOUR_KEY_GOES_HERE>",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        word = res.word;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");

      updateGuessedWords(letter);
    }
  }

  function getCurrWordArr() {
    const guessWordsNo = guessedWords.length;
    return guessedWords[guessWordsNo - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrWordArr()

    if(currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);
      const currentSpace = document.getElementById(String(1))
      currentSpace++;
    }
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div")
      square.classList.add("square")
      square.setAttribute("id", index + 1)
      gameBoard.appendChild(square);
    }
  }

})