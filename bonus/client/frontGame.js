// creating the table
const userBoardPivot = new WebDataRocks({
    container: "#userBoard",
    toolbar: false,
    report: {
        dataSource: {
            data: []
        },
        slice: {
            rows: [{ uniqueName: "row" }],
            columns: [{ uniqueName: "col" }],
            measures: [{ uniqueName: "state", aggregation: "sum" }]
        },
        tableSizes: {
            columns: [
                {idx: 0, width: 30},
                {idx: 1, width: 30},
                {idx: 2, width: 30},
                {idx: 3, width: 30},
                {idx: 4, width: 30},
                {idx: 5, width: 30},
                {idx: 6, width: 30},
                {idx: 7, width: 30},
                {idx: 8, width: 30},
                {idx: 9, width: 30}
            ],
            rows: [
                {idx: 0, width: 30},
                {idx: 1, width: 30},
                {idx: 2, width: 30},
                {idx: 3, width: 30},
                {idx: 4, width: 30},
                {idx: 5, width: 30},
                {idx: 6, width: 30},
                {idx: 7, width: 30},
                {idx: 8, width: 30},
                {idx: 9, width: 30}
            ]
        }
    }
    // customizeCell: function(cell, data) {
    //     cell.style.width = "30px";
    //     cell.style.height = "30px";
    // }
});

const enemyBoardPivot = new WebDataRocks({
    container: "#enemyBoard",
    toolbar: false,
    report: {
        dataSource: {
            data: []
        },
        slice: {
            rows: [{ uniqueName: "row" }],
            columns: [{ uniqueName: "col" }],
            measures: [{ uniqueName: "state", aggregation: "sum" }]
        },
        tableSizes: {
            columns: [
                {idx: 0, width: 30},
                {idx: 1, width: 30},
                {idx: 2, width: 30},
                {idx: 3, width: 30},
                {idx: 4, width: 30},
                {idx: 5, width: 30},
                {idx: 6, width: 30},
                {idx: 7, width: 30},
                {idx: 8, width: 30},
                {idx: 9, width: 30}
            ],
            rows: [
                {idx: 0, width: 30},
                {idx: 1, width: 30},
                {idx: 2, width: 30},
                {idx: 3, width: 30},
                {idx: 4, width: 30},
                {idx: 5, width: 30},
                {idx: 6, width: 30},
                {idx: 7, width: 30},
                {idx: 8, width: 30},
                {idx: 9, width: 30}
            ]
        }
    }
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
const colSizes = [];
const rowSizes = [];
for (let i = 0; i < 10; i++) {
    cellSizes.push({idx: i, width: cellSize});
    cellSizes.push({idx: i, height: cellSize});
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