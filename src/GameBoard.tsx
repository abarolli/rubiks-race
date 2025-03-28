import React, { useEffect, useState } from "react";

import Square from "./Square";
import Board from "./Board";
import TargetBoard from "./TargetBoard";

export type GamePiece = { id: number; size: string; color: string };

interface GameBoardProps {
  gamePieceSize: string;
}

function GameBoard({ gamePieceSize }: GameBoardProps) {
  const randomPieces = (gamePieceSize: string) => {
    const nSquaresPerColor = 4;
    const gameBoard: GamePiece[] = [
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "blue" })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "white" })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "green" })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "orange" })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "red" })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "yellow" })),
      { id: 0, size: gamePieceSize, color: "black" },
    ];

    for (let i = 0; i < 15; i++) {
      const randA = Math.floor(Math.random() * gameBoard.length),
        randB = Math.floor(Math.random() * gameBoard.length);

      const temp = gameBoard[randA];
      gameBoard[randA] = gameBoard[randB];
      gameBoard[randB] = temp;
    }

    for (let i = 0; i < gameBoard.length; i++) gameBoard[i].id = i;

    return gameBoard;
  };

  const randomTargetBoard = (squareSize: string) => {
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
      if (colorCounter[color] < 4) {
        board.push({ squareSize, color });
        colorCounter[color] += 1;
      }
    }

    return board;
  };

  const [gamePieces, setGamePieces] = useState(randomPieces(gamePieceSize));
  const [targetBoard, setTargetBoard] = useState(randomTargetBoard("20px"));
  const [winStatus, setWinStatus] = useState(false);

  const isEmptySpace = (index: number): boolean => {
    return gamePieces[index].color === "black";
  };

  const isAtLeftEdge = (index: number): boolean => {
    return index % 5 === 0;
  };

  const isAtRightEdge = (index: number): boolean => {
    return index % 5 === 4;
  };

  const isAtTopEdge = (index: number): boolean => {
    return index < 5;
  };

  const isAtBottomEdge = (index: number): boolean => {
    return index >= 20;
  };

  const shiftLeft = (
    leftIndex: number,
    index: number,
    currentPieces: GamePiece[]
  ) => {
    var tempNullPiece = currentPieces[leftIndex];
    for (; leftIndex < index; leftIndex++)
      currentPieces[leftIndex] = currentPieces[leftIndex + 1];

    currentPieces[leftIndex] = tempNullPiece;

    return currentPieces;
  };

  const shiftRight = (
    rightIndex: number,
    index: number,
    currentPieces: GamePiece[]
  ) => {
    var tempNullPiece = currentPieces[rightIndex];
    for (; rightIndex > index; rightIndex--)
      currentPieces[rightIndex] = currentPieces[rightIndex - 1];

    currentPieces[rightIndex] = tempNullPiece;

    return currentPieces;
  };

  const shiftUp = (
    topIndex: number,
    index: number,
    currentPieces: GamePiece[]
  ) => {
    var tempNullPiece = currentPieces[topIndex];
    for (; topIndex < index; topIndex += 5)
      currentPieces[topIndex] = currentPieces[topIndex + 5];

    currentPieces[topIndex] = tempNullPiece;

    return currentPieces;
  };

  const shiftDown = (
    bottomIndex: number,
    index: number,
    currentPieces: GamePiece[]
  ) => {
    var tempNullPiece = currentPieces[bottomIndex];
    for (; bottomIndex > index; bottomIndex -= 5)
      currentPieces[bottomIndex] = currentPieces[bottomIndex - 5];

    currentPieces[bottomIndex] = tempNullPiece;

    return currentPieces;
  };

  const getInnerSquares = () => {
    const inner = [];
    for (let i = 6; i <= 16; i += 5) {
      for (let j = 0; j < 3; j++) inner.push(gamePieces[i + j]);
    }

    return inner;
  };

  const checkInnerSquare = () => {
    const inner = getInnerSquares();
    console.log(targetBoard);
    console.log(inner);
    for (let i = 0; i < targetBoard.length; i++) {
      if (inner[i].color !== targetBoard[i].color) return false;
    }
    return true;
  };

  useEffect(() => {
    console.log("Game pieces changed, checking win status");

    if (checkInnerSquare()) setWinStatus(true);
  }, [gamePieces]);

  const handleClick = (index: number) => {
    setGamePieces((currentConfiguration) => {
      let left = index,
        right = index,
        top = index,
        bottom = index;

      const newConfiguration = [...currentConfiguration];

      while (!isAtLeftEdge(left)) {
        left -= 1;
        if (isEmptySpace(left)) shiftLeft(left, index, newConfiguration);
      }

      while (!isAtRightEdge(right)) {
        right += 1;
        if (isEmptySpace(right)) shiftRight(right, index, newConfiguration);
      }

      while (!isAtTopEdge(top)) {
        top -= 5;
        if (isEmptySpace(top)) {
          shiftUp(top, index, newConfiguration);
        }
      }

      while (!isAtBottomEdge(bottom)) {
        bottom += 5;
        if (isEmptySpace(bottom)) {
          shiftDown(bottom, index, newConfiguration);
        }
      }

      return newConfiguration;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "grey",
        rowGap: "20px",
      }}
    >
      <TargetBoard squares={targetBoard} />
      <Board
        squareSize={gamePieceSize}
        squares={gamePieces.map((piece, index) => (
          <Square
            key={piece.id}
            size={piece.size}
            color={piece.color}
            onClick={() => handleClick(index)}
          />
        ))}
      />
      {winStatus && <h3>Congratulations!</h3>}
    </div>
  );
}

export default GameBoard;
