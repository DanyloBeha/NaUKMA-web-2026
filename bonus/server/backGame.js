/*
--- Нотатки ---

Тут будуть матриці поле боя для двох гравців. Зберігатись вони будуть як 2D масив 10 на 10.
Для перевіри результати ураження (поранив чи потопив) треба буде зробити bfs поки не пройдемо весь корабель, відслідковуючи чи є живі палуби.
Матриця матиме такі типи даних: пусто, палуба і уражена палуба. Чи може просто зберігати кораблі та їхні координати?

Після кожного попадання буде лінійний пошук по всій матриці, щоб з'ясувати, чи всі кораблі знищено

ID на полі:
0 - пусто
1 - палуба
2 - влучив
3 - промах

Стадії гри: waiting -> playing -> over
*/

// ----- socket.io connection -----
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://danylobeha.github.io"
    }
});

app.use(express.static('../client'));

// assigns p1 and p2 to the first two opened tabs
io.on('connection', (socket) => {
    let playerId = null;
    if (!game.players['p1'].ws) {
        playerId = 'p1';
    } else if (!game.players['p2'].ws) {
        playerId = 'p2';
    } else {
        socket.disconnect();
        return;
    }
    game.players[playerId].ws = socket;

    let enemyId;
    if (playerId == 'p1') {
        enemyId = 'p2';
    } else {
        enemyId = 'p1';
    }

    // own board always will be on the left and enemy board always will be on right
    socket.emit('boardInit', {
        userBoard: flattenBoard(game.players[playerId].board),
        enemyBoard: flattenEnemyBoard(game.players[enemyId].board)
    });

    socket.on('toggleCell', ({row, col}) => {
        if (game.status != 'waiting') { return; }
        
        const tboard = game.players[playerId].board;
        if (tboard[row][col] == 0) {
            game.players[playerId].board[row][col] = 1;
        } else if (tboard[row][col] == 1) {
            game.players[playerId].board[row][col] = 0;
        }
        socket.emit('boardUpdate', {
            userBoard: flattenBoard(game.players[playerId].board)
        });
    });

    socket.on('startGame', () => {
        if (game.status !== 'waiting') { return; }
        game.players[playerId].status = 'ready';
        if (game.players['p1'].status == 'ready' && game.players['p2'].status == 'ready') {
            game.status = 'playing';
            game.players['p1'].ws.emit('gameStarted', {yourTurn: game.toMove == 'p1'});
            game.players['p2'].ws.emit('gameStarted', {yourTurn: game.toMove == 'p2'});
        }
    });

    socket.on('shoot', ({row, col}) => {
        if (game.status != 'playing') { return; }
        if (game.toMove != playerId) { return; }

        shoot(enemyId, row, col);
        game.toMove = enemyId;

        game.players['p1'].ws.emit('boardsUpdate', {userBoard: flattenBoard(game.players['p1'].board), enemyBoard: flattenEnemyBoard(game.players['p2'].board), yourTurn: game.toMove == 'p1'});
        game.players['p2'].ws.emit('boardsUpdate', {userBoard: flattenBoard(game.players['p2'].board), enemyBoard: flattenEnemyBoard(game.players['p1'].board), yourTurn: game.toMove == 'p2'});

        if (game.status == 'over') {
            game.players[playerId].ws.emit('gameOver', {winner: 'you'});
            game.players[enemyId].ws.emit('gameOver', {winner: 'enemy'});
        }
    });

    socket.on('disconnect', () => {
        game.players[playerId].ws = null;
        game.players[playerId].status = 'waiting';
    });
});

server.listen(process.env.PORT || 3000);

/**
 * Turning 2D array from game logic into array of flat objects for WebDataRocks
 * 
 * @param {*} board 
 * @returns 
 */
function flattenBoard(board) {
    const flat = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            flat.push({row: String(i), col: String(j), state: board[i][j]});
        }
    }
    return flat;
}

/**
 * Turning 2D array from game logic into array of flat objects for WebDataRocks.
 * 
 * And turning cells with id = 1 to cells with id = 0 for the client side
 * 
 * @param {*} board 
 * @returns 
 */
function flattenEnemyBoard(board) {
    const flat = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (board[i][j] != 1) {
                flat.push({row: String(i), col: String(j), state: board[i][j]});
            } else {
                flat.push({row: String(i), col: String(j), state: 0});
            }
            
        }
    }
    return flat;
}


// ----- game logic -----
let game = {
    "players": {
        "p1": {"ws": null, "board": generateEmptyBoard(), "status": "waiting"},
        "p2": {"ws": null, "board": generateEmptyBoard(), "status": "waiting"},
    },
    "toMove": "p1",
    "status": "waiting"
}

function generateEmptyBoard() {
    let board = []
    for (let i = 0; i < 10; i++) {
        board.push([]);
        for (let j = 0; j < 10; j++) {
            board[i].push(0);
        }
    }
    return board;
}

/* 

 * Randomly fills board with ships
 * 
 * 10 ships:
 * 1 x 4, 2 x 3, 3 x 2, 4 x 1
 * 
 * @param {*} board 

function fillBoardWithShipsRandom(board) {
    const shipsLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

}
*/

/**
 * Only called in playing state, only called on cell with ID 0 or 1.
 * This function is clean 2d array modification and can change game status
 * 
 * @param {*} targetPlayer 
 * @param {*} x 
 * @param {*} y 
 */
function shoot(targetPlayer, row, col) {
    const cell = game.players[targetPlayer].board[row][col];
    if (cell == 2 || cell == 3) { return; }

    // else - shoot and change moveTo to next player
    if (cell == 0) {
        game.players[targetPlayer].board[row][col] = 3;
    } else if (cell == 1) {
        game.players[targetPlayer].board[row][col] = 2;
        if (checkShipSunk(targetPlayer, row, col)) {
            // notify the client
        }

        if (checkGameOver(targetPlayer)) {
            game.status = "over";
        }
    }
}

/**
 * Checks if the ship hit is destroyed or not.
 * And marks all the cells aroung the ship with ID 3 if the ship is destroyed
 *  
 * @param {*} targetPlayer 
 * @param {*} row 
 * @param {*} col 
 */
function checkShipSunk(targetPlayer, row, col) {
    const board = game.players[targetPlayer].board;
    let rowDelta = 0, colDelta = 0;
    let shipCoords = [];
    shipCoords.push([row, col]);

    // dfs in all directions to check if ship is sunk
    // right
    while (board[row][col+colDelta] == 2 && col+colDelta < 9) {
        if (board[row][col+(++colDelta)] == 1) { return false; }
        if (board[row][col+colDelta] == 2) { shipCoords.push([row, col+colDelta]); }
    }

    // left
    colDelta = 0;
    while (board[row][col-colDelta] == 2 && col-colDelta > 0) {
        if (board[row][col-(++colDelta)] == 1) { return false; }
        if (board[row][col-colDelta] == 2) { shipCoords.push([row, col-colDelta]); }
    }

    // down
    while (board[row+rowDelta][col] == 2 && row+rowDelta < 9) {
        if (board[row+(++rowDelta)][col] == 1) { return false; }
        if (board[row+rowDelta][col] == 2) { shipCoords.push([row+rowDelta, col]); }
    }

    // up
    rowDelta = 0;
    while (board[row-rowDelta][col] == 2 && row-rowDelta > 0) {
        if (board[row-(++rowDelta)][col] == 1) { return false; }
        if (board[row-rowDelta][col] == 2) { shipCoords.push([row-rowDelta, col]); }
    }

    // here we know the ship is sunk - marking the surrounding cells of shipCoords with id = 3
    // algorithm - iterate through shipCoords, for each cell iterate through all the neighbours and if neightbour == 0, assign 3 to it
    const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]   // 8 directions, [row, column]
    for (let coord of shipCoords) {
        for (let dir of directions) {
            const r = coord[0] + dir[0], c = coord[1] + dir[1];
            if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] == 0) {
                game.players[targetPlayer].board[r][c] = 3;
            }
        }
    }

    return true;
}

/**
 * Checks if player has lost
 * 
 * @param {*} targetPlayer 
 */
function checkGameOver(targetPlayer) {
    const board = game.players[targetPlayer].board;
    let count = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            // game not over if == 1
            if (board[i][j] == 1) { return false; }
        }
    }
    return true;
}