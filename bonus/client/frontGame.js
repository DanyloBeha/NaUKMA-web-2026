/*
ID 0 = nothing
ID 1 = gray color, nothing in enemy
ID 2 = ✘
ID 3 = •
*/

// creating the table
function customCell(cell, data) {
    console.log(data.type, data.value);
    if (data.type != 'value') { return; }
    switch (Number(data.value)) {
        case 0: cell.style.backgroundColor = 'white'; cell.innerHTML = '';  break;
        case 1: cell.style.backgroundColor = 'gray'; cell.innerHTML = '';  break;
        case 2: cell.style.backgroundColor = 'red'; cell.innerHTML = '✘';  break;
        case 3: cell.style.backgroundColor = 'white'; cell.innerHTML = '•';  break;
    }
}

const userBoardPivot = new WebDataRocks({
    container: "#userBoard",
    toolbar: false,
    customizeCell: customCell
});

const enemyBoardPivot = new WebDataRocks({
    container: "#enemyBoard",
    toolbar: false,
    customizeCell: customCell
});

let gameStatus = 'waiting';

userBoardPivot.on('cellclick', function(cell) {
    if (gameStatus != 'waiting') { return; }
    const row = cell.rowIndex - 2;
    const col = cell.columnIndex - 1;
    if (row < 0 || row > 9 || col < 0 || col > 9) { return; }
    socket.emit('toggleCell', {row, col});
});

enemyBoardPivot.on('cellclick', function(cell) {
    if (gameStatus != 'playing') { return; }
    const row = cell.rowIndex - 2;
    const col = cell.columnIndex - 1;
    if (row < 0 || row > 9 || col < 0 || col > 9) { return; }
    socket.emit('shoot', {row, col});
});


document.querySelector('.confirmShips').addEventListener('click', function(event) {
    socket.emit('startGame');
    event.target.style.display = 'none';
});

// socket.io connection
const socket = io('https://naukma-web-2026.onrender.com');

const cellSize = 30;
const colSizes = [];
const rowSizes = [];
for (let i = 0; i < 11; i++) {
    colSizes.push({idx: i, width: cellSize});
    rowSizes.push({idx: i, height: cellSize});
}

const boardReport = (data) => ({
    dataSource: { data },
    slice: {
        rows: [{uniqueName: "row"}],
        columns: [{uniqueName: "col"}],
        measures: [{uniqueName: "state", aggregation: "sum"}]
    },
    options: {
        grid: {
            showGrandTotals: "off",
            showTotals: "off"
        }
    },
    tableSizes: {
        columns: colSizes,
        rows: rowSizes
    }
});

socket.on('boardInit', ({userBoard, enemyBoard}) => {
    userBoardPivot.setReport(boardReport(userBoard));
    enemyBoardPivot.setReport(boardReport(enemyBoard));
});

socket.on('boardUpdate', ({userBoard}) => {
    userBoardPivot.setReport(boardReport(userBoard));
});

socket.on('gameStarted', ({yourTurn}) => {
    gameStatus = 'playing';
    if (yourTurn == true) {
        document.getElementById('turnInfo').textContent = "Ваш хід";
    } else {
        document.getElementById('turnInfo').textContent = "Хід суперника";
    }
});

socket.on('boardsUpdate', ({userBoard, enemyBoard, yourTurn}) => {
    userBoardPivot.setReport(boardReport(userBoard));
    enemyBoardPivot.setReport(boardReport(enemyBoard));
    if (yourTurn == true) {
        document.getElementById('turnInfo').textContent = "Ваш хід";
    } else {
        document.getElementById('turnInfo').textContent = "Хід суперника";
    }
});

socket.on('gameOver', ({winner}) => {
    if (winner == "you") {
        alert("Ви перемогли!")
    } else {
        alert("Ви програли!")
    }
});