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
  ["J","E","S","U","S","C","H","R","I","S","T","#","#","E","#","#","#","U","#","#","#"],
  ["#","#","#","N","#","R","#","#","P","#","#","#","E","G","G","H","U","N","T","#","#"],
  ["#","#","#","N","#","O","#","#","#","#","#","#","#","G","#","#","#","#","#","#","#"],
  ["#","#","#","Y","#","S","#","#","#","#","#","#","#","S","#","#","#","#","#","#","#"],
  ["#","#","#","#","#","S","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"]
];

// PICTURE CLUES BY CLUE NUMBER
const pictureClues = {
  1: "images/hotcrossbun.jpg",
  2: "images/daffodil.jpg",
  3: "images/lamb.jpg",
  4: "images/chick.jpg",
  5: "images/church.jpg",
  6: "images/basket.jpg",
  7: "images/painteggs.jpg",
  8: "images/tulip.jpg",
  9: "images/spring.jpg",
  10: "images/bunny.jpg",
  11: "images/easter.jpg",
  12: "images/jesuschrist.jpg",
  13: "images/cross.jpg",
  14: "images/egghunt.jpg"
};

// DOM ELEMENTS
const grid = document.getElementById("grid");
const acrossPicsDiv = document.getElementById("pictureCluesAcross");
const downPicsDiv = document.getElementById("pictureCluesDown");
const checkButton = document.getElementById("checkButton");

grid.style.gridTemplateColumns = `repeat(${puzzle[0].length}, 40px)`;

// UTILITY
function isWhiteCell(r,c) {
  return r>=0 && r<puzzle.length && c>=0 && c<puzzle[0].length && puzzle[r][c]!=='#';
}
function isStartAcross(r,c) {
  return isWhiteCell(r,c) && !isWhiteCell(r,c-1) && isWhiteCell(r,c+1);
}
function isStartDown(r,c) {
  return isWhiteCell(r,c) && !isWhiteCell(r-1,c) && isWhiteCell(r+1,c);
}

// NUMBERING GRID
const numbering = [];
let clueNumber = 1;
for(let r=0;r<puzzle.length;r++){
  for(let c=0;c<puzzle[0].length;c++){
    if(puzzle[r][c]==='#'){ numbering.push(null); continue; }
    if(isStartAcross(r,c) || isStartDown(r,c)) numbering.push(clueNumber++);
    else numbering.push(null);
  }
}

// GLOBAL
let currentWord = null;

// BUILD GRID
for(let r=0;r<puzzle.length;r++){
  for(let c=0;c<puzzle[0].length;c++){
    if(puzzle[r][c]==='#'){ const block=document.createElement("div"); block.classList.add("block"); grid.appendChild(block); continue; }

    const inputWrapper = document.createElement("div");
    inputWrapper.style.position="relative";

    const input = document.createElement("input");
    input.classList.add("cell");
    input.maxLength=1;
    input.dataset.row=r;
    input.dataset.col=c;
    inputWrapper.appendChild(input);

    const idx = r*puzzle[0].length+c;
    const num = numbering[idx];
    if(num!==null){
      const numberDiv = document.createElement("div");
      numberDiv.classList.add("clue-number");
      numberDiv.textContent=num;
      numberDiv.style.fontSize="14px";
      inputWrapper.appendChild(numberDiv);
    }

    grid.appendChild(inputWrapper);

    // TYPING
    input.addEventListener("input",()=>{ 
      input.value=input.value.toUpperCase(); 
      moveFocus(input); 
      highlightWord();
    });

    // FOCUS
    input.addEventListener("focus", ()=>{
      const r=parseInt(input.dataset.row);
      const c=parseInt(input.dataset.col);

      let startR = r;
      let startC = c;
      let dir = null;

      let tempC = c;
      while(isWhiteCell(r,tempC-1)) tempC--;
      if(isWhiteCell(r,tempC+1)) { startC = tempC; dir="across"; }

      let tempR = r;
      while(isWhiteCell(tempR-1,c)) tempR--;
      if(isWhiteCell(tempR+1,c)) { startR = tempR; startC=c; dir="down"; }

      if(dir) currentWord = {row:startR, col:startC, direction:dir};
      highlightWord();
    });
  }
}

// PICTURE CLUES
function showPictureClues(){
  acrossPicsDiv.innerHTML="";
  downPicsDiv.innerHTML="";

  numbering.forEach((num,idx)=>{
    if(!num || !pictureClues[num]) return;
    const r = Math.floor(idx/puzzle[0].length);
    const c = idx%puzzle[0].length;

    if(isStartAcross(r,c)){
      const img=document.createElement("img");
      img.src=pictureClues[num];
      img.dataset.num=num;
      img.dataset.direction="across";
      img.addEventListener("click",()=>focusClue(r,c,img.dataset.direction));
      acrossPicsDiv.appendChild(img);
    }

    if(isStartDown(r,c)){
      const img=document.createElement("img");
      img.src=pictureClues[num];
      img.dataset.num=num;
      img.dataset.direction="down";
      img.addEventListener("click",()=>focusClue(r,c,img.dataset.direction));
      downPicsDiv.appendChild(img);
    }
  });
}
showPictureClues();

// FOCUS WORD
function focusClue(r,c,dir){
  currentWord={row:r,col:c,direction:dir};
  highlightWord();
  const cell = grid.querySelector(`input.cell[data-row='${r}'][data-col='${c}']`);
  if(cell) cell.focus();
}

// MOVE FOCUS (intersection-safe, skips filled)
function moveFocus(currentInput){
  if(!currentWord) return;
  const {row:startR, col:startC, direction:dir} = currentWord;

  const wordCells = [];
  if(dir==="across"){
    let i=0;
    while(isWhiteCell(startR,startC+i)){
      const cell = grid.querySelector(`input.cell[data-row='${startR}'][data-col='${startC+i}']`);
      if(cell) wordCells.push(cell);
      i++;
    }
  } else {
    let i=0;
    while(isWhiteCell(startR+i,startC)){
      const cell = grid.querySelector(`input.cell[data-row='${startR+i}'][data-col='${startC}']`);
      if(cell) wordCells.push(cell);
      i++;
    }
  }

  const idx = wordCells.indexOf(currentInput);
  if(idx === -1) return;

  // Skip filled letters
  for(let next=idx+1; next<wordCells.length; next++){
    if(wordCells[next].value===""){
      wordCells[next].focus();
      return;
    }
  }
  // Stay on last cell
  currentInput.focus();
}

// HIGHLIGHT WORD
function highlightWord(){
  document.querySelectorAll(".cell").forEach(cell=>{
    cell.classList.remove("active-word");
  });
  if(!currentWord) return;

  const {row:r, col:c, direction:dir} = currentWord;
  const cellsToHighlight = [];
  if(dir==="across"){
    let i=0; while(isWhiteCell(r,c+i)){
      const cell=grid.querySelector(`input.cell[data-row='${r}'][data-col='${c+i}']`);
      if(cell) cellsToHighlight.push(cell);
      i++;
    }
  } else {
    let i=0; while(isWhiteCell(r+i,c)){
      const cell=grid.querySelector(`input.cell[data-row='${r+i}'][data-col='${c}']`);
      if(cell) cellsToHighlight.push(cell);
      i++;
    }
  }
  cellsToHighlight.forEach(cell=>cell.classList.add("active-word"));
}

// CHECK BUTTON
checkButton.addEventListener("click",()=>{
  const cells=document.querySelectorAll(".cell");

  cells.forEach(cell=>{
    const r=parseInt(cell.dataset.row);
    const c=parseInt(cell.dataset.col);
    const answer=puzzle[r][c];
    const guess=cell.value.toUpperCase();
    if(guess===answer) cell.style.backgroundColor="#90EE90";
    else if(guess.length>0) cell.style.backgroundColor="#FFB6B6";
    else cell.style.backgroundColor="";
  });

  // Hide solved picture clues
  [...document.querySelectorAll("#pictureCluesAcross img,#pictureCluesDown img")].forEach(img=>{
    const num=parseInt(img.dataset.num);
    const idx=numbering.indexOf(num);
    const r=Math.floor(idx/puzzle[0].length);
    const c=idx%puzzle[0].length;

    let solved=true;

    if(isStartAcross(r,c)){
      let i=0; while(isWhiteCell(r,c+i)){
        const cell=grid.querySelector(`input.cell[data-row='${r}'][data-col='${c+i}']`);
        if(!cell || cell.value.toUpperCase()!==puzzle[r][c+i]) solved=false;
        i++;
      }
    }

    if(isStartDown(r,c)){
      let i=0; while(isWhiteCell(r+i,c)){
        const cell=grid.querySelector(`input.cell[data-row='${r+i}'][data-col='${c}']`);
        if(!cell || cell.value.toUpperCase()!==puzzle[r+i][c]) solved=false;
        i++;
      }
    }

    if(solved) img.style.display="none";
  });
});
