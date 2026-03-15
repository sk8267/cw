// --- PUZZLE DEFINITION ---
// '#' = black square, letters = correct answers
const puzzle = [
  ["#","#","#","#","#","#","#","#","C","#","#","#","#","#"],
  ["#","#","D","O","G","#","#","#","A","#","#","#","#","#"],
  ["#","#","#","#","#","#","#","#","T","#","#","#","#","#"],
  ["#","#","#","#","#","#","#","#","#","#","#","#","#","#"],
  ["#","#","#","B","A","T","#","#","#","#","#","#","#","#"]
];

// Across and Down clues will be generated automatically with numbering
// For demonstration, here are placeholder clues (replace with your clues)
const cluesAcross = {};
const cluesDown = {};

// --- GET DOM ELEMENTS ---
const grid = document.getElementById("grid");
const acrossList = document.getElementById("across");
const downList = document.getElementById("down");
const checkButton = document.getElementById("checkButton");

// Set CSS grid columns dynamically
grid.style.gridTemplateColumns = `repeat(${puzzle[0].length}, 40px)`;

// Data structures to keep track of numbering and clue mapping
const numbering = [];
let clueNumber = 1;

// Helper: Check if a cell is white (answer cell)
function isWhiteCell(r, c) {
  return r >= 0 && r < puzzle.length &&
         c >= 0 && c < puzzle[0].length &&
         puzzle[r][c] !== '#';
}

// Helper: Check if a cell is start of an across word
function isStartAcross(r, c) {
  if (!isWhiteCell(r, c)) return false;
  if (!isWhiteCell(r, c-1)) {  // left cell blocked or out of bounds
    // must have at least 2 letters in row
    return isWhiteCell(r, c+1);
  }
  return false;
}

// Helper: Check if a cell is start of a down word
function isStartDown(r, c) {
  if (!isWhiteCell(r, c)) return false;
  if (!isWhiteCell(r-1, c)) {  // above cell blocked or out of bounds
    // must have at least 2 letters down
    return isWhiteCell(r+1, c);
  }
  return false;
}

// Store clue data: number => {row, col, direction, length}
const clueDataAcross = {};
const clueDataDown = {};

// Create the grid and assign clue numbers
for (let r=0; r<puzzle.length; r++) {
  for (let c=0; c<puzzle[0].length; c++) {
    if (puzzle[r][c] === '#') {
      numbering.push(null);
      continue;
    }

    // Determine if cell is start of across or down word
    const startAcross = isStartAcross(r,c);
    const startDown = isStartDown(r,c);

    let cellNumber = null;
    if (startAcross || startDown) {
      cellNumber = clueNumber++;
    }
    numbering.push(cellNumber);
  }
}

// Reset grid container before building
grid.innerHTML = "";

// Build the grid elements
for (let r=0; r<puzzle.length; r++) {
  for (let c=0; c<puzzle[0].length; c++) {

    if (puzzle[r][c] === '#') {
      const block = document.createElement("div");
      block.classList.add("block");
      grid.appendChild(block);
      continue;
    }

    const inputWrapper = document.createElement("div");
    inputWrapper.style.position = "relative";

    const input = document.createElement("input");
    input.classList.add("cell");
    input.maxLength = 1;
    input.dataset.row = r;
    input.dataset.col = c;

    // Automatically uppercase input
    input.addEventListener("input", () => {
      input.value = input.value.toUpperCase();

      // Move focus to next input cell (to the right or down if at row end)
      moveFocus(input, "forward");
    });

    // Keyboard navigation with arrow keys
    input.addEventListener("keydown", e => {
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
        e.preventDefault();
        let direction;
        switch(e.key) {
          case "ArrowLeft": direction = "left"; break;
          case "ArrowRight": direction = "right"; break;
          case "ArrowUp": direction = "up"; break;
          case "ArrowDown": direction = "down"; break;
        }
        moveFocus(input, direction);
      }
    });

    inputWrapper.appendChild(input);

    // Add clue number if this cell starts a clue
    const idx = r * puzzle[0].length + c;
    const num = numbering[idx];
    if (num !== null) {
      const numberDiv = document.createElement("div");
      numberDiv.classList.add("clue-number");
      numberDiv.textContent = num;
      inputWrapper.appendChild(numberDiv);
    }

    grid.appendChild(inputWrapper);
  }
}

// --- Generate Clues ---

// Generate across clues with their word and position
function generateAcrossClues() {
  cluesAcrossList = [];
  for (let r=0; r<puzzle.length; r++) {
    let c=0;
    while (c<puzzle[0].length) {
      if (isStartAcross(r,c)) {
        let length = 1;
        while (c + length < puzzle[0].length && isWhiteCell(r, c+length)) {
          length++;
        }
        const num = numbering[r * puzzle[0].length + c];
        const word = puzzle[r].slice(c, c+length).join("");
        cluesAcrossList.push({num, clue: `Across ${num}: ${word}`, r, c, length});
        c += length;
      } else {
        c++;
      }
    }
  }
  return cluesAcrossList;
}

// Generate down clues with their word and position
function generateDownClues() {
  cluesDownList = [];
  for (let c=0; c<puzzle[0].length; c++) {
    let r=0;
    while (r<puzzle.length) {
      if (isStartDown(r,c)) {
        let length = 1;
        while (r + length < puzzle.length && isWhiteCell(r+length, c)) {
          length++;
        }
        const num = numbering[r * puzzle[0].length + c];
        let word = "";
        for (let i=0; i<length; i++) {
          word += puzzle[r+i][c];
        }
        cluesDownList.push({num, clue: `Down ${num}: ${word}`, r, c, length});
        r += length;
      } else {
        r++;
      }
    }
  }
  return cluesDownList;
}

// Show clues in the lists
function showClues() {
  acrossList.innerHTML = "";
  downList.innerHTML = "";

  const across = generateAcrossClues();
  const down = generateDownClues();

  across.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.clue;
    li.dataset.num = item.num;
    li.dataset.r = item.r;
    li.dataset.c = item.c;
    li.dataset.length = item.length;
    acrossList.appendChild(li);
  });

  down.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.clue;
    li.dataset.num = item.num;
    li.dataset.r = item.r;
    li.dataset.c = item.c;
    li.dataset.length = item.length;
    downList.appendChild(li);
  });
}

showClues();

// --- Check Answers ---

checkButton.addEventListener("click", () => {
  document.querySelectorAll(".cell").forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const answer = puzzle[r][c];
    const guess = cell.value.toUpperCase();

    if (guess === answer) {
      cell.style.backgroundColor = "#90EE90"; // green
    } else {
      cell.style.backgroundColor = "#FFB6B6"; // red
    }
  });
});

// --- Focus Movement Helper ---
// Moves focus based on direction or forward after typing
function moveFocus(currentInput, direction) {
  const r = parseInt(currentInput.dataset.row);
  const c = parseInt(currentInput.dataset.col);

  let newR = r;
  let newC = c;

  const maxR = puzzle.length - 1;
  const maxC = puzzle[0].length - 1;

  const getInputAt = (row, col) => {
    if (row < 0 || col < 0 || row > maxR || col > maxC) return null;
    const idx = row * (maxC+1) + col;
    const inputs = grid.querySelectorAll("input.cell");
    // inputs are in grid order, but with blocks too, so can't use idx directly
    // instead find input with matching data-row and data-col
    for (const input of inputs) {
      if (parseInt(input.dataset.row) === row && parseInt(input.dataset.col) === col) {
        return input;
      }
    }
    return null;
  };

  if (direction === "forward" || direction === "right") {
    // move right, skipping blocks
    do {
      if (newC < maxC) newC++; else if (newR < maxR) { newC = 0; newR++; } else return;
    } while (!isWhiteCell(newR, newC));
  } else if (direction === "left") {
    // move left
    do {
      if (newC > 0) newC--; else if (newR > 0) { newR--; newC = maxC; } else return;
    } while (!isWhiteCell(newR, newC));
  } else if (direction === "up") {
    do {
      if (newR > 0) newR--; else return;
    } while (!isWhiteCell(newR, newC));
  } else if (direction === "down") {
    do {
      if (newR < maxR) newR++; else return;
    } while (!isWhiteCell(newR, newC));
  }

  const nextInput = getInputAt(newR, newC);
  if (nextInput) nextInput.focus();
}
