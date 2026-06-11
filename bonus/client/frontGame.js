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
    // cell.rowIndex, cell.columnIndex
    alert("Click on home board, row: " + cell.rowIndex + ", column: " + cell.columnIndex);
});

enemyBoardPivot.on('cellclick', function(cell) {
    // cell.rowIndex, cell.columnIndex
    alert("Click on enemy board, row: " + cell.rowIndex + ", column: " + cell.columnIndex);
});


// socket.io connection
const socket = io('https://naukma-web-2026.onrender.com');

const cellSize = 30;
const colSizes = [];
const rowSizes = [];
for (let i = 0; i < 10; i++) {
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