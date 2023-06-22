const gameContainer = document.getElementById('game');
const gameOverContainer = document.getElementById('game-over');
let grid = [];
let rows = 0;
let cols = 0;
const bombs = 16;
const maxAttempts = 100;
let gameEnded = false;

// AVVIA IL GIOCO CON IL NUMERO DI RIGHE E COLONNE SPECIFICATO
function startGame(numRows, numCols) {
  rows = numRows;
  cols = numCols;
  grid = generateGrid(rows, cols);
  renderGrid();
  gameEnded = false;
  gameOverContainer.style.display = 'none';
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