// Butter Maze Game Module
(function() {
    let canvas, ctx;
    let grid = [];
    let cols = 10;
    let rows = 10;
    let cellSize = 48; // will be dynamically adjusted

    // Level configuration
    let currentLevel = 1;
    let maxLevel = 3;
    let butterCollected = 0;
    let butterTarget = 0;
    let totalMazeScore = 0;

    // Entity Positions
    let krishna = { x: 0, y: 0 };
    let butterPot = { x: 9, y: 9 };
    let butterBalls = [];
    let obstacles = []; // Gopis or Monkeys

    // Levels definitions (0 = path, 1 = wall, 2 = butter, 3 = obstacle)
    const levelMaps = {
        1: {
            cols: 8,
            rows: 8,
            grid: [
                [0, 1, 0, 0, 0, 0, 1, 0],
                [0, 1, 0, 1, 1, 0, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0],
                [1, 1, 1, 0, 1, 1, 1, 0],
                [0, 0, 0, 2, 0, 0, 1, 0],
                [0, 1, 1, 1, 1, 0, 1, 0],
                [0, 2, 0, 0, 1, 0, 0, 0],
                [1, 1, 1, 0, 0, 0, 1, 0]
            ],
            krishna: { x: 0, y: 0 },
            butterPot: { x: 7, y: 7 },
            butterBalls: [
                { x: 3, y: 4 },
                { x: 1, y: 6 },
                { x: 5, y: 2 },
                { x: 7, y: 0 }
            ],
            obstacles: []
        },
        2: {
            cols: 10,
            rows: 10,
            grid: [
                [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                [1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
                [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                [0, 1, 1, 1, 1, 0, 1, 0, 0, 0],
                [0, 0, 2, 0, 0, 0, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 0, 0, 2, 1, 0],
                [0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
                [0, 1, 1, 0, 0, 0, 1, 0, 0, 0],
                [0, 2, 1, 1, 1, 0, 1, 1, 1, 0],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            krishna: { x: 0, y: 0 },
            butterPot: { x: 9, y: 9 },
            butterBalls: [
                { x: 2, y: 4 },
                { x: 7, y: 5 },
                { x: 1, y: 8 },
                { x: 5, y: 0 },
                { x: 9, y: 3 }
            ],
            obstacles: [
                { x: 3, y: 0, dir: 1, type: 'monkey' },
                { x: 7, y: 8, dir: 1, type: 'gopi' }
            ]
        },
        3: {
            cols: 12,
            rows: 12,
            grid: [
                [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
                [0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
                [0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
                [0, 0, 0, 2, 1, 0, 0, 0, 1, 0, 0, 0],
                [0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
                [0, 1, 2, 0, 0, 0, 0, 0, 1, 0, 2, 0],
                [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0]
            ],
            krishna: { x: 0, y: 0 },
            butterPot: { x: 11, y: 11 },
            butterBalls: [
                { x: 6, y: 2 },
                { x: 1, y: 4 },
                { x: 3, y: 6 },
                { x: 2, y: 8 },
                { x: 10, y: 8 }
            ],
            obstacles: [
                { x: 4, y: 0, dir: 1, type: 'monkey' },
                { x: 9, y: 4, dir: -1, type: 'gopi' },
                { x: 7, y: 10, dir: 1, type: 'monkey' }
            ]
        }
    };

    let animationId = null;

    function initMazeGame() {
        canvas = document.getElementById('maze-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        
        loadLevel(currentLevel);
        
        setupInputHandlers();
        
        // Start game loop
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        gameLoop();
    }

    function loadLevel(levelNum) {
        const map = levelMaps[levelNum];
        cols = map.cols;
        rows = map.rows;
        cellSize = canvas.width / cols;

        // Deep copy grid
        grid = map.grid.map(row => [...row]);
        
        // Copy entities
        krishna = { ...map.krishna };
        butterPot = { ...map.butterPot };
        
        // Deep copy butter balls
        butterBalls = map.butterBalls.map(ball => ({ ...ball, active: true }));
        butterCollected = 0;
        butterTarget = butterBalls.length;

        // Deep copy obstacles and reset behavior
        obstacles = map.obstacles.map(obs => ({
            ...obs,
            tick: 0,
            startX: obs.x,
            startY: obs.y
        }));

        updateStats();
    }

    function updateStats() {
        document.getElementById('maze-level').textContent = currentLevel;
        document.getElementById('maze-butter-collected').textContent = butterCollected;
        document.getElementById('maze-score').textContent = totalMazeScore;
    }

    function setupInputHandlers() {
        // Remove existing listeners if any
        window.removeEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleKeyDown);

        // On-screen D-pad controls
        const dpadUp = document.getElementById('dpad-up');
        const dpadDown = document.getElementById('dpad-down');
        const dpadLeft = document.getElementById('dpad-left');
        const dpadRight = document.getElementById('dpad-right');
        const restartBtn = document.getElementById('restart-maze-btn');

        if (dpadUp) {
            dpadUp.onclick = () => moveKrishna(0, -1);
            dpadDown.onclick = () => moveKrishna(0, 1);
            dpadLeft.onclick = () => moveKrishna(-1, 0);
            dpadRight.onclick = () => moveKrishna(1, 0);
        }

        if (restartBtn) {
            restartBtn.onclick = () => {
                window.playSynthSound('tap');
                loadLevel(currentLevel);
            };
        }
    }

    function handleKeyDown(e) {
        // Prevent default scrolling for arrows
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }

        if (window.state.activeTab !== 'maze') return;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                moveKrishna(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                moveKrishna(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                moveKrishna(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                moveKrishna(1, 0);
                break;
        }
    }

    function moveKrishna(dx, dy) {
        let newX = krishna.x + dx;
        let newY = krishna.y + dy;

        // Bound checks
        if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) return;

        // Wall collision check
        if (grid[newY][newX] === 1) {
            window.playSynthSound('tap'); // Soft thud
            return;
        }

        // Stepping into obstacle check
        const hitObstacle = obstacles.find(obs => Math.round(obs.x) === newX && Math.round(obs.y) === newY);
        if (hitObstacle) {
            window.playSynthSound('wrong');
            // Bounce player back or subtract score
            return;
        }

        // Apply movement
        krishna.x = newX;
        krishna.y = newY;
        window.playSynthSound('move');

        // Check butter ball collection
        const ballIndex = butterBalls.findIndex(ball => ball.active && ball.x === krishna.x && ball.y === krishna.y);
        if (ballIndex !== -1) {
            butterBalls[ballIndex].active = false;
            butterCollected++;
            totalMazeScore += 15;
            window.incrementScore(15);
            window.playSynthSound('collect');
            updateStats();
        }

        // Check butter pot reaching (Goal)
        if (krishna.x === butterPot.x && krishna.y === butterPot.y) {
            handleLevelComplete();
        }
    }

    function handleLevelComplete() {
        totalMazeScore += 50; // Bonus for completion
        window.incrementScore(50);
        window.playSynthSound('correct');

        // Badge triggers
        if (currentLevel === 1) {
            window.unlockBadge('maze_easy');
        }

        if (currentLevel === maxLevel) {
            window.unlockBadge('maze_hard');
            showMazeVictory();
        } else {
            currentLevel++;
            loadLevel(currentLevel);
        }
    }

    function showMazeVictory() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        ctx.fillStyle = 'rgba(18, 22, 32, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '32px "Fredoka One", cursive';
        ctx.fillStyle = '#ffbe0b';
        ctx.textAlign = 'center';
        ctx.fillText('Butter Pot Reached! 🎉', canvas.width / 2, canvas.height / 2 - 30);

        ctx.font = '18px "Quicksand", sans-serif';
        ctx.fillStyle = '#f8f9fa';
        ctx.fillText(`All levels completed! Score: ${totalMazeScore}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press "Reset Level" to play again.', canvas.width / 2, canvas.height / 2 + 40);
        
        currentLevel = 1;
    }

    // Update Obstacles position (slow floating movements)
    function updateEntities() {
        obstacles.forEach(obs => {
            obs.tick += 0.05;
            // Move back and forth horizontally or vertically
            if (obs.type === 'monkey') {
                // Horizontal oscillation
                obs.x = obs.startX + Math.sin(obs.tick) * 0.8;
            } else if (obs.type === 'gopi') {
                // Vertical oscillation
                obs.y = obs.startY + Math.cos(obs.tick) * 0.8;
            }

            // Check collision with Krishna (bounding circle overlap)
            const dx = krishna.x - obs.x;
            const dy = krishna.y - obs.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 0.6) {
                // Collided! Bounce Krishna back to level start or subtract points
                krishna.x = levelMaps[currentLevel].krishna.x;
                krishna.y = levelMaps[currentLevel].krishna.y;
                window.playSynthSound('wrong');
                
                // Lose one butter ball if possible
                const activeBalls = butterBalls.filter(b => !b.active);
                if (activeBalls.length > 0) {
                    activeBalls[0].active = true; // reactivate a butter ball
                    butterCollected--;
                    totalMazeScore = Math.max(0, totalMazeScore - 10);
                    updateStats();
                }
            }
        });
    }

    // Core Drawing Routine
    function draw() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Paths & Walls
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] === 1) {
                    // Wall - Styled as hedges
                    ctx.fillStyle = '#0f5244';
                    ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                    
                    // Dark details for depth
                    ctx.fillStyle = '#09362c';
                    ctx.fillRect(c * cellSize + 4, r * cellSize + 4, cellSize - 8, cellSize - 8);
                } else {
                    // Path - Styled as sandy path
                    ctx.fillStyle = '#1e2435';
                    ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                }
            }
        }

        // 2. Draw Butter Balls
        butterBalls.forEach(ball => {
            if (!ball.active) return;
            
            const px = ball.x * cellSize + cellSize / 2;
            const py = ball.y * cellSize + cellSize / 2;
            
            // Draw yellow glowing ball
            ctx.beginPath();
            ctx.arc(px, py, cellSize * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffbe0b';
            ctx.shadowColor = '#ffbe0b';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        });

        // 3. Draw Butter Pot (Goal)
        const potX = butterPot.x * cellSize + cellSize / 2;
        const potY = butterPot.y * cellSize + cellSize / 2;
        
        // Draw clay pot shape
        ctx.beginPath();
        ctx.ellipse(potX, potY + 4, cellSize * 0.35, cellSize * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#cd6133'; // Clay Orange
        ctx.fill();
        ctx.strokeStyle = '#b33939';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pot neck
        ctx.fillStyle = '#cd6133';
        ctx.fillRect(potX - cellSize * 0.2, potY - cellSize * 0.25, cellSize * 0.4, cellSize * 0.15);
        ctx.strokeRect(potX - cellSize * 0.2, potY - cellSize * 0.25, cellSize * 0.4, cellSize * 0.15);

        // Butter overflowing (white circle on top)
        ctx.beginPath();
        ctx.arc(potX, potY - cellSize * 0.15, cellSize * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#f8f9fa';
        ctx.fill();

        // 4. Draw Obstacles (Monkeys and Gopis)
        obstacles.forEach(obs => {
            const ox = obs.x * cellSize + cellSize / 2;
            const oy = obs.y * cellSize + cellSize / 2;

            if (obs.type === 'monkey') {
                // Draw cute monkey face
                ctx.beginPath();
                ctx.arc(ox, oy, cellSize * 0.28, 0, Math.PI * 2);
                ctx.fillStyle = '#8c5230'; // Brown
                ctx.fill();
                
                // Ears
                ctx.beginPath();
                ctx.arc(ox - cellSize * 0.25, oy - cellSize * 0.15, cellSize * 0.12, 0, Math.PI * 2);
                ctx.arc(ox + cellSize * 0.25, oy - cellSize * 0.15, cellSize * 0.12, 0, Math.PI * 2);
                ctx.fillStyle = '#8c5230';
                ctx.fill();

                // Snout
                ctx.beginPath();
                ctx.arc(ox, oy + cellSize * 0.08, cellSize * 0.16, 0, Math.PI * 2);
                ctx.fillStyle = '#ffcc99'; // tan
                ctx.fill();
                
                // Eyes
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(ox - cellSize * 0.09, oy - cellSize * 0.05, 4, 0, Math.PI * 2);
                ctx.arc(ox + cellSize * 0.09, oy - cellSize * 0.05, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(ox - cellSize * 0.09, oy - cellSize * 0.05, 2, 0, Math.PI * 2);
                ctx.arc(ox + cellSize * 0.09, oy - cellSize * 0.05, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (obs.type === 'gopi') {
                // Draw styled Gopi (Traditional Gopi doll layout)
                ctx.beginPath();
                ctx.arc(ox, oy, cellSize * 0.25, 0, Math.PI * 2);
                ctx.fillStyle = '#ff79c6'; // Pink veil
                ctx.fill();

                // Face
                ctx.beginPath();
                ctx.arc(ox, oy + 2, cellSize * 0.18, 0, Math.PI * 2);
                ctx.fillStyle = '#ffeaa7';
                ctx.fill();

                // Hair / crown line
                ctx.beginPath();
                ctx.arc(ox, oy - cellSize * 0.1, cellSize * 0.15, Math.PI, 0);
                ctx.fillStyle = '#2d3436';
                ctx.fill();
            }
        });

        // 5. Draw Little Krishna
        const kx = krishna.x * cellSize + cellSize / 2;
        const ky = krishna.y * cellSize + cellSize / 2;

        // Krishna skin (sky blue)
        ctx.beginPath();
        ctx.arc(kx, ky + 2, cellSize * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = '#81ecec';
        ctx.fill();
        ctx.strokeStyle = '#00ced1';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Peacock Feather crown (Yellow headband + green feather)
        // Headband
        ctx.beginPath();
        ctx.fillRect(kx - cellSize * 0.25, ky - cellSize * 0.25, cellSize * 0.5, cellSize * 0.08);
        ctx.fillStyle = '#fdcb6e'; // Gold
        ctx.fill();

        // Peacock Feather stem
        ctx.beginPath();
        ctx.moveTo(kx, ky - cellSize * 0.2);
        ctx.quadraticCurveTo(kx + 5, ky - cellSize * 0.4, kx - 5, ky - cellSize * 0.5);
        ctx.strokeStyle = '#00b894';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Peacock Feather eye
        ctx.beginPath();
        ctx.arc(kx - 5, ky - cellSize * 0.5, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#0984e3'; // blue eye
        ctx.fill();
        ctx.beginPath();
        ctx.arc(kx - 5, ky - cellSize * 0.5, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffeaa7'; // yellow core
        ctx.fill();

        // Eyes (drawn for cartoon cute effect)
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.arc(kx - cellSize * 0.1, ky, 3, 0, Math.PI * 2);
        ctx.arc(kx + cellSize * 0.1, ky, 3, 0, Math.PI * 2);
        ctx.fill();

        // Big smile
        ctx.beginPath();
        ctx.arc(kx, ky + 4, 5, 0, Math.PI);
        ctx.strokeStyle = '#e17055';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tilaka (glorious U-shaped mark on forehead)
        ctx.beginPath();
        ctx.moveTo(kx - 2, ky - 10);
        ctx.lineTo(kx - 2, ky - 3);
        ctx.lineTo(kx, ky);
        ctx.lineTo(kx + 2, ky - 3);
        ctx.lineTo(kx + 2, ky - 10);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function gameLoop() {
        if (window.state.activeTab === 'maze') {
            updateEntities();
            draw();
        }
        animationId = requestAnimationFrame(gameLoop);
    }

    // Expose init globally
    window.initMazeGame = initMazeGame;
})();
