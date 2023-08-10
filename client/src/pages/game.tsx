import React, { useState, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { Chess } from "chess.js";
import { Move, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { DIFFICULTY_MAP, Difficulty } from "@utils/difficultyUtils";
import { fetchAiMove } from "@utils/apiService";

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
  const [game, setGame] = useState(
    new Chess("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1")
  );
  const [playerTurn, setPlayerTurn] = useState(true);

  const maxDepth = DIFFICULTY_MAP[difficulty];

  useEffect(() => {
    if (!playerTurn) {
      fetchAiMove(game.fen(), maxDepth).then((moveUCI) => {
        try {
          const move = game.move(moveUCI);
          makeMove(move);
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

    setPlayerTurn(false); // Switch turn to AI after player makes a move.
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
