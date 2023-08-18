import React, { useState, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { Chess } from "chess.js";
import { Move, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { DIFFICULTY_MAP, Difficulty } from "@utils/difficultyUtils";
import { fetchAiMove } from "@utils/apiService";
import MoveData from "@utils/moveData";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const difficulty = context.query.difficulty || "easy";
  return {
    props: {
      difficulty,
    },
  };
}

interface GameProps {
  difficulty: Difficulty;
}

const Game: React.FC<GameProps> = ({ difficulty }) => {
  const [game, setGame] = useState(new Chess());
  const [playerTurn, setPlayerTurn] = useState(true);
  const [positionsAnalyzed, setPositionsAnalyzed] = useState(0);
  const [predictedWr, setPredictedWr] = useState(-1);

  const maxDepth = DIFFICULTY_MAP[difficulty];

  useEffect(() => {
    if (!playerTurn) {
      fetchAiMove(game.fen(), maxDepth).then((moveData: MoveData | null) => {
        try {
          if (!moveData) throw new Error("Error in move data");

          const move = game.move(moveData.moveUci);
          makeMove(move);
          setPositionsAnalyzed(moveData.positionsAnalyzed);
          setPredictedWr(moveData.predictedWr);
          setPlayerTurn(true);
        } catch (error) {
          console.error("Error interpreting move:", error);
        }
      });
    }
  }, [playerTurn]);

  function makeMove(move: Move) {
    const gameCopy = new Chess(game.fen());
    try {
      const result = gameCopy.move(move);
      setGame(gameCopy);
      return result;
    } catch (e) {
      return null;
    }
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    let move = makeMove({
      from: sourceSquare,
      to: targetSquare,
    } as Move);

    if (!move) {
      move = makeMove({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      } as Move);
    }

    if (!move) return false;

    setPlayerTurn(false);
    return true;
  }

  return (
    <div>
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        snapToCursor={true}
        boardWidth={700}
      />
    </div>
  );
};

export default Game;
