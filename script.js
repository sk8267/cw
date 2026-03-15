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

// PICTURE CLUES BY CLUE NUMBER
const pictureClues = {
  1: "https://i.imgur.com/3hVvYqM.png",
  2: "https://i.imgur.com/tYuKcwZ.png",
  3: "https://i.imgur.com/6Q9qHls.png",
  4: "https://i.imgur.com/vDLtBd5.png",
  5: "https://i.imgur.com/ei82TBl.png"
};

// DOM ELEMENTS
const grid = document.getElementById("grid");
const acrossPicsDiv = document.getElementById("pictureCluesAcross");
const downPicsDiv = document.getElementById("pictureCluesDown");
const checkButton = document.getElementById("checkButton");

// GRID SETUP
grid.style.gridTemplateColumns = `repeat(${puzzle[0].length}, 40px)`;

function isWhiteCell(r, c) {
  return r >= 0 && r < puzzle.length &&
         c >= 0 && c < puzzle[0].length &&
         puzzle[r][c] !== '#';
}

function isStartAcross(r, c) {
  if (!isWhiteCell(r, c)) return false;
  return !isWhiteCell(r, c-1) && isWhiteCell(r, c+1);
}

function isStartDown(r, c) {
  if (!isWhiteCell(r, c)) return false;
  return !isWhiteCell(r-1, c) && isWhiteCell(r+1, c);
}

// Numbering grid
const numbering = [];
let clueNumber = 1;
for (let r=0; r<puzzle.length; r++) {
  for (let c=0; c<puzzle[0].length; c++) {
    if (puzzle[r][c] === '#') {
      numbering.push(null);
      continue;
    }
    if (isStartAcross(r,c) || isStartDown(r,c)) numbering.push(clueNumber++);
    else numbering.push(null);
  }
}

// Build grid
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
      numberDiv.textContent = num;  // visible number
      numberDiv.style.fontSize = "14px"; 
      inputWrapper.appendChild(numberDiv);
    }
    grid.appendChild(inputWrapper);

    input.addEventListener("input", () => {
      input.value = input.value.toUpperCase();
      moveFocus(input, "forward");
    });
  }
}

// GENERATE PICTURE CLUES
function showPictureClues() {
  acrossPicsDiv.innerHTML = "";
  downPicsDiv.innerHTML = "";

  numbering.forEach((num, idx) => {
    if (!num || !pictureClues[num]) return;

    const r = Math.floor(idx / puzzle[0].length);
    const c = idx % puzzle[0].length;

    if (isStartAcross(r,c)) {
      const img = document.createElement("img");
      img.src = pictureClues[num];
      img.dataset.num = num;
      img.addEventListener("click", () => focusClue(r,c));
      acrossPicsDiv.appendChild(img);
    }

    if (isStartDown(r,c)) {
      const img = document.createElement("img");
      img.src = pictureClues[num];
      img.dataset.num = num;
      img.addEventListener("click", () => focusClue(r,c));
      downPicsDiv.appendChild(img);
    }
  });
}

showPictureClues();

// FOCUS FIRST CELL OF CLUE WHEN IMAGE CLICKED
function focusClue(r, c) {
  const cell = grid.querySelector(`input.cell[data-row='${r}'][data-col='${c}']`);
  if (cell) cell.focus();
}

// CHECK ANSWERS AND HIDE SOLVED PICTURE CLUES
checkButton.addEventListener("click", () => {
  const cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const answer = puzzle[r][c];
    const guess = cell.value.toUpperCase();

    if (guess === answer) cell.style.backgroundColor = "#90EE90";
    else if (guess.length > 0) cell.style.backgroundColor = "#FFB6B6";
    else cell.style.backgroundColor = "";
  });

  // Hide solved picture clues
  [...document.querySelectorAll("#pictureCluesAcross img, #pictureCluesDown img")].forEach(img => {
    const num = parseInt(img.dataset.num);
    const idx = numbering.indexOf(num);
    const r = Math.floor(idx / puzzle[0].length);
    const c = idx % puzzle[0].length;

    let solved = true;
    if (isStartAcross(r,c)) {
      let i = 0;
      while (isWhiteCell(r,c+i)) {
        const cell = grid.querySelector(`input.cell[data-row='${r}'][data-col='${c+i}']`);
        if (!cell || cell.value.toUpperCase() !== puzzle[r][c+i]) solved = false;
        i++;
      }
    }
    if (isStartDown(r,c)) {
      let i = 0;
      while (isWhiteCell(r+i,c)) {
        const cell = grid.querySelector(`input.cell[data-row='${r+i}'][data-col='${c}']`);
        if (!cell || cell.value.toUpperCase() !== puzzle[r+i][c]) solved = false;
        i++;
      }
    }

    if (solved) img.style.display = "none";
  });
});

// SIMPLE AUTO-MOVE FUNCTION
function moveFocus(currentInput, direction) {
  const r = parseInt(currentInput.dataset.row);
  const c = parseInt(currentInput.dataset.col);
  const maxR = puzzle.length-1;
  const maxC = puzzle[0].length-1;
  let newR=r, newC=c;

  if(direction==="forward"||direction==="right") { do { if(newC<maxC) newC++; else if(newR<maxR){newC=0;newR++;} else return; } while(!isWhiteCell(newR,newC)); }
  const nextInput = grid.querySelector(`input.cell[data-row='${newR}'][data-col='${newC}']`);
  if(nextInput) nextInput.focus();
}
