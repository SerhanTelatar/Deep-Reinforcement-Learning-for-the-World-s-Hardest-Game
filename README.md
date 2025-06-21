
# World’s Hardest Game için Deep Reinforcement Learning

![Oyun Ekranı](demo_screenshot.png)

Tarayıcıda oynanabilen “World’s Hardest Game” klonu ve buna bağlanabilen RL-Agent (PyTorch, DQN)!  
İster klavyeyle oyna, ister kendi AI ajanını bağlayıp eğitimini izle!

---

## 🚩 Özellikler

- Klavye ile manuel oynama veya AI (WebSocket üzerinden Python RL Agent) ile oynama.
- Modern browser tabanlı UI, yükleme gerekmez.
- Python’daki RL Agent ile gerçek zamanlı iletişim (websockets).
- RL eğitimi sırasında ayrıntılı loglama ve grafik çizimi (`RLLogger` ve matplotlib).
- Ölüm sayısı, level, anlık skor gibi bilgiler.

---

## 📂 Proje Dosya Yapısı

project-root/
│
├─ index.html # Main browser UI and game layout
├─ style.css # Game visuals
├─ script.js # Game logic & RL-Agent WebSocket connection
│
├─ server.py # Python RL server, reward logic, action selection
├─ model.py # DQN model & training loop (PyTorch)
├─ rllogger.py # Custom RL metrics and logging
│
├─ analyze_results.py # (Optional) Plot RL metrics after training
└─ requirements.txt # Python dependencies (torch, websockets, numpy, matplotlib)


---

## 🚀 Getting Started

### 1. Install Python requirements

```bash
pip install -r requirements.txt

python server.py

3. Open the Game in Your Browser
Open index.html in Chrome/Firefox (file:/// or with a local HTTP server).

4. Train, Watch, and Analyze
Play manually or let the RL agent control the player.

RL training metrics are saved and can be visualized using analyze_results.py.

📊 Evaluation & Metrics
Key RL metrics tracked:

Cumulative Reward

Success Rate

Average Loss

Steps per episode

Use analyze_results.py to plot learning curves.

🧠 Tech Stack
Frontend: HTML5, CSS3, Vanilla JS

Backend: Python 3, PyTorch, websockets, numpy, matplotlib

📝 Credits
Serhan Emre Telatar
Deep Reinforcement Learning for the World’s Hardest Game (2024)
