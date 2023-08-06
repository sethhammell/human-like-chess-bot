import styles from "@styles/Home.module.css";

interface DifficultyButtonProps {
  difficulty: string;
  timePerMove: string;
  onClick: () => void;
}

const DifficultyButton: React.FC<DifficultyButtonProps> = ({
  difficulty,
  timePerMove,
  onClick,
}) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {difficulty}
      <span className={styles.tooltip}>{timePerMove} per move</span>
    </button>
  );
};

export default DifficultyButton;
