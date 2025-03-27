import React, { useState } from "react";

import Square from "./Square";
import Board from "./Board";

export type GamePiece = { id: number; size: string; color: string };

interface GameBoardProps {
  gamePieceSize: string;
}

function GameBoard({ gamePieceSize }: GameBoardProps) {
  const randomBoard = (gamePieceSize: string) => {
    console.log("randomizing board");

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

  const [gamePieces, setGamePieces] = useState(randomBoard(gamePieceSize));

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
    const gamePiecesCopy = [...currentPieces];

    var tempNullPiece = gamePiecesCopy[leftIndex];
    for (; leftIndex < index; leftIndex++)
      gamePiecesCopy[leftIndex] = gamePiecesCopy[leftIndex + 1];

    gamePiecesCopy[leftIndex] = tempNullPiece;

    return gamePiecesCopy;
  };

  const shiftRight = (
    rightIndex: number,
    index: number,
    currentPieces: GamePiece[]
  ) => {
    const gamePiecesCopy = [...currentPieces];

    var tempNullPiece = gamePiecesCopy[rightIndex];
    for (; rightIndex > index; rightIndex--)
      gamePiecesCopy[rightIndex] = gamePiecesCopy[rightIndex - 1];

    gamePiecesCopy[rightIndex] = tempNullPiece;

    return gamePiecesCopy;
  };

  const shiftUp = (
    topIndex: number,
    index: number,
    currentPieces: GamePiece[]
  ) => {
    const gamePiecesCopy = [...currentPieces];

    var tempNullPiece = gamePiecesCopy[topIndex];
    for (; topIndex < index; topIndex += 5)
      gamePiecesCopy[topIndex] = gamePiecesCopy[topIndex + 5];

    gamePiecesCopy[topIndex] = tempNullPiece;

    return gamePiecesCopy;
  };

  const shiftDown = (
    bottomIndex: number,
    index: number,
    currentPieces: GamePiece[]
  ) => {
    const gamePiecesCopy = [...currentPieces];

    var tempNullPiece = gamePiecesCopy[bottomIndex];
    for (; bottomIndex > index; bottomIndex -= 5)
      gamePiecesCopy[bottomIndex] = gamePiecesCopy[bottomIndex - 5];

    gamePiecesCopy[bottomIndex] = tempNullPiece;

    return gamePiecesCopy;
  };

  const handleClick = (index: number) => {
    setGamePieces((currentConfiguration) => {
      let left = index,
        right = index,
        top = index,
        bottom = index;

      const newConfiguration = [...currentConfiguration];

      while (!isAtLeftEdge(left)) {
        left -= 1;
        if (isEmptySpace(left)) return shiftLeft(left, index, newConfiguration);
      }

      while (!isAtRightEdge(right)) {
        right += 1;
        if (isEmptySpace(right))
          return shiftRight(right, index, newConfiguration);
      }

      while (!isAtTopEdge(top)) {
        top -= 5;
        if (isEmptySpace(top)) {
          return shiftUp(top, index, newConfiguration);
        }
      }

      while (!isAtBottomEdge(bottom)) {
        bottom += 5;
        if (isEmptySpace(bottom)) {
          return shiftDown(bottom, index, newConfiguration);
        }
      }

      return currentConfiguration;
    });
  };

  return (
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
  );
}

export default GameBoard;
