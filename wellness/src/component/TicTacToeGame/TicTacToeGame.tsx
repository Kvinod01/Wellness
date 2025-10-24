import { useState, useMemo, useEffect, useCallback } from "react";
import { calculateWinner, getComputerMove } from "../../helper/helper";
import type { PlayerValue } from "../../type";
import Square from "./Square";

const TicTacToeGame = () => {
  const [squares, setSquares] = useState<PlayerValue[]>(Array(9).fill(null));
  // isGameActive is true when it's the player's turn, false when AI is thinking or game is over.
  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  // Derived State: Calculate winner
  const { winner, line } = useMemo(() => {
    const result = calculateWinner(squares);
    return {
      winner: result ? result.winner : null,
      line: result ? result.line : [],
    };
  }, [squares]);

  // Derived State: Determine if it's a draw
  const isDraw = useMemo(() => {
    return !winner && squares.every(square => square !== null);
  }, [winner, squares]);


  // --- Computer Move Logic (useEffect) ---
  useEffect(() => {
    // Stop if game is over or if it's still the human player's turn
    if (winner || isDraw || isGameActive) return;

    // Check if it's the computer's turn (i.e., X has just played)
    const xCount = squares.filter(val => val === 'X').length;
    const oCount = squares.filter(val => val === 'O').length;

    // Computer 'O' plays if X has one more move than O.
    if (xCount > oCount) {
      const computerMoveIndex = getComputerMove(squares);

      if (computerMoveIndex !== null) {
        // Delay the computer's move for a better UX
        const timer = setTimeout(() => {
          setSquares(prevSquares => {
            const nextSquares = prevSquares.slice();
            // Perform the computer move
            if (nextSquares[computerMoveIndex] === null) {
              nextSquares[computerMoveIndex] = 'O';
            }
            // After the move, re-enable the board for the human player
            setIsGameActive(true);
            return nextSquares;
          });
        }, 500); // 500ms delay

        return () => clearTimeout(timer); // Cleanup function for the timeout
      } else {
        // Should only happen if it was a draw before AI moved (e.g., last empty square taken by X)
        setIsGameActive(true);
      }
    } else if (xCount === oCount && xCount === 0) {
      // Start of game: Player 'X' always starts, so ensure the board is active.
      setIsGameActive(true);
    }
  }, [squares, winner, isDraw, isGameActive]);


  // Handle cell click (Human Player 'X')
  const handleClick = (i: number) => {
    // Only allow move if game is active, no winner, not a draw, and cell is empty
    if (!isGameActive || winner || isDraw || squares[i]) {
      return;
    }
    // Temporarily disable board while AI is about to respond
    setIsGameActive(false);
    const nextSquares: PlayerValue[] = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
    // AI move will be handled by the useEffect after this state update completes.
  };

  // Status message (Derived State)
  const status = useMemo(() => {
    if (winner) {
      return `Game Over! ${winner === 'X' ? 'You' : 'Computer'} Wins!`;
    } else if (isDraw) {
      return 'Draw!';
    } else if (!isGameActive && squares.filter(val => val !== null).length > 0) {
      return 'Computer (O) thinking...';
    } else {
      return 'Your turn (X)';
    }
  }, [winner, isDraw, isGameActive, squares]);

  // Reset function
  const handleReset = useCallback(() => {
    setSquares(Array(9).fill(null));
    // Player 'X' always starts
    setIsGameActive(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-2xl w-96 max-w-lg">
      <h3 className="text-3xl font-extrabold mb-4 text-indigo-700">Tic-Tac-Toe</h3>

      <div className={`text-xl font-bold mb-4 p-2 w-full text-center rounded-lg transition duration-500
          ${winner ? 'bg-yellow-100 text-yellow-800 scale-105' : 'bg-gray-50 text-gray-700'}`
      }>
        {status}
      </div>

      {/* Game Board Grid */}
      <div className="grid grid-cols-3 grid-rows-3 aspect-square gap-2 w-full max-w-lg bg-gray-200 p-2 rounded-lg">
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onClick={() => handleClick(i)}
            isWinning={line.includes(i)}
            isDisabled={!isGameActive || !!winner || isDraw} // Disable when AI is thinking or game is over
          />
        ))}
      </div>

      <button
        onClick={handleReset}
        className="mt-6 w-full py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition duration-150 active:scale-[0.98] shadow-md shadow-indigo-400/50"
      >
        Reset Game
      </button>

      {(winner || isDraw) && (
        <div className="mt-4 text-center text-lg font-medium text-gray-600">
          Ready for the next round of work?
        </div>
      )}
    </div>
  );
};

export default TicTacToeGame;