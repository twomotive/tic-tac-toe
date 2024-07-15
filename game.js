
const GameBoard = (() => {

    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const updateCell = (index, player) => {
        if (board[index] === '') {
            board[index] = player;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    return { getBoard, updateCell ,reset };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            Player('Player 1', 'X'),
            Player('Player 2', 'O')
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        GameBoard.reset();
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const playTurn = (index) => {
        if (gameOver) return;

        if (GameBoard.updateCell(index, getCurrentPlayer().marker)) {
            if (checkWinner(index)) {
                gameOver = true;
                return `${getCurrentPlayer().name} wins!`;
            } else if (checkDraw()) {
                gameOver = true;
                return "It's a draw!";
            }
            switchPlayer();
        }
    };

    const checkWinner = (index) => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombos
            .filter(combo => combo.includes(index))
            .some(combo => combo.every(
                i => GameBoard.getBoard()[i] === getCurrentPlayer().marker
            ));
    };

    const checkDraw = () => {
        return GameBoard.getBoard().every(cell => cell !== '');
    };

    return { start, playTurn, getCurrentPlayer, gameOver };
})();


const DisplayController = (() => {
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const messageDisplay = document.getElementById('message');
    const markAreas = document.querySelectorAll('.area');


    const initializeGame = function () {
        startButton.addEventListener("click", function (e) {
            GameController.start();
            updateBoard();
            messageDisplay.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
        });

        resetButton.addEventListener("click", function (e) {
            GameController.start();
            updateBoard();
            messageDisplay.textContent = `Game reset. ${GameController.getCurrentPlayer().name}'s turn`;
        });

        markAreas.forEach((area, index) => {
            area.addEventListener('click', () => handleCellClick(index));
        });
    };

    const updateBoard = function () {
        const board = GameBoard.getBoard();
        markAreas.forEach((area, index) => {
            area.textContent = board[index];
        });
    };

    const handleCellClick = function (index) {
        if (!GameController.gameOver) {
            const result = GameController.playTurn(index);
            updateBoard();
            if (result) {
                messageDisplay.textContent = result;
            } else {
                messageDisplay.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
            }
        }
    };

    return { initializeGame };
})();

DisplayController.initializeGame()