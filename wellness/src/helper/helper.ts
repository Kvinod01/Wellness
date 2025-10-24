import type { PlayerValue, WinnerInfo } from "../type";

export const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};


export const calculateWinner = (squares: PlayerValue[]): WinnerInfo | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
};

export const getComputerMove = (squares: PlayerValue[]): number | null => {
  const emptyIndices = squares.map((val, i) => (val === null ? i : null)).filter(val => val !== null) as number[];
  if (emptyIndices.length === 0) return null;

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkLine = (player: PlayerValue): number | null => {
    for (const line of lines) {
      let playerCount = 0;
      let emptySpot: number | null = null;

      for (const i of line) {
        if (squares[i] === player) {
          playerCount++;
        } else if (squares[i] === null) {
          emptySpot = i;
        }
      }
      // If the player has two in a row and the third spot is empty, return the empty spot
      if (playerCount === 2 && emptySpot !== null) {
        return emptySpot;
      }
    }
    return null;
  };

  // 1. Check for **winning** move (Computer 'O')
  const winningMove = checkLine('O');
  if (winningMove !== null) return winningMove;

  // 2. Check for **blocking** move (Player 'X')
  const blockingMove = checkLine('X');
  if (blockingMove !== null) return blockingMove;

  // 3. Prioritize Center (4)
  if (emptyIndices.includes(4)) return 4;

  // 4. Prioritize Corners (0, 2, 6, 8)
  const corners = [0, 2, 6, 8].filter(i => emptyIndices.includes(i));
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // 5. Fallback: Random available spot (sides)
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};