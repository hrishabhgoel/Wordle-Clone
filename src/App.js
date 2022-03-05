import React, { useState, useEffect } from 'react';
import './App.css';
import Keyboard from './keyboard/Keyboard';
import { words } from './data/Words';

const App = () => {
  const [boardData, setBoardData] = useState(
    JSON.parse(localStorage.getItem('board-data'))
  );
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [chArr, setChArr] = useState([]);

  // fetch data
  useEffect(() => {
    if (!boardData || !boardData.solution) {
      var alphaIndex = Math.floor(Math.random() * 26);
      var wordIndex = Math.floor(
        Math.random() * words[String.fromCharCode(97 + alphaIndex)].length
      );

      let newBoardData = {
        ...boardData,
        solution: words[String.fromCharCode(97 + alphaIndex)][wordIndex],
        rowIndex: 0,
        boardWords: [],
        boardRowStatus: [],
        presentCharArray: [],
        absentCharArray: [],
        correctCharArray: [],
        status: 'IN_PROGRESS',
      };

      setBoardData(newBoardData);
      localStorage.setItem('board-data', JSON.stringify(newBoardData));
    }
  }, []);

  // function to handle message above the wordle cube
  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  // function to handle error
  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 2000);
  };

  // helper function for
  const enterBoardWord = (word) => {
    let boardWords = boardData.boardWords;
    let boardRowStatus = boardData.boardRowStatus;
    let solution = boardData.solution;
    let presentCharArray = boardData.presentCharArray;
    let absentCharArray = boardData.absentCharArray;
    let correctCharArray = boardData.correctCharArray;
    let rowIndex = boardData.rowIndex;
    let rowStatus = [];
    let matchCount = 0;
    let status = boardData.status;

    for (var index = 0; index < word.length; index++) {
      if (solution.charAt(index) === word.charAt(index)) {
        matchCount++;
        rowStatus.push('correct');
        if (!correctCharArray.includes(word.charAt(index)))
          correctCharArray.push(word.charAt(index));
        if (presentCharArray.indexOf(word.charAt(index)) !== -1)
          presentCharArray.splice(
            presentCharArray.indexOf(word.charAt(index)),
            1
          );
      } else if (solution.includes(word.charAt(index))) {
        rowStatus.push('present');
        if (
          !correctCharArray.includes(word.charAt(index)) &&
          !presentCharArray.includes(word.charAt(index))
        )
          presentCharArray.push(word.charAt(index));
      } else {
        rowStatus.push('absent');
        if (!absentCharArray.includes(word.charAt(index)))
          absentCharArray.push(word.charAt(index));
      }
    }
    if (matchCount === 5) {
      status = 'WIN';
      handleMessage('YOU WON');
    } else if (rowIndex + 1 === 6) {
      status = 'LOST';
      handleMessage(boardData.solution);
    }
    boardRowStatus.push(rowStatus);
    boardWords[rowIndex] = word;
    let newBoardData = {
      ...boardData,
      boardWords: boardWords,
      boardRowStatus: boardRowStatus,
      rowIndex: rowIndex + 1,
      status: status,
      presentCharArray: presentCharArray,
      absentCharArray: absentCharArray,
      correctCharArray: correctCharArray,
    };
    setBoardData(newBoardData);
    localStorage.setItem('board-data', JSON.stringify(newBoardData));
  };

  const handleCurrentText = (word) => {
    let boardWords = boardData.boardWords;
    let rowIndex = boardData.rowIndex;
    boardWords[rowIndex] = word;
    let newBoardData = { ...boardData, boardWords: boardWords };
    setBoardData(newBoardData);
  };

  const handleKeyPress = (key) => {
    if (boardData.rowIndex > 5 || boardData.status === 'WIN') return;

    if (key === 'ENTER') {
      if (chArr.length === 5) {
        let word = chArr.join('').toLowerCase();

        if (!words[word.charAt(0)].includes(word)) {
          handleError();
          handleMessage('Not in word list');
          return;
        }

        enterBoardWord(word);
        setChArr([]);
      } else {
        handleMessage('Not enough letters');
      }

      return;
    }

    if (key === '⌫') {
      chArr.splice(chArr.length - 1, 1);
      setChArr([...chArr]);
    } else if (chArr.length < 5) {
      chArr.push(key);
      setChArr([...chArr]);
    }

    handleCurrentText(chArr.join('').toLowerCase());
  };

  // reset board
  const reset = () => {
    var alphaIndex = Math.floor(Math.random() * 26);
    var wordIndex = Math.floor(
      Math.random() * words[String.fromCharCode(97 + alphaIndex)].length
    );
    let newBoardData = {
      ...boardData,
      solution: words[String.fromCharCode(97 + alphaIndex)][wordIndex],
      rowIndex: 0,
      boardWords: [],
      boardRowStatus: [],
      presentCharArray: [],
      absentCharArray: [],
      correctCharArray: [],
      status: 'IN_PROGRESS',
    };
    setBoardData(newBoardData);
    localStorage.setItem('board-data', JSON.stringify(newBoardData));
  };

  return (
    <div className="container">
      <header className="top">
        <div className="title">WORDLE CLONE</div>
      </header>
      {message && <div className="message">{message}</div>}
      <main className="cube">
        {[0, 1, 2, 3, 4, 5].map((row, rowIndex) => (
          <div
            className={`cube-row ${
              boardData && row === boardData.rowIndex && error && 'error'
            }`}
            key={rowIndex}
          >
            {[0, 1, 2, 3, 4].map((column, letterIndex) => (
              <div
                key={letterIndex}
                className={`letter ${
                  boardData && boardData.boardRowStatus[row]
                    ? boardData.boardRowStatus[row][column]
                    : ''
                }`}
              >
                {boardData &&
                  boardData.boardWords[row] &&
                  boardData.boardWords[row][column]}
              </div>
            ))}
          </div>
        ))}
        <button className="reset-btn" onClick={reset}>
          Reset
        </button>
      </main>
      <div className="bottom">
        <Keyboard boardData={boardData} handleKeyPress={handleKeyPress} />
      </div>
      <footer className="footer">
        Created by
        <a href="https://github.com/hrishabhgoel" className="my-link">
          Hrishabh Goel
        </a>
      </footer>
    </div>
  );
};

export default App;
