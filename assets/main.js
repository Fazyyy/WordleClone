document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  getNewWord();

  //Variable Initialisations
  let guessedWords = [[]];
  let availableSpace = 1;
  let word;
  let guessedWordCount = 0;
  const keys = document.querySelectorAll(".k-row button");

  //Get new word from RapidAPI WordsAPI
  function getNewWord() {
    fetch(
      `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": "8b454598b7msh176f646ee17f72bp19edcfjsn719ea717876f",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        word = res.word;
        console.log(word);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Track current attempt
  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1]
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();
    if(currentWordArr && currentWordArr.length < 5){
      currentWordArr.push(letter)

      const availableSpaceEl = document.getElementById(String(availableSpace))
      
      availableSpace = availableSpace + 1;
      availableSpaceEl.textContent = letter;
    }
  }

  //Assign correct tile colour dependant on guess result
  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = (letter === letterInThatPosition);

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr()
    if (currentWordArr.length !== 5) {
      return window.alert("Word requires 5 letters!");
    }

    const currentWord = currentWordArr.join("");

    fetch(
      `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key":
          "8b454598b7msh176f646ee17f72bp19edcfjsn719ea717876f",
        },
      }
    ).then((res) => {
      if (!res.ok) {
        throw Error()
      }

      const firstLetterId = guessedWordCount * 5 + 1;
      const interval = 200;
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const tileColor = getTileColor(letter, index);
  
          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);
          letterEl.classList.add("flip-horizontal-bottom");
          letterEl.style = `background-color:${tileColor};border-color:${tileColor};`
  
        }, interval * index)
      });
  
      guessedWordCount += 1;
  
      if (currentWord === word) {
        window.alert("Congratulations! Refresh the page to try again.");
      }
      if (guessedWords.length === 6){
        window.alert(`Game Over, the word was ${word}.`)
      }
  
      guessedWords.push([])
    }).catch(() => {
      window.alert("Word is not a recognised word!");
    })
  }

  //Create the game board
  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr()
    const removedLetter = currentWordArr.pop()

    guessedWords[guessedWords.length - 1] = currentWordArr
    const lastLetterEl = document.getElementById(String(availableSpace - 1))

    lastLetterEl.textContent = ''
    availableSpace = availableSpace - 1 
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key")

      if (letter === 'enter') {
        handleSubmitWord()
        return;
      }

      if (letter === 'del') {
        handleDeleteLetter()
        return;
      }
      
      updateGuessedWords(letter);
    }
  }

});