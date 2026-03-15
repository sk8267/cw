// crossword layout
const puzzle = [
["C","A","T","#","S"],
["A","#","R","#","E"],
["R","A","T","E","S"],
["#","#","E","#","#"],
["D","O","G","#","S"]
];

// get grid container
const grid = document.getElementById("grid");

// build crossword grid
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

            // store coordinates
            input.dataset.row = rowIndex;
            input.dataset.col = colIndex;

            // automatically move to next cell
            input.addEventListener("input", () => {
                input.value = input.value.toUpperCase();

                const next = input.nextElementSibling;
                if (next && next.classList.contains("cell")) {
                    next.focus();
                }
            });

            rowDiv.appendChild(input);

        }

    });

    grid.appendChild(rowDiv);

});


// check answers button
document.getElementById("checkButton").addEventListener("click", checkAnswers);


// function to verify answers
function checkAnswers() {

    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {

        const row = cell.dataset.row;
        const col = cell.dataset.col;

        const correctLetter = puzzle[row][col];
        const userLetter = cell.value.toUpperCase();

        if (userLetter === correctLetter) {
            cell.style.backgroundColor = "#90EE90"; // green
        } else {
            cell.style.backgroundColor = "#FFB6B6"; // red
        }

    });

}
