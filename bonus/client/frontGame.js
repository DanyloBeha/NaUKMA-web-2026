// creating the table
const userBoardPivot = new WebDataRocks({
    container: "#userBoard",
    report: {
        dataSource: {
            data: []
        },
    },
    customizeCell: function(cell, data) {
        cell.style.width = "30px";
        cell.style.height = "30px";
    }
});

const enemyBoardPivot = new WebDataRocks({
    container: "#enemyBoard",
    report: {
        dataSource: {
            data: []
        },
    },
    customizeCell: function(cell, data) {
        cell.style.width = "30px";
        cell.style.height = "30px";
    }
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

socket.on('boardInit', ({userBoard, enemyBoard}) => {
    userBoardPivot.updateData({data: userBoard});
    enemyBoardPivot.updateData({data: enemyBoard});
});