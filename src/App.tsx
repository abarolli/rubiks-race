import { useEffect, useMemo, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import Square from "./Square";
import GameBoard, { GamePiece } from "./GameBoard";
import TargetBoard from "./TargetBoard";

function App() {
  return <GameBoard gamePieceSize="5rem" />;
}

export default App;
