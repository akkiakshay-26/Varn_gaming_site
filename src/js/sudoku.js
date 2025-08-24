// Sudoku game logic
export function initSudokuGame(elementId) {
    const board = document.getElementById(elementId);
    const grid = [];
    let solution = [];

    function generateBoard(difficulty) {
        board.innerHTML = '';
        grid.length = 0;
        
        // Generate a new solvable board
        const initialGrid = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        solution = JSON.parse(JSON.stringify(initialGrid));
        solveSudoku(solution);
        
        const removals = { easy: 40, medium: 50, hard: 60, "very-hard": 65 };
        let toRemove = removals[difficulty] || 65;
        let cells = [];
        for(let i=0; i<81; i++) cells.push(i);
        
        while(toRemove > 0) {
            const randomIndex = Math.floor(Math.random() * cells.length);
            const cellIndex = cells.splice(randomIndex, 1)[0];
            const row = Math.floor(cellIndex / 9);
            const col = cellIndex % 9;
            initialGrid[row][col] = 0;
            toRemove--;
        }

        for (let i = 0; i < 9; i++) {
            grid[i] = [];
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-board-cell';
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                if (initialGrid[i][j] !== 0) {
                    input.value = initialGrid[i][j];
                    input.readOnly = true;
                    input.classList.add('text-teal-400');
                }
                
                input.addEventListener('input', (e) => {
                    let val = e.target.value;
                    if (!/^[1-9]$/.test(val)) {
                        e.target.value = '';
                    }
                    if (val && parseInt(val) !== solution[i][j]) {
                        input.classList.add('text-red-500');
                    } else {
                        input.classList.remove('text-red-500');
                    }
                });
                
                cell.appendChild(input);
                board.appendChild(cell);
                grid[i][j] = { element: input, value: initialGrid[i][j] };
            }
        }
    }

    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) {
                                return true;
                            } else {
                                board[row][col] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
            const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
            const boxCol = Math.floor(col / 3) * 3 + (i % 3);
            if (board[boxRow][boxCol] === num) {
                return false;
            }
        }
        return true;
    }

    function solveAll() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if (!grid[i][j].element.readOnly) {
                     grid[i][j].element.value = solution[i][j];
                     grid[i][j].element.classList.remove('text-red-500');
                }
            }
        }
    }

    function solveStep() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if (!grid[i][j].element.readOnly && grid[i][j].element.value === '') {
                     grid[i][j].element.value = solution[i][j];
                     grid[i][j].element.classList.remove('text-red-500');
                     return;
                }
            }
        }
    }

    function clearBoard() {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if (!grid[i][j].element.readOnly) {
                     grid[i][j].element.value = '';
                     grid[i][j].element.classList.remove('text-red-500');
                }
            }
        }
    }

    return { generateBoard, solveAll, solveStep, clearBoard };
}