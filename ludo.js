// --- 1. SETUP THE GRID ---
      // We will generate the 15x15 path cells dynamically to keep HTML clean
      // Coordinates (Row, Col) for standard Ludo path
      const board = document.getElementById("board");

      // Mapping logical path index (0-51) to Grid coordinates (row, col)
      // Starting from Red Start (index 0) going clockwise
      const pathMap = [
        // Red Path (Bottom-Left going Right) -> UP
        [14, 2],
        [14, 3],
        [14, 4],
        [14, 5],
        [14, 6],
        [13, 7],
        // Up Blue Path
        [12, 7],
        [11, 7],
        [10, 7],
        [9, 7],
        [8, 7],
        [7, 6],
        // Left Top (Green side)
        [7, 5],
        [7, 4],
        [7, 3],
        [7, 2],
        [7, 1],
        [6, 2],
        // Top Green Path
        [6, 3],
        [6, 4],
        [6, 5],
        [6, 6],
        [5, 7],
        [4, 7],
        [3, 7],
        [2, 7],
        [1, 7],
        [2, 8],
        [1, 9],
        [2, 9], // Top Turn
        [3, 9],
        [4, 9],
        [5, 9],
        [6, 9],
        [6, 10],
        [6, 11],
        [6, 12],
        [6, 13],
        [6, 14],
        [6, 15],
        [7, 15],
        [8, 14], // Right Yellow side
        [8, 13],
        [8, 12],
        [8, 11],
        [8, 10],
        [8, 9],
        [9, 9],
        [10, 9],
        [11, 9],
        [12, 9],
        [13, 9],
        [14, 9],
        [15, 8], // Bottom Yellow path
        [14, 8], // ... logic simplified below for pure visual grid generation
      ];

      // Let's generate the visual grid cells first (Areas that are not Homes or Center)
      // A standard ludo board has specific cells.

      const safeSpots = ["7-2", "2-9", "9-14", "14-7"]; // r-c format
      const startSpots = ["14-2", "2-7", "2-14", "7-2"]; // This varies by region, using standard

      function createCell(r, c) {
        const div = document.createElement("div");
        div.className = "step";
        div.style.gridRow = r;
        div.style.gridColumn = c;
        div.id = `cell-${r}-${c}`;

        // Star/Safe logic
        if (
          (r == 7 && c == 2) ||
          (r == 2 && c == 9) ||
          (r == 9 && c == 14) ||
          (r == 14 && c == 7)
        ) {
          div.classList.add("safe", "star");
        }

        // Colored Paths (Home Stretch)
        if (r == 8 && c > 1 && c < 7) div.classList.add("bg-red"); // Red Stretch
        if (c == 8 && r > 1 && r < 7) div.classList.add("bg-green"); // Green Stretch
        if (r == 8 && c > 9 && c < 15) div.classList.add("bg-yellow"); // Yellow Stretch
        if (c == 8 && r > 9 && r < 15) div.classList.add("bg-blue"); // Blue Stretch (Standard Ludo varies, using blue bottom)

        // Colored Start Spots
        if (r == 7 && c == 2) div.classList.add("bg-red");
        if (r == 2 && c == 9) div.classList.add("bg-green");
        if (r == 9 && c == 14) div.classList.add("bg-yellow");
        if (r == 14 && c == 7) div.classList.add("bg-blue");

        board.appendChild(div);
      }

      // Generate Path Cells (skipping Home 6x6 areas and Center 3x3)
      for (let r = 1; r <= 15; r++) {
        for (let c = 1; c <= 15; c++) {
          // Exclude Corners (Homes)
          if (r <= 6 && c <= 6) continue; // Top Left
          if (r <= 6 && c >= 10) continue; // Top Right
          if (r >= 10 && c <= 6) continue; // Bottom Left
          if (r >= 10 && c >= 10) continue; // Bottom Right
          if (r >= 7 && r <= 9 && c >= 7 && c <= 9) continue; // Center

          createCell(r, c);
        }
      }

      // --- 2. GAME LOGIC ---

      // Path Definitions (Series of Grid Coordinates [Row, Col])
      // Standard Ludo Path Logic
      const mainPath = [
        // Starts from Red Start (14, 7) -> changed to standard layout logic
        // Let's define the outer loop (52 steps)
        // Bottom (Blue) side
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
        [7, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [7, 6], // Left (Red) side
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
        [6, 9], // Top (Green) side
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
        [9, 10], // Right (Yellow) side
        [10, 9],
        [11, 9],
        [12, 9],
        [13, 9],
        [14, 9],
        [15, 9],
        [15, 8],
        [15, 7], // Back to start area
      ];

      // Note: The visual grid generation above used Red-Left style,
      // but the `mainPath` coordinate array defines the actual movement.
      // We need to map visual coordinates carefully.

      // Hardcoding a simple path for demo purposes (Clockwise Outer Loop)
      // Blue Start: 14,7. Red Start: 7,2. Green Start: 2,9. Yellow Start: 9,14.

      const globalPath = [
        // Blue Start Area (Bottom)
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
        [9, 1], // Left
        [8, 1],
        [7, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [7, 6], // Red Start @ 7,2
        [6, 7],
        [5, 7],
        [4, 7],
        [3, 7],
        [2, 7],
        [1, 7], // Top
        [1, 8],
        [1, 9],
        [2, 9],
        [3, 9],
        [4, 9],
        [5, 9],
        [6, 9], // Green Start @ 2,9
        [7, 10],
        [7, 11],
        [7, 12],
        [7, 13],
        [7, 14],
        [7, 15], // Right
        [8, 15],
        [9, 15],
        [9, 14],
        [9, 13],
        [9, 12],
        [9, 11],
        [9, 10], // Yellow Start @ 9,14
        [10, 9],
        [11, 9],
        [12, 9],
        [13, 9],
        [14, 9],
        [15, 9], // Bottom
        [15, 8],
      ];

      // Define indices in globalPath where players start
      const startIndices = { blue: 0, red: 13, green: 26, yellow: 39 };

      const players = ["blue", "red", "green", "yellow"];
      let turn = 0;

      // Token State: { color: 'red', id: 0, pos: -1 (home), pathIndex: 0 }
      // 4 tokens per player
      let tokens = [];
      players.forEach((p) => {
        for (let i = 0; i < 4; i++) {
          tokens.push({ color: p, id: i, pos: -1, steps: 0 });
          // Create Visual Token
          const t = document.createElement("div");
          t.className = `token token-${p}`;
          t.id = `t-${p}-${i}`;
          document.getElementById(`home-${p}`).appendChild(t);
        }
      });

      function rollDice() {
        const diceIcon = document.getElementById("dice-icon");
        const container = document.querySelector(".dice-container");

        // Animation
        diceIcon.classList.add("dice-roll-anim");
        setTimeout(() => diceIcon.classList.remove("dice-roll-anim"), 500);

        const val = Math.floor(Math.random() * 6) + 1;

        // Update Icon
        const words = ["one", "two", "three", "four", "five", "six"];
        setTimeout(() => {
          diceIcon.className = `fas fa-dice-${words[val - 1]} dice`;
          handleMove(val);
        }, 500);
      }

      function handleMove(diceVal) {
        const currentPlayer = players[turn];
        const pTokens = tokens.filter((t) => t.color === currentPlayer);

        // Simple Logic: Move first available token
        // 1. If 6, can move out of home.
        // 2. Else, move token on board.

        let moved = false;

        // Priority 1: Move out of home if 6
        if (diceVal === 6) {
          const homeToken = pTokens.find((t) => t.pos === -1);
          if (homeToken) {
            homeToken.pos = startIndices[currentPlayer];
            homeToken.steps = 0;
            updateTokenPosition(homeToken);
            moved = true;
            // Note: In real ludo, you get another turn. Skipping for simplicity.
          }
        }

        // Priority 2: Move token on board
        if (!moved) {
          const activeToken = pTokens.find(
            (t) => t.pos !== -1 && t.steps + diceVal < 57
          ); // 57 approx finish
          if (activeToken) {
            activeToken.steps += diceVal;
            activeToken.pos = (activeToken.pos + diceVal) % globalPath.length;
            updateTokenPosition(activeToken);
            moved = true;
          }
        }

        // Next turn
        if (!moved && diceVal !== 6) {
          // No moves possible
        }

        turn = (turn + 1) % 4;
        updateUI();
      }

      function updateTokenPosition(token) {
        const el = document.getElementById(`t-${token.color}-${token.id}`);
        const coords = globalPath[token.pos];

        // If valid coord
        if (coords) {
          const cell = document.getElementById(
            `cell-${coords[0]}-${coords[1]}`
          );
          if (cell) cell.appendChild(el);
        }
      }

      function updateUI() {
        const turnTxt = document.getElementById("turn-text");
        turnTxt.innerText = `Current Turn: ${players[turn].toUpperCase()}`;
        turnTxt.style.color = `var(--${players[turn]})`;
        turnTxt.style.borderColor = `var(--${players[turn]})`;
      }

      updateUI();