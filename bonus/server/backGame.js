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

game = {
    "players": {
        "p1": {"ws": null, "board": generateEmptyBoard()},
        "p2": {"ws": null, "board": generateEmptyBoard()},
    },
    "toMove": "p1",
    "status": "waiting"
}

function generateEmptyBoard() {
    board = []
    for (let i = 0; i < 10; i++) {
        board.push([]);
        for (let j = 0; j < 10; j++) {
            board[i].push(0);
        }
    }
    return board;
}

/**
 * Only called in playing state, only called on cell with ID 0 or 1
 * This function is clean 2d array modification, it has nothing to do with socket or client side
 * 
 * @param {*} targetPlayer 
 * @param {*} x 
 * @param {*} y 
 */
function shoot(targetPlayer, row, col) {
    const cell = game.players[targetPlayer].board[row][col];
    if (cell == 2 || cell == 3) { return; }

    if (cell == 0) {
        game.players[targetPlayer].board[row][col] = 3;
    } else if (cell == 1) {
        game.players[targetPlayer].board[row][col] = 2;
        if (checkShipSunk(targetPlayer, row, col)) {
            // mark surrouding cells, notify the client
        }

        if (checkGameOver(targetPlayer)) {
            game.status = "over";
        }
    }
}

/**
 * Checks if the ship hit is destroyed or not
 *  
 * @param {*} targetPlayer 
 * @param {*} row 
 * @param {*} col 
 */
function checkShipSunk(targetPlayer, row, col) {
    const board = game.players[targetPlayer].board;
    let rowDelta = 0, colDelta = 0;

    // right
    while (board[row][col+colDelta] == 2 && col+colDelta < 9) {
        if (board[row][col+(++colDelta)] == 1) { return false; }
    }

    // left
    colDelta = 0;
    while (board[row][col-colDelta] == 2 && col-colDelta > 0) {
        if (board[row][col-(++colDelta)] == 1) { return false; }
    }

    // down
    while (board[row+rowDelta][col] == 2 && row+rowDelta < 9) {
        if (board[row+(++rowDelta)][col] == 1) { return false; }
    }

    // up
    rowDelta = 0;
    while (board[row-rowDelta][col] == 2 && row-rowDelta > 0) {
        if (board[row-(++rowDelta)][col] == 1) { return false; }
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