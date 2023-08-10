import { useState } from "react";
import { useRouter } from "next/router";
import DifficultyButton from "@components/DifficultyButton";
import styles from "@styles/Home.module.css";

const Home = () => {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const handleSelectDifficulty = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = () => {
    if (selectedDifficulty) {
      router.push(`/game?difficulty=${selectedDifficulty}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Human-like Chess Bot!</h1>
      <p className={styles.subheading}>Choose your difficulty:</p>

      <div className={styles.buttonGroup}>
        <DifficultyButton
          isSelected={selectedDifficulty === "easy"}
          difficulty="Easy"
          timePerMove="1 second"
          onClick={() => handleSelectDifficulty("easy")}
        />

        <DifficultyButton
          isSelected={selectedDifficulty === "medium"}
          difficulty="Medium"
          timePerMove="10 seconds"
          onClick={() => handleSelectDifficulty("medium")}
        />

        <DifficultyButton
          isSelected={selectedDifficulty === "hard"}
          difficulty="Hard"
          timePerMove="1 minute"
          onClick={() => handleSelectDifficulty("hard")}
        />
      </div>
      <button
        className={styles.startButton}
        onClick={handleStartGame}
        disabled={!selectedDifficulty}
      >
        Start Game
      </button>
    </div>
  );
};

export default Home;
