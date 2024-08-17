const cells = document.querySelectorAll('[data-cell]');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X'; // Player is X, AI is O
let gameState = Array(9).fill(null);
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

const handleCellClick = (e) => {
    const cellIndex = Array.from(cells).indexOf(e.target);

    if (gameState[cellIndex] || !gameActive || currentPlayer === 'O') {
        return;
    }

    makeMove(cellIndex, 'X');

    if (gameActive) {
        setTimeout(aiMove, 500); // Delay AI move for a more natural feel
    }
};

const aiMove = () => {
    const bestMove = minimax(gameState, 'O').index;
    makeMove(bestMove, 'O');
};

const makeMove = (cellIndex, player) => {
    gameState[cellIndex] = player;
    cells[cellIndex].textContent = player;

    if (checkWinner(player)) {
        statusDisplay.textContent = `Player ${player} Wins!`;
        gameActive = false;
    } else if (gameState.every(cell => cell)) {
        statusDisplay.textContent = `Draw!`;
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    }
};

const checkWinner = (player) => {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === player);
    });
};

const resetGame = () => {
    currentPlayer = 'X';
    gameState.fill(null);
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
};

const minimax = (newGameState, player) => {
    const emptyCells = newGameState.map((val, index) => val === null ? index : null).filter(val => val !== null);

    if (checkWinner('X')) {
        return { score: -10 };
    } else if (checkWinner('O')) {
        return { score: 10 };
    } else if (emptyCells.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        const move = {};
        move.index = emptyCells[i];
        newGameState[emptyCells[i]] = player;

        if (player === 'O') {
            const result = minimax(newGameState, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newGameState, 'O');
            move.score = result.score;
        }

        newGameState[emptyCells[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
