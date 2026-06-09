const pivot = new WebDataRocks({
    container: "#pivotContainer",
    report: {
        dataSource: {
            filename: ""
        },
        slice: {
            rows: [
                {
                    filter: {
                        "type": "top",
                        quantity: 10,
                    }
                }
            ],
            columns: [
                {
                    filter: {
                        "type": "top",
                        quantity: 10,
                    }
                }
            ]
        }
    }
});

webdatarocks.on('cellclick', function(cell) {
    // cell.rowIndex, cell.columnIndex
    alert("Click on cell - row: " + cell.rowIndex + ", column: " + cell.columnIndex);
});