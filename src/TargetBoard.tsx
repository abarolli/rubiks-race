import React from "react";
import Board from "./Board";
import Square from "./Square";

function TargetBoard() {
  const randomBoard = (squareSize: string) => {
    console.log("randomizing board");

    const colorCounter = {
      blue: 0,
      white: 0,
      green: 0,
      orange: 0,
      red: 0,
      yellow: 0,
    };

    const nSquares = 9;
    const board = [];
    const colors: (keyof typeof colorCounter)[] = [
      "blue",
      "white",
      "green",
      "orange",
      "red",
      "yellow",
    ];
    while (board.length < nSquares) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      if (colorCounter[color] < 4) board.push({ squareSize, color });
    }

    return board;
  };

  return (
    <Board
      squareSize="20px"
      squares={randomBoard("20px").map((square, index) => {
        return (
          <Square size={square.squareSize} color={square.color} key={index} />
        );
      })}
    />
  );
}

export default TargetBoard;
