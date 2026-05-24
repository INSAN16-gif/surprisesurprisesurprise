// ==========================================
// 1. CHOOSE YOUR MAZE MAP LAYOUT
// ==========================================
// 0 = Path (where player can walk)
// 1 = Wall (solid blocks)
// 2 = Start Position (where player drops in)
// 3 = Goal Position (triggers the birthday surprise!)

const mazeLayout = [
    [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 3, 1, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // Cleaned up: exactly 10 items now!
];
// Tracking dimensions dynamically based on our array size
const rows = mazeLayout.length;
const cols = mazeLayout[0].length;

// Tracking player coordinates
let playerPos = { x: 0, y: 0 };

// Get HTML references
const board = document.getElementById('maze-board');
const surpriseScreen = document.getElementById('surprise-screen');
const gameContainer = document.getElementById('game-container');

// ==========================================
// 2. GENERATE THE VISUAL MAZE ON SCREEN
// ==========================================
function buildMaze() {
    // Set grid columns dynamically in CSS via JS styling
    board.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    board.innerHTML = ''; // Clear board out

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Apply specific styles depending on the array matrix value
            if (mazeLayout[r][c] === 1) {
                cell.classList.add('wall');
            } else if (mazeLayout[r][c] === 2) {
                cell.classList.add('player');
                playerPos.y = r; // Set starting row coordinate
                playerPos.x = c; // Set starting column coordinate
            } else if (mazeLayout[r][c] === 3) {
                cell.classList.add('goal');
            }

            // Set a unique ID on each grid element to easily grab it during movement
            cell.id = `cell-${r}-${c}`;
            board.appendChild(cell);
        }
    }
}

// ==========================================
// 3. LOGIC FOR PLAYER MOVEMENT
// ==========================================
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Check boundary constraint: Ensure player stays inside the maze field limits
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        // Prevent walking into solid blocks (value 1)
        if (mazeLayout[newY][newX] !== 1) {
            
            // Remove 'player' visual styling from current location tile
            document.getElementById(`cell-${playerPos.y}-${playerPos.x}`).classList.remove('player');

            // Set new positions
            playerPos.x = newX;
            playerPos.y = newY;

            // Render 'player' visual styling at the new coordinate destination tile
            document.getElementById(`cell-${playerPos.y}-${playerPos.x}`).classList.add('player');

            // Fire verification check to see if target was reached
            checkWinCondition();
        }
    }
}

// ==========================================
// 4. THE BIRTHDAY TRIGGER SURPRISE
// ==========================================
function checkWinCondition() {
    if (mazeLayout[playerPos.y][playerPos.x] === 3) {
        // 1. Wipe away the game interface screen layout
        gameContainer.style.display = 'none';

        // 2. Unveil the birthday module wrapper card
        surpriseScreen.classList.remove('hidden');

        // 3. Instantiate and playback user audio drop file safely
        try {
            const music = new Audio('happy_birthday.mp3');
            music.loop = true; // Loops the music indefinitely
            music.play();
        } catch (error) {
            console.log("Audio playback failed. Click on the screen to trigger manually.", error);
        }
    }
}

// ==========================================
// 5. INTERCEPT KEYBOARD INPUTS
// ==========================================
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    // Map WASD and Arrow Keys to delta changes (X, Y modifications)
    if (key === 'arrowup' || key === 'w') {
        movePlayer(0, -1); // Up: decrease Y index
    } else if (key === 'arrowdown' || key === 's') {
        movePlayer(0, 1);  // Down: increase Y index
    } else if (key === 'arrowleft' || key === 'a') {
        movePlayer(-1, 0); // Left: decrease X index
    } else if (key === 'arrowright' || key === 'd') {
        movePlayer(1, 0);  // Right: increase X index
    }
});

// Run execution script initialization cycle
buildMaze();