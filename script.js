const puzzle = [
["C","A","T","#","S"],
["A","#","R","#","E"],
["R","A","T","E","S"],
["#","#","E","#","#"],
["D","O","G","#","S"]
];

const grid = document.getElementById("grid");

puzzle.forEach((row, rowIndex) => {

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    row.forEach((cell, colIndex) => {

        if (cell === "#") {

            const block = document.createElement("div");
            block.classList.add("block");
            rowDiv.appendChild(block);

        } else {

            const input = document.createElement("input");
            input.classList.add("cell");
            input.maxLength = 1;

            input.dataset.row = rowIndex;
            input.dataset.col = colIndex;

            rowDiv.appendChild(input);

        }

    });

    grid.appendChild(rowDiv);

});

