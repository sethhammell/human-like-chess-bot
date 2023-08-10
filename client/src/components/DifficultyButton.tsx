import styles from "@styles/Home.module.css";

interface DifficultyButtonProps {
  difficulty: string;
  timePerMove: string;
  onClick: () => void;
  isSelected: boolean;
}

const DifficultyButton: React.FC<DifficultyButtonProps> = ({
  difficulty,
  timePerMove,
  onClick,
  isSelected,
}) => {
  return (
    <button
      className={`${styles.button} ${isSelected ? styles.selectedButton : ""}`}
      onClick={onClick}
    >
      {difficulty}
      <span className={styles.tooltip}>{timePerMove} per move</span>
    </button>
  );
};

export default DifficultyButton;
