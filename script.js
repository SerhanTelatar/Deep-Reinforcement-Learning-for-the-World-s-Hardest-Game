    // ----------- Game variables and settings -----------
    const player = document.getElementById('player');
    const enemies = [
        document.getElementById('enemy1'),document.getElementById('enemy2'),document.getElementById('enemy3'),
        document.getElementById('enemy4'),document.getElementById('enemy5'),document.getElementById('enemy6'),
        document.getElementById('enemy7'),document.getElementById('enemy8'),document.getElementById('enemy9'),document.getElementById('enemy10')
    ];
    const gameOverDiv = document.getElementById('gameOver');
    const winMessageDiv = document.getElementById('winMessage');
    const deathsElement = document.getElementById('deaths');
    const instText = document.getElementById('instText');

    let playerX = 90, playerY = 240;
    let lastPlayerX = playerX, lastPlayerY = playerY;
    let playerVX = 0, playerVY = 0;
    let deaths = 0, gameRunning = true, AIcontrol = false;

    const corridorLeft = 165, corridorTop = 200, corridorWidth = 476, corridorHeight = 112;
    const enemyCount = 10, space = Math.floor((corridorWidth - 20) / (enemyCount - 1));
    const enemyData = Array.from({ length: enemyCount }).map((_, i) => ({
        x: corridorLeft + 10 + i * space,
        y: corridorTop + 10,
        dy: (i % 2 === 0 ? 1 : -1),
        speed: 1 + (i % 3) * 0.4
    }));

    function onRestart() {
        if (AIcontrol) {
            resetGame();
            if (ws && ws.readyState === 1) {

                sendStateRewardDone(0, false);
            }
        } else {
            resetGame();

            Object.keys(keys).forEach(k => keys[k] = false);

            AIcontrol = false;
            instText.innerHTML = "Play with keyboard<br>RL-Agent is disabled.";
        }
    }
    function nextLevel() {
        resetGame();
        if (AIcontrol && ws && ws.readyState === 1) {
            sendStateRewardDone(0, false);
        }
    }


    function updatePlayer() {
        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';
    }
    function updateEnemies() {
        for (let i = 0; i < enemies.length; i++) {
            const data = enemyData[i];
            data.y += data.dy * data.speed;
            if (data.y <= corridorTop + 5 || data.y >= corridorTop + corridorHeight - 17) {
                data.dy *= -1;
            }
            enemies[i].style.left = data.x + 'px';
            enemies[i].style.top = data.y + 'px';
        }
    }
    function checkCollisions() {
        const playerRect = {x: playerX, y: playerY, width: 15, height: 15};
        for (let i = 0; i < enemies.length; i++) {
            const data = enemyData[i];
            const enemyRect = {x: data.x, y: data.y, width: 12, height: 12};
            if (
                playerRect.x < enemyRect.x + enemyRect.width &&
                playerRect.x + playerRect.width > enemyRect.x &&
                playerRect.y < enemyRect.y + enemyRect.height &&
                playerRect.y + playerRect.height > enemyRect.y
            ) {
                gameRunning = false;
                deaths++;
                deathsElement.textContent = 'DEATHS: ' + deaths;
                setTimeout(() => {
                    resetGame();
                }, 500); 
                return true;
            }
        }
        if (playerX > 635 && playerY > 150 && playerY < 350) {
            gameRunning = false;
            winMessageDiv.style.display = 'block';
            setTimeout(() => {
                alert("Kazandınız!");
            }, 100); 
            return true;
        }
        return false;
    }

    function resetGame() {
        playerX = 90; playerY = 240;
        lastPlayerX = playerX; lastPlayerY = playerY;
        playerVX = 0; playerVY = 0;
        gameRunning = true;
        gameOverDiv.style.display = 'none';
        winMessageDiv.style.display = 'none';
        for (let i = 0; i < enemyCount; i++) {
            enemyData[i].y = corridorTop + 10;
            enemyData[i].dy = (i % 2 === 0 ? 1 : -1);
        }
        updatePlayer();
        Object.keys(keys).forEach(k => keys[k] = false);
    }

    function nextLevel() {
        resetGame();
        if (AIcontrol && ws && ws.readyState === 1) {
            sendStateRewardDone(0, false);
        }
    }


    // --------- Game with keyboard (manual) ---------
    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };
    const moveSpeed = 2.1;

    document.addEventListener('keydown', function(e) {
        if (!gameRunning || AIcontrol) return;
        if (e.key in keys) keys[e.key] = true;
    });
    document.addEventListener('keyup', function(e) {
        if (!gameRunning || AIcontrol) return;
        if (e.key in keys) keys[e.key] = false;
    });

    // --------- Main game frame loop ---------
    function gameLoop() {
        updateEnemies();

        if (gameRunning) {
            // Manual control (if no AI)
            if (!AIcontrol) {
                let dx = 0, dy = 0;
                if (keys.ArrowUp || keys.w) dy -= 1;
                if (keys.ArrowDown || keys.s) dy += 1;
                if (keys.ArrowLeft || keys.a) dx -= 1;
                if (keys.ArrowRight || keys.d) dx += 1;
                if (dx !== 0 || dy !== 0) {
                    const len = Math.sqrt(dx*dx + dy*dy);
                    dx = dx / len;
                    dy = dy / len;
                    let newX = playerX + dx * moveSpeed;
                    let newY = playerY + dy * moveSpeed;
                    if (newX >= 30 && newX <= 770 && newY >= 50 && newY <= 535) {
                        const inStartZone = (newX >= 30 && newX <= 155 && newY >= 150 && newY <= 350);
                        const inCorridor = (newX >= 150 && newX <= 635 && newY >= 200 && newY <= 300);
                        const inEndZone = (newX >= 630 && newX <= 770 && newY >= 150 && newY <= 350);
                        const inStartToCorridor = (newX >= 150 && newX <= 155 && newY >= 200 && newY <= 300);
                        const inCorridorToEnd = (newX >= 495 && newX <= 500 && newY >= 200 && newY <= 300);
                        if (inStartZone || inCorridor || inEndZone || inStartToCorridor || inCorridorToEnd) {
                            playerVX = newX - lastPlayerX;
                            playerVY = newY - lastPlayerY;
                            lastPlayerX = playerX;
                            lastPlayerY = playerY;
                            playerX = newX;
                            playerY = newY;
                            updatePlayer();
                        }
                    }
                } else {
                    playerVX = 0; playerVY = 0;
                }
                updatePlayer();
            }
        }
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();

    // --------- RL-AGENT WebSocket Support ----------
    let ws;
    function connectWebSocket() {
        ws = new WebSocket("ws://localhost:8765/");
        ws.onopen = () => {
            AIcontrol = true;
            instText.innerHTML = "AI (RL-Agent) is active!<a>Human control is disabled.";
            sendStateRewardDone(0, false); // first state
        };
        ws.onclose = () => {
            AIcontrol = false;
            instText.innerHTML = "Klavye ile oyna<br>RL-Agent bağlantısı kesildi";
            setTimeout(connectWebSocket, 2000);
        };
        ws.onerror = err => console.error("WebSocket error:", err);

        let prevDist = null;

        function getDistanceToGoal(px, py) {
            const endZoneCenterX = 635 + 60;
            const endZoneCenterY = 150 + 100;
            return Math.abs(px - endZoneCenterX) + Math.abs(py - endZoneCenterY); // Manhattan distance
        }

        // WebSocket onmessage is inside when AI action is received:
        ws.onmessage = function(event) {
            AIcontrol = true;
            instText.innerHTML = "AI (RL-Agent) aktif!<br>İnsan kontrolü devre dışı.";
            const action = JSON.parse(event.data);
            let collisionOrGoal = false;

            // ------ 1. Reward shaping for distance measure ------
            if (prevDist === null) prevDist = getDistanceToGoal(playerX, playerY);

            if (gameRunning) {
                applyAction(action);
                updatePlayer();
                collisionOrGoal = checkCollisions();
            }

            // ------ 2. Reward shaping ve done flag measure ------
            let reward = -1; // default step penalty
            let done = false;
            let newDist = getDistanceToGoal(playerX, playerY);

            let delta = prevDist - newDist;
            if (delta > 0) reward += 0.2; // getting closer
            else reward -= 0.2; // getting further away

            if (collisionOrGoal) {
                if (winMessageDiv.style.display === 'block') reward = 100;
                else reward = -100;
                done = true;
                prevDist = null; // Epizod closed, reset
            } else {
                prevDist = newDist; // upgrade the letest distance
            }

            sendStateRewardDone(reward, done);
        };
    }
    connectWebSocket();


    function applyAction(action) {
        let dx = 0, dy = 0;
        switch(action) {
            case 1: dy = -1; break; // up
            case 2: dy = 1; break;  // down
            case 3: dx = -1; break; // left
            case 4: dx = 1; break;  // right
            case 5: dx = -1; dy = -1; break;
            case 6: dx = 1; dy = -1; break;
            case 7: dx = -1; dy = 1; break;
            case 8: dx = 1; dy = 1; break;
            default: break;
        }
        if (dx !== 0 && dy !== 0) {
            dx = dx / Math.sqrt(2);
            dy = dy / Math.sqrt(2);
        }
        let newX = playerX + dx * moveSpeed;
        let newY = playerY + dy * moveSpeed;
        if (newX >= 30 && newX <= 770 && newY >= 50 && newY <= 535) {
            const inStartZone = (newX >= 30 && newX <= 155 && newY >= 150 && newY <= 350);
            const inCorridor = (newX >= 150 && newX <= 635 && newY >= 200 && newY <= 300);
            const inEndZone = (newX >= 630 && newX <= 770 && newY >= 150 && newY <= 350);
            const inStartToCorridor = (newX >= 150 && newX <= 155 && newY >= 200 && newY <= 300);

            const inCorridorToEnd = (newX >= 495 && newX <= 500 && newY >= 200 && newY <= 300);
            if (inStartZone || inCorridor || inEndZone || inStartToCorridor || inCorridorToEnd) {
                playerVX = newX - lastPlayerX;
                playerVY = newY - lastPlayerY;
                lastPlayerX = playerX;
                lastPlayerY = playerY;
                playerX = newX;
                playerY = newY;
            }
        }
    }
    function getState() {
        const playerState = [playerX, playerY, playerVX || 0, playerVY || 0];
        const enemiesState = [];
        for (let i = 0; i < enemyCount; i++) {
            enemiesState.push(
                enemyData[i].x, enemyData[i].y, enemyData[i].dy, enemyData[i].speed
            );
        }
        const endZone = [650, 150, 120, 200];
        return [...playerState, ...enemiesState, ...endZone];
    }
    function sendStateRewardDone(reward, done) {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({
                state: getState(),
                reward: reward,
                done: done
            }));
        }
    }