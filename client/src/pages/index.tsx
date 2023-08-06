import { useRouter } from "next/router";
import DifficultyButton from "@components/DifficultyButton";
import styles from "@styles/Home.module.css";
import "@styles/globals.css";

const IndexPage = () => {
  const router = useRouter();

  const handleStartGame = (difficulty: string) => {
    router.push(`/game?difficulty=${difficulty}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Human-like Chess Bot!</h1>
      <p className={styles.subheading}>Choose your difficulty:</p>

      <div className={styles.buttonGroup}>
        <DifficultyButton
          difficulty="Easy"
          timePerMove="1 second"
          onClick={() => handleStartGame("easy")}
        />

        <DifficultyButton
          difficulty="Medium"
          timePerMove="10 seconds"
          onClick={() => handleStartGame("medium")}
        />

        <DifficultyButton
          difficulty="Hard"
          timePerMove="1 minute"
          onClick={() => handleStartGame("hard")}
        />
      </div>
    </div>
  );
};

export default IndexPage;
