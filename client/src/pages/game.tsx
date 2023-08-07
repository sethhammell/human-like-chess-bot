import React, { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { Chess } from "chess.js";
import { Move, Square } from "chess.js";

import { Chessboard } from "react-chessboard";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const difficulty = context.query.difficulty || "easy";
  return {
    props: {
      difficulty,
    },
  };
}

interface GameProps {
  difficulty: string;
}

const Game: React.FC<GameProps> = ({ difficulty }) => {
  const [game, setGame] = useState(new Chess());

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
