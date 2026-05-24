// ==========================================
// 1. INITIAL MAZE CONFIGURATION (10x10 Grid)
// ==========================================
// 0 = Path, 1 = Wall, 2 = Player Starting Point, 3 = Goal (Birthday Trigger)
const mazeLayout = [
    [2, 1, 0, 0, 0, 1, 1, 1, 1, 3],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Cleaned up: Exactly 10 items
];

// Tracking dimensions dynamically based on our array size
const rows = mazeLayout.length;
const cols = mazeLayout[0].length;

// Tracking player coordinates
let playerPos = { x: 0, y: 0 };

// DOM Elements
const board = document.getElementById('maze-board');
const gameContainer = document.getElementById('game-container');
const surpriseScreen = document.getElementById('surprise-screen');

// ==========================================
// 2. BUILD AND RENDER THE MAZE
// ==========================================
function buildMaze() {
    // Sets up responsive columns using CSS fractions (1fr) instead of fixed pixels
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.innerHTML = ''; 

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Apply correct styling classes based on array values
            if (mazeLayout[r][c] === 1) {
                cell.classList.add('wall');
            } else if (mazeLayout[r][c] === 2) {
                cell.classList.add('player');
                playerPos.x = c;
                playerPos.y = r;
            } else if (mazeLayout[r][c] === 3) {
                cell.classList.add('goal');
            } else {
                cell.classList.add('path');
            }

            // Assign an ID to easily track and redraw the player cell later
            cell.id = `cell-${r}-${c}`;
            board.appendChild(cell);
        }
    }
}

// ==========================================
// 3. PLAYER CORE MOVEMENT LOGIC
// ==========================================
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Check boundaries and make sure the target cell isn't a wall (1)
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        if (mazeLayout[newY][newX] !== 1) {
            
            // Remove the player visual class from the old tile
            const oldCell = document.getElementById(`cell-${playerPos.y}-${playerPos.x}`);
            if (oldCell) oldCell.classList.remove('player');

            // Update the tracker tracking variables
            playerPos.x = newX;
            playerPos.y = newY;

            // Render the player visual class on the new tile
            const newCell = document.getElementById(`cell-${playerPos.y}-${playerPos.x}`);
            if (newCell) newCell.classList.add('player');

            // Instantly check if they stepped on the goal block (3)
            checkWinCondition();
        }
    }
}

// ==========================================
// 4. WIN CONDITION & SURPRISE TRIGGER
// ==========================================
function checkWinCondition() {
    if (mazeLayout[playerPos.y][playerPos.x] === 3) {
        // 1. Instantly swap the interfaces before loading heavy media assets
        surpriseScreen.classList.remove('hidden');
        gameContainer.style.display = 'none';

        // 2. Safe Audio Context Handling to prevent browser script crashes
        const music = new Audio('happy_birthday.mp3');
        music.loop = true;
        
        music.play().catch(error => {
            console.log("Audio waiting for explicit interaction tap...", error);
            
            // Mobile Fallback: If chrome blocks it, start playing on the next screen tap
            window.addEventListener('click', () => {
                music.play();
            }, { once: true });
        });
    }
}

// ==========================================
// 5. DESKTOP KEYBOARD LISTENERS
// ==========================================
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    
    if (key === 'arrowup' || key === 'w') movePlayer(0, -1);
    if (key === 'arrowdown' || key === 's') movePlayer(0, 1);
    if (key === 'arrowleft' || key === 'a') movePlayer(-1, 0);
    if (key === 'arrowright' || key === 'd') movePlayer(1, 0);
});

// ==========================================
// 6. MOBILE ANDROID CONTROLLER D-PAD LISTENERS
// ==========================================
document.getElementById('btn-up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('btn-down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('btn-left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('btn-right').addEventListener('click', () => movePlayer(1, 0));

// ==========================================
// 7. RUN INITIALIZATION ON LOAD
// ==========================================
buildMaze();