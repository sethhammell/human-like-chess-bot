import React from "react";
import Card from "./Card";

interface GameControlsProps {
  isPlayerTurn: boolean;
  onResign: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isPlayerTurn,
  onResign,
}) => {
  return (
    <div className="rounded-lg shadow-custom p-6 bg-darkGray">
      <Card width="w-1/5">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">
          {isPlayerTurn ? "Your Turn" : "Waiting for Opponent"}
        </h2>
        <button className="text-red-500 mt-4" onClick={onResign}>
          Resign
        </button>
      </Card>
    </div>
  );
};

export default GameControls;
