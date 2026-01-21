// Same logic as before, ensuring it works with the new layout
const snakes = {
  98: 28,
  95: 56,
  92: 51,
  83: 19,
  73: 1,
  69: 33,
  64: 36,
  59: 17,
  55: 7,
  52: 11,
  48: 9,
  46: 5,
  44: 22,
};
const ladders = {
  8: 26,
  21: 82,
  43: 77,
  50: 91,
  54: 93,
  62: 96,
  66: 87,
  80: 100,
};

const gridEl = document.getElementById("grid");
const svgEl = document.getElementById("svg-layer");

function initGrid() {
  gridEl.innerHTML = "";
  for (let i = 0; i < 100; i++) {
    const rowFromTop = Math.floor(i / 10);
    const rowFromBottom = 9 - rowFromTop;
    const colFromLeft = i % 10;
    let number =
      rowFromBottom % 2 === 0
        ? rowFromBottom * 10 + colFromLeft + 1
        : rowFromBottom * 10 + (10 - colFromLeft);

    const cell = document.createElement("div");
    cell.className = "cell";
    if (number === 1) cell.classList.add("start");
    if (number === 100) cell.classList.add("finish");
    cell.id = `c-${number}`;
    cell.innerText = number;
    gridEl.appendChild(cell);
  }
}

function getCenter(num) {
  const cell = document.getElementById(`c-${num}`);
  const rect = cell.getBoundingClientRect();
  const wrapper = document
    .querySelector(".board-wrapper")
    .getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - wrapper.left,
    y: rect.top + rect.height / 2 - wrapper.top,
    w: rect.width,
  };
}

function drawGraphics() {
  svgEl.innerHTML = "";
  for (let [start, end] of Object.entries(ladders)) {
    const p1 = getCenter(start);
    const p2 = getCenter(end);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = Math.atan2(dy, dx);
    const offsetX = p1.w * 0.2 * Math.sin(angle);
    const offsetY = p1.w * 0.2 * Math.cos(angle);
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const l1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l1.setAttribute("x1", p1.x - offsetX);
    l1.setAttribute("y1", p1.y + offsetY);
    l1.setAttribute("x2", p2.x - offsetX);
    l1.setAttribute("y2", p2.y + offsetY);
    l1.setAttribute("class", "ladder-rail");
    const l2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l2.setAttribute("x1", p1.x + offsetX);
    l2.setAttribute("y1", p1.y - offsetY);
    l2.setAttribute("x2", p2.x + offsetX);
    l2.setAttribute("y2", p2.y - offsetY);
    l2.setAttribute("class", "ladder-rail");
    g.appendChild(l1);
    g.appendChild(l2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(dist / (p1.w * 0.4));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const rung = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      rung.setAttribute("x1", p1.x + dx * t - offsetX);
      rung.setAttribute("y1", p1.y + dy * t + offsetY);
      rung.setAttribute("x2", p1.x + dx * t + offsetX);
      rung.setAttribute("y2", p1.y + dy * t - offsetY);
      rung.setAttribute("class", "ladder-rung");
      g.appendChild(rung);
    }
    svgEl.appendChild(g);
  }
  for (let [start, end] of Object.entries(snakes)) {
    const pHead = getCenter(start);
    const pTail = getCenter(end);
    const cpX = (pHead.x + pTail.x) / 2 + (Math.random() > 0.5 ? 40 : -40);
    const cpY = (pHead.y + pTail.y) / 2;
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M ${pHead.x} ${pHead.y} Q ${cpX} ${cpY} ${pTail.x} ${pTail.y}`
    );
    path.setAttribute("class", "snake-body");
    const head = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    head.setAttribute("cx", pHead.x);
    head.setAttribute("cy", pHead.y);
    head.setAttribute("r", pHead.w * 0.3);
    head.setAttribute("class", "snake-head");
    g.appendChild(path);
    g.appendChild(head);
    svgEl.appendChild(g);
  }
}

let positions = { p1: 1, p2: 1 };
let turn = "p1";
let isMoving = false;

function updateToken(player) {
  const el = document.getElementById(player);
  const center = getCenter(positions[player]);
  el.style.left = center.x - el.offsetWidth / 2 + "px";
  el.style.top = center.y - el.offsetHeight / 2 + "px";
}

function rollDice() {
  if (isMoving) return;
  isMoving = true;
  const btn = document.getElementById("dice-icon");
  btn.className = "fas fa-dice fa-spin";
  setTimeout(() => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const icons = ["one", "two", "three", "four", "five", "six"];
    btn.className = `fas fa-dice-${icons[roll - 1]}`;
    movePlayer(roll);
  }, 600);
}

function movePlayer(steps) {
  let next = positions[turn] + steps;
  if (next > 100) {
    isMoving = false;
    switchTurn();
    return;
  }
  positions[turn] = next;
  updateToken(turn);
  setTimeout(() => {
    if (snakes[next]) positions[turn] = snakes[next];
    else if (ladders[next]) positions[turn] = ladders[next];
    updateToken(turn);
    if (positions[turn] === 100) {
      alert(turn.toUpperCase() + " WINS!");
      location.reload();
    } else {
      if (steps !== 6) switchTurn();
      isMoving = false;
    }
  }, 600);
}

function switchTurn() {
  turn = turn === "p1" ? "p2" : "p1";
  document.getElementById("badge-p1").classList.toggle("active");
  document.getElementById("badge-p2").classList.toggle("active");
}

initGrid();
window.onload = () => {
  drawGraphics();
  updateToken("p1");
  updateToken("p2");
};
window.onresize = () => {
  drawGraphics();
  updateToken("p1");
  updateToken("p2");
};
