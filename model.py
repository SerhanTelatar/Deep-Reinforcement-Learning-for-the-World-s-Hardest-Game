import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import random
from collections import deque
from rllogger import RLLogger

import matplotlib.pyplot as plt

logger = RLLogger()

STATE_DIM = 48
ACTION_DIM = 9
GAMMA = 0.99
LR = 3e-4
BATCH_SIZE = 64
BUFFER_SIZE = 50000
MIN_REPLAY_SIZE = 500
TARGET_UPDATE_FREQ = 200

class QNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(STATE_DIM, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, ACTION_DIM)
        )
    def forward(self, x):
        return self.net(x)

qnet = QNet()
target_qnet = QNet()
target_qnet.load_state_dict(qnet.state_dict())
optimizer = optim.Adam(qnet.parameters(), lr=LR)
replay_buffer = deque(maxlen=BUFFER_SIZE)

epsilon = 1.0
epsilon_min = 0.08
epsilon_decay = 0.9996
step_count = 0

_last_state = None
_last_action = None

def get_action(state):
    global epsilon, _last_state, _last_action
    state_arr = np.array(state, dtype=np.float32)
    _last_state = state_arr
    if random.random() < epsilon:
        action = random.randint(0, ACTION_DIM - 1)
    else:
        with torch.no_grad():
            state_tensor = torch.tensor(state_arr).unsqueeze(0)
            q_vals = qnet(state_tensor)
            action = int(torch.argmax(q_vals, dim=1)[0].item())
    _last_action = action
    return action

def observe(next_state, reward, done):
    global epsilon, step_count, _last_state, _last_action
    if _last_state is not None and _last_action is not None:
        replay_buffer.append((_last_state, _last_action, reward, np.array(next_state, dtype=np.float32), done))
    if len(replay_buffer) > MIN_REPLAY_SIZE:
        batch = random.sample(replay_buffer, BATCH_SIZE)
        states, actions, rewards, next_states, dones = zip(*batch)
        states = torch.tensor(np.array(states), dtype=torch.float32)
        actions = torch.tensor(actions, dtype=torch.int64)
        rewards = torch.tensor(rewards, dtype=torch.float32)
        next_states = torch.tensor(np.array(next_states), dtype=torch.float32)
        dones = torch.tensor(dones, dtype=torch.bool)
        q_values = qnet(states).gather(1, actions.unsqueeze(1)).squeeze(1)
        with torch.no_grad():
            max_next_q = target_qnet(next_states).max(1)[0]
        targets = rewards + GAMMA * max_next_q * (~dones)
        loss = nn.MSELoss()(q_values, targets)
        logger.log_loss(loss.item())  # <<== BURAYA KOY
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        step_count += 1
        if step_count % TARGET_UPDATE_FREQ == 0:
            target_qnet.load_state_dict(qnet.state_dict())
        # Epsilon decay
        epsilon = max(epsilon * epsilon_decay, epsilon_min)
    if done:
        _last_state = None
        _last_action = None

def plot_metrics(logger):
    plt.figure(figsize=(10, 4))
    plt.subplot(1,2,1)
    plt.plot(logger.episode_rewards)
    plt.title('Cumulative Reward')
    plt.xlabel('Episode')
    plt.ylabel('Reward')

    plt.subplot(1,2,2)
    plt.plot(logger.successes)
    plt.title('Success Rate')
    plt.xlabel('Episode')
    plt.ylabel('Success')
    plt.tight_layout()
    plt.show()


