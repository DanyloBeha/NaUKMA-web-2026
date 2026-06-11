/*
ID 0 = nothing
ID 1 = gray color, nothing in enemy
ID 2 = ✘
ID 3 = •
*/

// creating the table
const userBoardPivot = new WebDataRocks({
    container: "#userBoard",
    toolbar: false
});

const enemyBoardPivot = new WebDataRocks({
    container: "#enemyBoard",
    toolbar: false
});

userBoardPivot.on('cellclick', function(cell) {
    const row = cell.rowIndex - 2;
    const col = cell.columnIndex - 1;
    if (row < 0 || row > 9 || col < 0 || col > 9) return;
    socket.emit('toggleCell', {row, col});
});

// template
enemyBoardPivot.on('cellclick', function(cell) {
    // cell.rowIndex, cell.columnIndex
    alert("Click on enemy board, row: " + cell.rowIndex + ", column: " + cell.columnIndex);
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