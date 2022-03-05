import React from 'react';
import { keys } from './Keys';
import './keyboard.css';

const Keyboard = ({ board, handleKeyPress }) => {
  return (
    <div className="keyboard-rows">
      {keys.map((item, index) => (
        <div className="row" key={index}>
          {item.map((key, keyIndex) => (
            <button
              key={keyIndex}
              className={`${
                board && board.correctChArr.includes(key)
                  ? 'key-correct'
                  : board && board.presentChArr.includes(key)
                  ? 'key-present'
                  : board && board.absentChArr.includes(key)
                  ? 'key-absent'
                  : ''
              }`}
              onClick={() => {
                handleKeyPress(key);
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
