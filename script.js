// --- PUZZLE DEFINITION ---
// '#' = black square, letters = correct answers
const puzzle = [
  ["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","H","#","#","#"],
  ["#","#","#","#","#","#","#","#","#","#","#","#","#","D","A","F","F","O","D","I","L"],
  ["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","T","#","#","A"],
  ["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","-","#","#","M"],
  ["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","C","#","#","B"],
  ["#","#","#","C","H","I","C","K","#","#","B","#","#","P","#","#","#","R","#","#","#"],
  ["#","#","#","#","#","#","H","#","#","#","A","#","#","A","#","#","#","O","#","#","#"],
  ["#","#","#","#","#","#","U","#","T","#","S","P","R","I","N","G","#","S","#","#","#"],
  ["#","#","#","#","#","#","R","#","U","#","K","#","#","N","#","#","#","S","#","#","#"],
  ["#","#","#","B","#","#","C","#","L","#","E","A","S","T","E","R","#","B","#","#","#"],
  ["J","E","S","U","S","C","H","R","I","S","T","#","#","G","#","#","#","U","#","#","#"],
  ["#","#","#","N","#","R","#","#","P","#","#","#","E","G","G","H","U","N","T","#","#"],
  ["#","#","#","N","#","O","#","#","#","#","#","#","#","S","#","#","#","#","#","#","#"],
  ["#","#","#","Y","#","S","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"],
  ["#","#","#","#","#","S","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"]
];

// Picture clues for each clue number (use real URLs or local paths)
const pictureClues = {
  1: "https://i.imgur.com/3hVvYqM.png",  // example pic for clue 1
  2: "https://i.imgur.com/tYuKcwZ.png",
  3: "https://i.imgur.com/6Q9qHls.png",
  4: "https://i.imgur.com/vDLtBd5.png",
  5: "https://i.imgur.com/ei82TBl.png"
};

// --- DOM ELEMENTS ---
const grid = document.getElementById("grid");
const acrossList = document.getElementById("across");
const downList = document.getElementById("down");
const checkButton = document.getElementById("checkButton");
const cluesDiv = document.getElementById("clues");

// Set CSS grid columns dynamically
grid.style.gridTemplateColumns = `repeat(${puzzle[0].length}, 40px)`;

// Data structures for numbering and clues
const numbering = [];
let clueNumber = 1;

function isWhiteCell(r, c) {
  return r >= 0 && r < puzzle.length &&
         c >= 0 && c < puzzle[0].length &&
         puzzle[r][c] !== '#';
}

function isStartAcross(r, c) {
  if (!isWhiteCell(r, c)) return false;
  if (!isWhiteCell(r, c-1)) {
    return isWhiteCell(r, c+1);
  }
  return false;
}

function isStartDown(r, c) {
  if (!isWhiteCell(r, c)) return false;
  if (!isWhiteCell(r-1, c)) {
    return isWhiteCell(r+1, c);
  }
  return false;
}

// Keep track of clue data
const cluesAcrossData = [];
const cluesDownData = [];

// Numbering the grid and identifying clue starts
for (let r=0; r<puzzle.length; r++) {
  for (let c=0; c<puzzle[0].length; c++) {
    if (puzzle[r][c] === '#') {
      numbering.push(null);
      continue;
    }
    const startAcross = isStartAcross(r,c);
    const startDown = isStartDown(r,c);

    let cellNumber = null;
    if (startAcross || startDown) {
      cellNumber = clueNumber++;
    }
    numbering.push(cellNumber);
  }
}

// Clear grid
grid.innerHTML = "";

// Build grid with inputs and clue numbers
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

    inputWrapper.appendChild(input);

    const idx = r * puzzle[0].length + c;
    const num = numbering[idx];
    if (num !== null) {
      const numberDiv = document.createElement("div");
      numberDiv.classList.add("clue-number");
      numberDiv.textContent = num;
      inputWrapper.appendChild(numberDiv);
    }

    grid.appendChild(inputWrapper);

    // Auto uppercase and move forward on input
    input.addEventListener("input", () => {
      input.value = input.value.toUpperCase();
      moveFocus(input, "forward");
      highlightActiveWord(input);
    });

    // Arrow key navigation
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
        highlightActiveWord(input);
      }
    });

    // Highlight word on focus
    input.addEventListener("focus", () => {
      highlightActiveWord(input);
    });
  }
}

// Generate clues with their word positions
function generateAcrossClues() {
  const list = [];
  for (let r=0; r<puzzle.length; r++) {
    let c=0;
    while (c<puzzle[0].length) {
      if (isStartAcross(r,c)) {
        let length=1;
        while (c+length < puzzle[0].length && isWhiteCell(r, c+length)) {
          length++;
        }
        const num = numbering[r * puzzle[0].length + c];
        const word = puzzle[r].slice(c, c+length).join("");
        list.push({num, clue: `Across ${num}`, r, c, length, word});
        c += length;
      } else {
        c++;
      }
    }
  }
  return list;
}

function generateDownClues() {
  const list = [];
  for (let c=0; c<puzzle[0].length; c++) {
    let r=0;
    while (r<puzzle.length) {
      if (isStartDown(r,c)) {
        let length=1;
        while (r+length < puzzle.length && isWhiteCell(r+length, c)) {
          length++;
        }
        const num = numbering[r * puzzle[0].length + c];
        let word = "";
        for(let i=0; i<length; i++) {
          word += puzzle[r+i][c];
        }
        list.push({num, clue: `Down ${num}`, r, c, length, word});
        r += length;
      } else {
        r++;
      }
    }
  }
  return list;
}

// Show clues and attach click listeners
function showClues() {
  acrossList.innerHTML = "";
  downList.innerHTML = "";

  const across = generateAcrossClues();
  const down = generateDownClues();

  cluesAcrossData.length = 0;
  cluesDownData.length = 0;

  across.forEach(item => {
    cluesAcrossData.push(item);
    const li = document.createElement("li");
    li.textContent = item.clue;
    li.dataset.num = item.num;
    li.dataset.direction = "across";
    li.style.cursor = "pointer";
    li.addEventListener("click", () => focusClue(item));
    acrossList.appendChild(li);
  });

  down.forEach(item => {
    cluesDownData.push(item);
    const li = document.createElement("li");
    li.textContent = item.clue;
    li.dataset.num = item.num;
    li.dataset.direction = "down";
    li.style.cursor = "pointer";
    li.addEventListener("click", () => focusClue(item));
    downList.appendChild(li);
  });

  showPictureClues(across.concat(down));
}

showClues();

// Show picture clues under clues area
function showPictureClues(clues) {
  let picsDiv = document.getElementById("pictureClues");
  if (!picsDiv) {
    picsDiv = document.createElement("div");
    picsDiv.id = "pictureClues";
    cluesDiv.appendChild(picsDiv);
  }
  picsDiv.innerHTML = ""; // Clear existing

  clues.forEach(({num}) => {
    if (pictureClues[num]) {
      const img = document.createElement("img");
      img.src = pictureClues[num];
      img.alt = `Clue ${num} picture`;
      img.dataset.clueNum = num;
      img.style.width = "100px";
      img.style.margin = "5px";
      img.style.border = "2px solid #ccc";
      picsDiv.appendChild(img);
    }
  });
}

// Focus on clue's first cell and highlight
function focusClue(clue) {
  const firstCell = grid.querySelector(`input.cell[data-row='${clue.r}'][data-col='${clue.c}']`);
  if (firstCell) {
    firstCell.focus();
    highlightActiveWord(firstCell);
  }
}

// Highlight the word (across and down) for a focused cell
function highlightActiveWord(input) {
  // Clear previous highlights
  document.querySelectorAll(".cell").forEach(c => {
    c.style.backgroundColor = "";
  });
  // Clear highlighted clue text
  [...acrossList.children, ...downList.children].forEach(li => {
    li.style.fontWeight = "normal";
    li.style.color = "";
  });

  const r = parseInt(input.dataset.row);
  const c = parseInt(input.dataset.col);

  // Find clue numbers for across and down at this cell
  const idx = r * puzzle[0].length + c;
  const cellNum = numbering[idx];
  
  // Find across clue containing this cell
  const acrossClue = cluesAcrossData.find(clue => {
    if (clue.r !== r) return false;
    return (c >= clue.c && c < clue.c + clue.length);
  });

  // Find down clue containing this cell
  const downClue = cluesDownData.find(clue => {
    if (clue.c !== c) return false;
    return (r >= clue.r && r < clue.r + clue.length);
  });

  // Highlight across word cells
  if (acrossClue) {
    for(let col=acrossClue.c; col < acrossClue.c + acrossClue.length; col++) {
      const cell = grid.querySelector(`input.cell[data-row='${r}'][data-col='${col}']`);
      if(cell) cell.style.backgroundColor = "#e0f7fa";
    }
    // Highlight across clue text
    const li = [...acrossList.children].find(li => parseInt(li.dataset.num) === acrossClue.num);
    if (li) {
      li.style.fontWeight = "bold";
      li.style.color = "#00796b";
    }
  }

  // Highlight down word cells
  if (downClue) {
    for(let row=downClue.r; row < downClue.r + downClue.length; row++) {
      const cell = grid.querySelector(`input.cell[data-row='${row}'][data-col='${c}']`);
      if(cell) cell.style.backgroundColor = "#e0f7fa";
    }
    // Highlight down clue text
    const li = [...downList.children].find(li => parseInt(li.dataset.num) === downClue.num);
    if (li) {
      li.style.fontWeight = "bold";
      li.style.color = "#00796b";
    }
  }
}

// Check answers and update colors + hide pictures if solved
checkButton.addEventListener("click", () => {
  const cells = document.querySelectorAll(".cell");

  // Reset all inputs background first
  cells.forEach(cell => {
    cell.style.backgroundColor = "";
  });

  // Check each input vs puzzle letter
  cells.forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const answer = puzzle[r][c];
    const guess = cell.value.toUpperCase();

    if (guess === answer) {
      cell.style.backgroundColor = "#90EE90"; // green
    } else if (guess.length > 0) {
      cell.style.backgroundColor = "#FFB6B6"; // red
    }
  });

  // Check solved clues and hide pictures
  checkSolvedClues();
});

// Check if a clue is solved
function isClueSolved(clue) {
  if (clue.r === undefined || clue.c === undefined) return false;
  if (clue.length === undefined) return false;

  for (let i=0; i<clue.length; i++) {
    let r = clue.r;
    let c = clue.c;
    if (clue.clue.startsWith("Across")) {
      c += i;
    } else {
      r += i;
    }
    const cell = grid.querySelector(`input.cell[data-row='${r}'][data-col='${c}']`);
    if (!cell) return false;
    if (cell.value.toUpperCase() !== puzzle[r][c]) return false;
  }
  return true;
}

// Hide picture clues for solved words
function checkSolvedClues() {
  const picsDiv = document.getElementById("pictureClues");
  if (!picsDiv) return;

  [...picsDiv.children].forEach(img => {
    const clueNum = parseInt(img.dataset.clueNum);
    const clueAcross = cluesAcrossData.find(c => c.num === clueNum);
    const clueDown = cluesDownData.find(c => c.num === clueNum);
    const solvedAcross = clueAcross ? isClueSolved(clueAcross) : false;
    const solvedDown = clueDown ? isClueSolved(clueDown) : false;

    if (solvedAcross || solvedDown) {
      img.style.display = "none";
    } else {
      img.style.display = "";
    }
  });
}
