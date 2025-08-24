// Tetris game logic
export function initTetrisGame(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas with ID "${canvasId}" not found.`);
        return;
    }
    const context = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const nextElement = document.getElementById('next');
    
    canvas.width = 320;
    canvas.height = 640;

    const TILE_SIZE = 32;
    const COLS = 10;
    const ROWS = 20;

    let board = createBoard();
    let score = 0;
    let currentPiece = getNewPiece();
    let nextPiece = getNewPiece();
    let gameOver = false;
    let lastTime = 0;
    let dropInterval = 1000;

    const PIECES = [
        { shape: [[1,1,1,1]], color: 'cyan' },
        { shape: [[1,1,1],[0,1,0]], color: 'purple' },
        { shape: [[1,1,1],[1,0,0]], color: 'blue' },
        { shape: [[1,1,1],[0,0,1]], color: 'orange' },
        { shape: [[1,1],[1,1]], color: 'yellow' },
        { shape: [[0,1,1],[1,1,0]], color: 'green' },
        { shape: [[1,1,0],[0,1,1]], color: 'red' }
    ];

    function createBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function drawTile(x, y, color) {
        context.fillStyle = color;
        context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        context.strokeStyle = 'black';
        context.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    function drawBoard() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col] !== 0) {
                    drawTile(col, row, board[row][col]);
                }
            }
        }
    }

    function getNewPiece() {
        const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
        return {
            shape: piece.shape,
            color: piece.color,
            x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }

    function drawPiece(piece) {
        piece.shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value === 1) {
                    drawTile(piece.x + colIndex, piece.y + rowIndex, piece.color);
                }
            });
        });
    }
    
    function drawNextPiece() {
        if (!nextElement) return;
        nextElement.innerHTML = '';
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        const tempCtx = tempCanvas.getContext('2d');
        nextPiece.shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value === 1) {
                    tempCtx.fillStyle = nextPiece.color;
                    tempCtx.fillRect(colIndex * (100 / 4) + 10, rowIndex * (100 / 4) + 10, (100 / 4), (100 / 4));
                    tempCtx.strokeStyle = 'black';
                    tempCtx.strokeRect(colIndex * (100 / 4) + 10, rowIndex * (100 / 4) + 10, (100 / 4), (100 / 4));
                }
            });
        });
        nextElement.appendChild(tempCanvas);
    }

    function isValidMove(piece, dx, dy) {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[0].length; col++) {
                if (piece.shape[row][col] === 1) {
                    const newX = piece.x + col + dx;
                    const newY = piece.y + row + dy;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== 0)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function mergePiece(piece) {
        piece.shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value === 1) {
                    board[piece.y + rowIndex][piece.x + colIndex] = piece.color;
                }
            });
        });
    }

    function clearLines() {
        let linesCleared = 0;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== 0)) {
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(0));
                linesCleared++;
                row++;
            }
        }
        if (linesCleared > 0) {
            score += linesCleared * 100;
            scoreElement.innerText = score;
        }
    }

    function gameLoop(timestamp = 0) {
        if(gameOver) return;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (deltaTime > dropInterval) {
            if (isValidMove(currentPiece, 0, 1)) {
                currentPiece.y++;
            } else {
                mergePiece(currentPiece);
                clearLines();
                currentPiece = nextPiece;
                nextPiece = getNewPiece();
                drawNextPiece();
                if (!isValidMove(currentPiece, 0, 0)) {
                    gameOver = true;
                    alert("Game Over!");
                }
            }
            lastTime = timestamp;
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawPiece(currentPiece);
        requestAnimationFrame(gameLoop);
    }
    
    function rotatePiece() {
        const originalShape = currentPiece.shape;
        const rotatedShape = originalShape[0].map((_, index) => originalShape.map(row => row[index]).reverse());
        const originalPiece = JSON.parse(JSON.stringify(currentPiece));
        currentPiece.shape = rotatedShape;
        
        if(!isValidMove(currentPiece, 0, 0)){
            currentPiece.shape = originalPiece.shape;
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        if (e.key === 'ArrowLeft') {
            if (isValidMove(currentPiece, -1, 0)) currentPiece.x--;
        } else if (e.key === 'ArrowRight') {
            if (isValidMove(currentPiece, 1, 0)) currentPiece.x++;
        } else if (e.key === 'ArrowDown') {
            if (isValidMove(currentPiece, 0, 1)) currentPiece.y++;
        } else if (e.key === 'ArrowUp') {
            rotatePiece();
        } else if (e.key === ' ') {
            while (isValidMove(currentPiece, 0, 1)) {
                currentPiece.y++;
            }
        } else if (e.key === 'r' || e.key === 'R') {
            resetGame();
        }
    });

    function resetGame() {
        board = createBoard();
        score = 0;
        scoreElement.innerText = score;
        gameOver = false;
        currentPiece = getNewPiece();
        nextPiece = getNewPiece();
        drawNextPiece();
        gameLoop();
    }

    drawNextPiece();
    gameLoop();
}