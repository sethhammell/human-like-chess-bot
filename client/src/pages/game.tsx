import React, { useState, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { Chess } from "chess.js";
import { Move, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { DIFFICULTY_MAP, Difficulty } from "@utils/difficultyUtils";
import { fetchAiMove } from "@utils/apiService";
import MoveData from "@utils/moveData";
import GameDetails from "@components/GameDetails";
import GameControls from "@components/GameControls";

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
  const [predictedWinRate, setPredictedWinRate] = useState(-1);

  const maxDepth = DIFFICULTY_MAP[difficulty];

  useEffect(() => {
    if (!playerTurn) {
      fetchAiMove(game.fen(), maxDepth).then((moveData: MoveData | null) => {
        try {
          if (!moveData) throw new Error("Error in move data");

          const move = game.move(moveData.move_uci);
          makeMove(move);
          setPositionsAnalyzed(moveData.positions_analyzed);
          setPredictedWinRate(moveData.predicted_wr);
          setPlayerTurn(true);
        } catch (error) {
          console.error("Error interpreting move: ", error);
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
    <div className="flex h-screen px-4 justify-center items-center">
      <div className="items-center self-center">
        <GameDetails
          difficulty={difficulty}
          positionsAnalyzed={positionsAnalyzed}
          aiPredictedWinRate={predictedWinRate}
        />
      </div>
      <div className="mx-16 items-center self-center">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          snapToCursor={true}
          boardWidth={750}
        />
      </div>
      <div className="items-center self-center">
        <GameControls
          isPlayerTurn={true}
          onResign={() => console.log("Resigned")}
        />
      </div>
    </div>
  );
};

export default Game;
