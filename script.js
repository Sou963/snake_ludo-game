const diceEl = document.getElementById("dice");
const diceRoom = document.getElementById("diceRoom");
const turnEl = document.getElementById("turn");

const players = [
  { name: "Red", color: "#e74c3c" },
  { name: "Green", color: "#2ecc71" },
  { name: "Yellow", color: "#f1c40f" },
  { name: "Blue", color: "#3498db" }
];

let turn = 0;

// initial room color
diceRoom.style.background = players[turn].color;

function rollDice() {
  const dice = Math.floor(Math.random() * 6) + 1;

  diceEl.innerText = dice;
  diceRoom.style.background = players[turn].color;

  // change turn
  turn = (turn + 1) % players.length;
  turnEl.innerText = players[turn].name;
}
