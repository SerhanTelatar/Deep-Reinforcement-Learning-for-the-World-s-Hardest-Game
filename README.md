[![Demo Video](https://img.youtube.com/vi/HlpEgIqo2qI/hqdefault.jpg)](https://www.youtube.com/watch?v=HlpEgIqo2qI)

  # World's Hardest Game RL + Manual

  This project implements a version of "The World's Hardest Game," allowing both **manual control** and **Reinforcement Learning (RL) agent control** using a Deep Q-Network (DQN). The game environment is built with HTML, CSS, and JavaScript, while the RL agent runs on a Python backend, communicating via WebSockets.

  ---

  ## Table of Contents

  - [Features](#features)
  - [How to Play (Manual)](#how-to-play-manual)
  - [RL Agent Integration](#rl-agent-integration)
  - [Project Structure](#project-structure)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
    - [Installation Steps](#installation-steps)
  - [Running the Game](#running-the-game)
  - [Training the RL Agent](#training-the-rl-agent)
  - [Analyzing Results](#analyzing-results)
  - [Technologies Used](#technologies-used)
  - [Author](#author)

  ---

  ## Features

  * **Classic "World's Hardest Game" Gameplay:** Navigate a red square through a maze, avoiding blue enemies to reach the green end zone.
  * **Manual Control:** Play the game directly using keyboard inputs (Arrow keys or WASD).
  * **Reinforcement Learning Agent:** An integrated Deep Q-Network (DQN) agent that learns to play the game autonomously.
  * **WebSocket Communication:** Seamless real-time communication between the JavaScript frontend (game) and the Python backend (RL agent).
  * **Reward Shaping:** Custom reward function in the RL agent to encourage goal-oriented behavior and penalize collisions.
  * **Game State Representation:** Comprehensive state representation including player position, velocity, and enemy positions/movements.
  * **DQN Implementation:** Standard DQN with experience replay and a target network for stable learning.
  * **Logging and Analysis:** Tools to log training metrics (rewards, episode lengths, successes, losses) and visualize them.

  ---

  ## How to Play (Manual)

  When the RL agent is not connected or active, you can control the red player manually:

  * **Movement:** Use the **Arrow keys** or **WASD** to move the red player.
  * **Goal:** Navigate the player from the **green start zone** through the **white corridor**, avoiding **blue enemies**, to reach the **green end zone**.
  * **Deaths:** Colliding with a blue enemy will result in a "death" and reset the player to the start. The death count is displayed in the header.

  ---

  ## RL Agent Integration

  The game is designed to work with an external RL agent. When the `server.js` (Python backend) is running and connected via WebSocket:

  * The `instText` on the game screen will indicate that the **AI (RL-Agent) is active** and human control is disabled.
  * The RL agent will take control of the player, attempting to learn and play the game.
  * The agent receives the **game state**, determines an **action**, and sends it back to the frontend to execute.
  * **Reward shaping** is implemented on the backend to guide the agent's learning:
      * A small negative reward for each step to encourage faster completion.
      * A positive reward for getting closer to the goal.
      * A large positive reward for reaching the end zone (win).
      * A large negative reward for colliding with an enemy (death).

  ---

  ## Project Structure

  * `index.html`: The main HTML file for the game's structure and layout.
  * `style.css`: Defines the visual styles for the game elements.
  * `script.js`: Contains the core game logic, player/enemy movements, collision detection, and WebSocket client for RL agent communication.
  * `server.js`: The Python WebSocket server that handles communication with the frontend, receives game states, and sends actions from the RL agent. It integrates with the `model.py` for agent decisions.
  * `model.py`: Implements the Deep Q-Network (DQN) architecture, defines the `get_action` (for agent's decision-making) and `observe` (for training updates) functions, and manages the replay buffer and target network updates.
  * `rllogger.py`: A utility class for logging training metrics such as rewards, episode lengths, and success rates, and for generating summaries.
  * `analyze_results.py`: A script to load and visualize the logged training data using `matplotlib`.

  ---

  ## Setup and Installation

  ### Prerequisites

  * **Web Browser:** Any modern web browser (Chrome, Firefox, Edge, Safari) to run the `index.html`.
  * **Python 3.x:** Installed on your system.
  * **pip:** Python package installer.

  ### Installation Steps

  1.  **Clone the repository:**
      ```bash
      git clone <repository_url>
      cd <repository_name>
      ```
      (Replace `<repository_url>` and `<repository_name>` with the actual values.)

  2.  **Install Python dependencies:**
      ```bash
      pip install websockets numpy torch matplotlib
      ```
      or
      ```bash
      pip install -r requirements.txt
      ```

  ---

  ## Running the Game

  1.  **Start the RL Agent Backend:**
      Open a terminal or command prompt, navigate to the project directory, and run the Python server:
      ```bash
      python server.js
      ```
      You should see a message indicating "WebSocket RL server is running on: ws://localhost:8765".

  2.  **Open the Game in Browser:**
      Open the `index.html` file in your web browser. You can usually do this by double-clicking the file or by dragging it into your browser window.

  Once both are running, the game will attempt to connect to the RL agent. If successful, the agent will begin controlling the player.

  ---

  ## Training the RL Agent

  The RL agent trains automatically as it plays the game. The `model.py` handles the training loop.
  * **Exploration (Epsilon-Greedy):** The agent starts with a high `epsilon` value, promoting exploration (random actions), which gradually decays over time to encourage exploitation (using learned actions).
  * **Experience Replay:** Experiences (state, action, reward, next_state, done) are stored in a `deque` (replay buffer) and sampled in batches for training.
  * **Target Network:** A separate target Q-network is used to stabilize training by providing more consistent Q-value targets.

  You can monitor the training progress in the terminal where `server.js` is running, as the `RLLogger` provides episode summaries.

  ---

  ## Analyzing Results

  To visualize the training performance of the RL agent:

  1.  Ensure the `RLLogger` saves its data (you might need to add a `save` method to `rllogger.py` and call it in `server.js` for persistent logging, though the provided code logs to console and keeps in memory for `analyze_results.py` to access).
  2.  Run the analysis script:
      ```bash
      python analyze_results.py
      ```
      This will display plots for cumulative reward and success rate over episodes.

  ---

  ## Technologies Used

  * **Frontend:**
      * HTML5
      * CSS3
      * JavaScript
      * Chart.js (although not actively used in the provided JS for charting, it's included in `index.html`)
  * **Backend & RL:**
      * Python 3.x
      * `websockets` library for WebSocket communication
      * `numpy` for numerical operations
      * `torch` (PyTorch) for building and training the neural network
      * `matplotlib` for plotting results

  ---

  ## Author

  * **Serhan Emre Telatar**
      * Project Title: Deep Reinforcement Learning for the World's Hardest Game

