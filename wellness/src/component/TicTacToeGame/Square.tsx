import type { PlayerValue } from "../../type";

interface SquareProps {
  value: PlayerValue;
  onClick: () => void;
  isWinning: boolean;
  isDisabled: boolean; // New prop to control visual disable state
}

/**
 * Square component for Tic-Tac-Toe board.
 */
const Square = (props :SquareProps) => {
    const { value, onClick, isWinning, isDisabled } =props
    
  let colorClass = '';
  let ringClass = '';

  if (value === 'X') {
    colorClass = 'text-green-500 shadow-green-600/50';
  } else if (value === 'O') {
    colorClass = 'text-red-500 shadow-red-600/50';
  }

  if (isWinning) {
    ringClass = 'ring-4 ring-yellow-400 bg-yellow-100/50';
  }

  return (
    <button
      className={`
        w-full h-full text-5xl font-extrabold rounded-lg transition duration-150 ease-in-out
        flex items-center justify-center
        bg-white hover:bg-gray-50 active:scale-95
        shadow-md hover:shadow-lg ${ringClass} ${colorClass}
        ${isDisabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-gray-50'}
      `}
      onClick={onClick}
      // Disable if occupied OR if the computer is thinking (isDisabled is true)
      disabled={value !== null || isDisabled}
      aria-label={value ? `Cell occupied by ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
};

export default Square