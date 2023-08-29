import { Difficulty } from "@utils/difficultyUtils";
import { capitalizeFirstLetter } from "@utils/helpers";
import React from "react";
import Card from "@components/Card";

interface GameDetailsProps {
  difficulty: Difficulty;
  positionsAnalyzed: number;
  aiPredictedWinRate: number;
}

const GameDetails: React.FC<GameDetailsProps> = ({
  difficulty,
  positionsAnalyzed,
  aiPredictedWinRate,
}) => {
  return (
    <div>
      <Card width="w-[300px]">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">
          Difficulty: {capitalizeFirstLetter(difficulty)}
        </h2>
        <p className="text-gray-400 mb-4">
          Positions Analyzed: {positionsAnalyzed}
        </p>
        <p className="text-gray-400">
          AI Predicted Win Rate: {aiPredictedWinRate}
        </p>
      </Card>
    </div>
  );
};

export default GameDetails;
