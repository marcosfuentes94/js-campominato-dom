const gameContainer = document.getElementById('game');
const gameOverContainer = document.getElementById('game-over');
let grid = [];
let rows = 0;
let cols = 0;
const bombs = 16;
const maxAttempts = 100;
let gameEnded = false;
let score = 0;

// AVVIA IL GIOCO CON IL NUMERO DI RIGHE E COLONNE SPECIFICATO
function startGame(numRows, numCols) {
rows = numRows;
cols = numCols;
grid = generateGrid(rows, cols);
renderGrid();
gameEnded = false;
gameOverContainer.style.display = 'none';
score = 0;
}

// GENERA UNA GRIGLIA DI GIOCO CON UN NUMERO SPECIFICATO DI RIGHE E COLONNE
function generateGrid(numRows, numCols) {
const grid = [];
const bombIndices = generateBombIndices(numRows, numCols);

for (let i = 0; i < numRows; i++) {
const row = [];

for (let j = 0; j < numCols; j++) {
    row.push({
    row: i,
    col: j,
    isMine: bombIndices.includes(i * numCols + j),
    isRevealed: false, // IMPOSTA INIZIALMENTE LA CELLA COME NON RIVELATA
    });
}

grid.push(row);
}

return grid;
}
// GENERA GLI INDICI DELLE BOMBE IN MANIERA CASUALE
function generateBombIndices(numRows, numCols) {
const bombIndices = [];
const totalCells = numRows * numCols;

while (bombIndices.length < bombs && bombIndices.length < totalCells) {
    const randomIndex = Math.floor(Math.random() * totalCells);

    if (!bombIndices.includes(randomIndex)) {
    bombIndices.push(randomIndex);
    }
}

return bombIndices;
}

// RENDERIZZA LA GRIGLIA DEL GIOCO NEL DOCUMENTO HTML
function renderGrid() {
gameContainer.innerHTML = '';

for (let i = 0; i < rows; i++) {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    for (let j = 0; j < cols; j++) {
    const cell = grid[i][j];
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.row = cell.row;
    cellElement.dataset.col = cell.col;
    cellElement.addEventListener('click', handleCellClick);
    rowElement.appendChild(cellElement);
    }

    gameContainer.appendChild(rowElement);
}
}
// GESTISCE IL CLICK SU UNA CELLA DEL GIOCO
function handleCellClick(event) {
if (gameEnded) {
    return;
}

const row = parseInt(event.target.dataset.row);
const col = parseInt(event.target.dataset.col);
const cell = grid[row][col];

// SE LA CELLA È GIÀ STATA RIVELATA, NON FARE NULLA
if (cell.isRevealed) {
    return;
}

// SE LA CELLA CONTIENE UNA MINA, MOSTRA UN MESSAGGIO DI SCONFITTA
if (cell.isMine) {
event.target.classList.add('clicked');
endGame(false);
} else {
event.target.classList.add('revealed');
cell.isRevealed = true;
const count = countAdjacentMines(row, col);
event.target.textContent = count;

// SE NON CI SONO MINE ADIACENTI, RIVELA LE CELLE ADIACENTI
if (count === 0) {
    revealAdjacentCells(row, col);
}

score++;
}

// SE TUTTE LE CELLE NON-MINE SONO STATE RIVELATE, MOSTRA UN MESSAGGIO DI VITTORIA
if (checkWin()) {
endGame(true);
}
}
// CONTA IL NUMERO DI MINE ADIACENTI A UNA DETERMINATA CELLA
function countAdjacentMines(row, col) {
let count = 0;

for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
    if (i === 0 && j === 0) {
        continue;
    }

    const newRow = row + i;
    const newCol = col + j;

    if (isValidCell(newRow, newCol) && grid[newRow][newCol].isMine) {
        count++;
    }
    }
}

return count;
}

// RIVELA LE CELLE ADIACENTI A UNA DETERMINATA CELLA
function revealAdjacentCells(row, col) {
for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
    if (i === 0 && j === 0) {
        continue;
    }

    const newRow = row + i;
    const newCol = col + j;

    if (isValidCell(newRow, newCol) && !grid[newRow][newCol].isRevealed) {
        const cellElement = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
        cellElement.click();
    }
    }
}
}
// VERIFICA SE IL GIOCATORE HA VINTO
function checkWin() {
let nonMineCellsRevealed = 0;

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
    if (!grid[i][j].isMine && grid[i][j].isRevealed) {
        nonMineCellsRevealed++;
    }
    }
}

const totalNonMineCells = rows * cols - bombs;
return nonMineCellsRevealed === totalNonMineCells;
}

// VERIFICA SE UNA CELLA È VALIDA ALL'INTERNO DELLA GRIGLIA DI GIOCO
function isValidCell(row, col) {
return row >= 0 && row < rows && col >= 0 && col < cols;
}
// TERMINA IL GIOCO
function endGame(isWin) {
gameEnded = true;

if (isWin) {
    alert('HAI VINTO! Score: ' + score);
} else {
    alert('HAI PERSO! Score: ' + score);
}

gameOverContainer.style.display = 'block';
gameOverContainer.textContent = 'GAME OVER! SCORE: ' + score;
}

// AVVIO DEL GIOCO CON 10 RIGHE E 10 COLONNE
startGame(10, 10);

