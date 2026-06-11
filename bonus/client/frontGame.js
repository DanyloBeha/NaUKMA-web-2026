// creating the table
const userBoardPivot = new WebDataRocks({
    container: "#userBoard",
    toolbar: true
    // customizeCell: function(cell, data) {
    //     cell.style.width = "30px";
    //     cell.style.height = "30px";
    // }
});

const enemyBoardPivot = new WebDataRocks({
    container: "#enemyBoard",
    toolbar: true
    // customizeCell: function(cell, data) {
    //     cell.style.width = "30px";
    //     cell.style.height = "30px";
    // }
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
const cellSizes = [];
for (let i = 0; i < 10; i++) {
    cellSizes.push({ idx: i, width: cellSize });
}

const boardReport = (data) => ({
    dataSource: { data },
    slice: {
        rows: [{ uniqueName: "row" }],
        columns: [{ uniqueName: "col" }],
        measures: [{ uniqueName: "state", aggregation: "sum" }]
    },
    options: {
        grid: {
            showGrandTotals: "off",
            showTotals: "off"
        }
    },
    tableSizes: {
        columns: cellSizes,
        rows: cellSizes
    }
});

socket.on('boardInit', ({userBoard, enemyBoard}) => {
    userBoardPivot.setReport(boardReport(userBoard));
    enemyBoardPivot.setReport(boardReport(enemyBoard));
});