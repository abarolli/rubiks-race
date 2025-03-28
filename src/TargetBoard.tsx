import React from "react";
import Board from "./Board";
import Square from "./Square";

interface TargetBoardProps {
  squares: any[];
}

function TargetBoard({ squares }: TargetBoardProps) {
  return (
    <Board
      squareSize="20px"
      squares={squares.map((square, index) => {
        return (
          <Square size={square.squareSize} color={square.color} key={index} />
        );
      })}
    />
  );
}

export default TargetBoard;
