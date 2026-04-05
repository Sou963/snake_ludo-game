const board = document.getElementById("board");
const players = ["green", "red"];
const playerColors = { green: "#2ecc71", red: "#ff3c3c" };
let turn = 0;
let currentDiceValue = 0;
let canRoll = true;

// Define the standard path around the board (Row, Column)
const outerPath = [
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [7, 5],
  [7, 6],
  [6, 7],
  [5, 7],
  [4, 7],
  [3, 7],
  [2, 7],
  [1, 7],
  [1, 8],
  [1, 9],
  [2, 9],
  [3, 9],
  [4, 9],
  [5, 9],
  [6, 9],
  [7, 10],
  [7, 11],
  [7, 12],
  [7, 13],
  [7, 14],
  [7, 15],
  [8, 15],
  [9, 15],
  [9, 14],
  [9, 13],
  [9, 12],
  [9, 11],
  [9, 10],
  [10, 9],
  [11, 9],
  [12, 9],
  [13, 9],
  [14, 9],
  [15, 9],
  [15, 8],
  [15, 7],
  [14, 7],
  [13, 7],
  [12, 7],
  [11, 7],
  [10, 7],
  [9, 6],
  [9, 5],
  [9, 4],
  [9, 3],
  [9, 2],
  [9, 1],
  [8, 1],
];

// ADJUSTED OFFSETS:
// Green starts at index 1 (cell 7,2)
// Red starts at index 27 (cell 9,14)
const offsets = { green: 1, red: 27 };

// Home stretch paths
const homeStretches = {
  green: [
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 6],
    [8, 7],
  ],
  red: [
    [8, 14],
    [8, 13],
    [8, 12],
    [8, 11],
    [8, 10],
    [8, 9],
  ],
};

/* --- 1. BOARD INITIALIZATION --- */
for (let r = 1; r <= 15; r++) {
  for (let c = 1; c <= 15; c++) {
    if ((r > 6 && r < 10) || (c > 6 && c < 10)) {
      if (r > 6 && r < 10 && c > 6 && c < 10) continue;
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;

      if (r === 8 && c > 1 && c < 7) cell.classList.add("lane-green");
      if (r === 8 && c > 9 && c < 15) cell.classList.add("lane-red");

      const safeCoords = [
        "7-2",
        "2-9",
        "9-14",
        "14-7",
        "1-8",
        "8-15",
        "15-8",
        "8-1",
      ];
      if (safeCoords.includes(`${r}-${c}`)) {
        cell.classList.add("safe-star");
      }
      board.appendChild(cell);
    }
  }
}

/* --- 2. TOKEN INITIALIZATION --- */
let tokens = [];
players.forEach((p) => {
  for (let i = 0; i < 4; i++) {
    const tData = { color: p, id: i, pos: -1, state: "base" };
    tokens.push(tData);
    const tEl = document.createElement("div");
    tEl.className = `token t-${p}`;
    tEl.id = `t-${p}-${i}`;
    tEl.onclick = () => handleTokenClick(tData);
    document.getElementById(`home-${p}`).appendChild(tEl);
  }
});

/* --- 3. DICE LOGIC --- */
function rollDice() {
  if (!canRoll) return;
  canRoll = false;
  const btn = document.getElementById("dice-btn");
  btn.classList.add("rolling");

  setTimeout(() => {
    btn.classList.remove("rolling");
    currentDiceValue = Math.floor(Math.random() * 6) + 1;
    const icons = ["one", "two", "three", "four", "five", "six"];
    document.getElementById("dice-icon").className = `fas fa-dice-${
      icons[currentDiceValue - 1]
    }`;

    const legalMoves = tokens.filter(
      (t) => t.color === players[turn] && canMove(t, currentDiceValue)
    );
    if (legalMoves.length === 0) {
      setTimeout(nextTurn, 800);
    } else {
      legalMoves.forEach((t) =>
        document.getElementById(`t-${t.color}-${t.id}`).classList.add("movable")
      );
    }
  }, 500);
}

function canMove(token, dice) {
  if (token.state === "finished") return false;
  if (token.state === "base" && dice !== 6) return false;
  if (token.pos + dice > 56) return false;
  return true;
}

/* --- 4. MOVEMENT & GAME RULES --- */
function handleTokenClick(token) {
  if (
    token.color !== players[turn] ||
    currentDiceValue === 0 ||
    !canMove(token, currentDiceValue)
  )
    return;
  document
    .querySelectorAll(".token")
    .forEach((t) => t.classList.remove("movable"));

  let earnedExtraTurn = currentDiceValue === 6;

  if (token.state === "base" && currentDiceValue === 6) {
    token.state = "track";
    token.pos = 0; // Starts at index 0 relative to its offset
  } else {
    token.pos += currentDiceValue;
    if (token.pos >= 51 && token.pos < 56) {
      token.state = "homeStretch";
    } else if (token.pos === 56) {
      token.state = "finished";
      earnedExtraTurn = true;
    } else {
      token.state = "track";
      if (checkCapture(token)) earnedExtraTurn = true;
    }
  }

  updateVisual(token);
  if (earnedExtraTurn && token.state !== "finished") {
    resetDice();
  } else {
    nextTurn();
  }
  checkWin();
}

function checkCapture(movingToken) {
  let captured = false;
  const myIdx = (movingToken.pos + offsets[movingToken.color]) % 52;
  const [r, c] = outerPath[myIdx];
  const cellId = `cell-${r}-${c}`;

  if (document.getElementById(cellId).classList.contains("safe-star"))
    return false;

  tokens.forEach((other) => {
    if (other.color !== movingToken.color && other.state === "track") {
      const otherIdx = (other.pos + offsets[other.color]) % 52;
      if (otherIdx === myIdx) {
        other.state = "base";
        other.pos = -1;
        updateVisual(other);
        captured = true;
      }
    }
  });
  return captured;
}

/* --- 5. VISUAL UPDATES --- */
function updateVisual(t) {
  const el = document.getElementById(`t-${t.color}-${t.id}`);
  let target;

  if (t.state === "base") {
    target = document.getElementById(`home-${t.color}`);
  } else if (t.state === "track") {
    const idx = (t.pos + offsets[t.color]) % 52;
    const [r, c] = outerPath[idx];
    target = document.getElementById(`cell-${r}-${c}`);
  } else if (t.state === "homeStretch") {
    const [r, c] = homeStretches[t.color][t.pos - 51];
    target = document.getElementById(`cell-${r}-${c}`);
  } else {
    el.style.display = "none";
  }

  if (target) {
    target.appendChild(el);
    const tokensInCell = target.querySelectorAll(".token");
    const size = tokensInCell.length > 1 ? "45%" : "85%";
    tokensInCell.forEach((token) => {
      token.style.width = size;
      token.style.height = size;
    });
  }
}

/* --- 6. TURN MANAGEMENT --- */
function nextTurn() {
  turn = (turn + 1) % players.length;
  resetDice();
  const activePlayer = players[turn];
  const hex = playerColors[activePlayer];
  const panel = document.getElementById("ui-panel");
  const text = document.getElementById("turn-text");
  const btn = document.getElementById("dice-btn");

  text.innerText = `${activePlayer.toUpperCase()}'S TURN`;
  text.className = `turn-indicator ${activePlayer}-text`;
  panel.className = `ui-panel ${activePlayer}-pos`;
  btn.style.color = hex;
}

function resetDice() {
  currentDiceValue = 0;
  canRoll = true;
}

function checkWin() {
  const p = players[turn];
  const finishedCount = tokens.filter(
    (t) => t.color === p && t.state === "finished"
  ).length;
  if (finishedCount === 4) {
    alert(p.toUpperCase() + " WINS THE MATCH!");
    location.reload();
  }
}
