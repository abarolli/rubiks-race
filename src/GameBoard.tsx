import React, { useEffect, useRef, useState } from "react";

import Square from "./Square";
import Board from "./Board";
import TargetBoard from "./TargetBoard";

type Color = "blue" | "orange" | "red" | "white" | "yellow" | "green" | "black";

export type GamePiece = { id: number; size: string; color: Color };

interface GameBoardProps {
  gamePieceSize: string;
}

function GameBoard({ gamePieceSize }: GameBoardProps) {
  const randomPieces = (gamePieceSize: string) => {
    const nSquaresPerColor = 4;
    const gameBoard: GamePiece[] = [
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "blue" as Color })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "white" as Color })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "green" as Color })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "orange" as Color })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "red" as Color })),
      ...Array(nSquaresPerColor)
        .fill(null)
        .map(() => ({ id: 0, size: gamePieceSize, color: "yellow" as Color })),
      { id: 0, size: gamePieceSize, color: "black" as Color },
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
  const [time, setTime] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const slideAudio = useRef<HTMLAudioElement>(new Audio("/audio/slide.wav"));
  const winAudio = useRef<HTMLAudioElement>(new Audio("/audio/winner.wav"));

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

    if (checkInnerSquare()) {
      setWinStatus(true);
      setRunning(false);
      winAudio.current.play();
    }
  }, [gamePieces]);

  useEffect(() => {
    if (!isRunning) return;

    let interval = setInterval(() => {
      setTime((time) => time + 1);
      console.log("setting time");
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleClick = (index: number) => {
    if (winStatus) return;
    setRunning(true);
    setGamePieces((currentConfiguration) => {
      let left = index,
        right = index,
        top = index,
        bottom = index;

      const newConfiguration = [...currentConfiguration];
      let shifted = false;
      while (!isAtLeftEdge(left)) {
        left -= 1;
        if (isEmptySpace(left)) {
          shiftLeft(left, index, newConfiguration);
          shifted = true;
        }
      }

      while (!isAtRightEdge(right)) {
        right += 1;
        if (isEmptySpace(right)) {
          shiftRight(right, index, newConfiguration);
          shifted = true;
        }
      }

      while (!isAtTopEdge(top)) {
        top -= 5;
        if (isEmptySpace(top)) {
          shiftUp(top, index, newConfiguration);
          shifted = true;
        }
      }

      while (!isAtBottomEdge(bottom)) {
        bottom += 5;
        if (isEmptySpace(bottom)) {
          shiftDown(bottom, index, newConfiguration);
          shifted = true;
        }
      }

      if (shifted) {
        slideAudio.current.currentTime = 0;
        slideAudio.current.play();
      }
      return newConfiguration;
    });
  };

  const reset = () => {
    setTargetBoard(randomTargetBoard("20px"));
    setGamePieces(randomPieces(gamePieceSize));
    setWinStatus(false);
    setTime(0);
    setRunning(false);
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
      {(isRunning || winStatus) && `${time}s`}
      {winStatus && <h3>Congratulations!</h3>}
      {winStatus && (
        <button style={{ padding: "10px" }} onClick={reset}>
          Reset
        </button>
      )}
    </div>
  );
}

export default GameBoard;
