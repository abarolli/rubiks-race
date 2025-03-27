import React from "react";

export interface SquareProps {
  size: string;
  color: string;
  onClick?: any;
}

const Square = React.memo(({ size, color, onClick }: SquareProps) => {
  return (
    <div
      className="game-piece"
      style={{ height: size, width: size, backgroundColor: color }}
      onClick={onClick}
    ></div>
  );
});

export default Square;
