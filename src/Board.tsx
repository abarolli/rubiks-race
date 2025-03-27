import React from "react";
import Square, { SquareProps } from "./Square";

interface BoardProps {
  squareSize: string;
  squares: React.ReactElement<typeof Square>[];
}

function Board({ squareSize, squares }: BoardProps) {
  const sideLength = Math.sqrt(squares.length);
  return (
    <div
      className="game-board"
      style={{
        gridTemplate: `repeat(${sideLength}, ${squareSize}) / repeat(${sideLength}, ${squareSize})`,
      }}
    >
      {squares}
    </div>
  );
}

export default Board;
