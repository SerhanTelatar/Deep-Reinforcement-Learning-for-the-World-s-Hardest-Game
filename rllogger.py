import numpy as np

class RLLogger:
    def __init__(self):
        self.episode_rewards = []
        self.episode_lengths = []
        self.successes = []
        self.entropies = []
        self.losses = []
        self.steps = 0

    def log_episode(self, cumulative_reward, length, success):
        self.episode_rewards.append(cumulative_reward)
        self.episode_lengths.append(length)
        self.successes.append(success)

    def log_entropy(self, entropy):
        self.entropies.append(entropy)

    def log_loss(self, loss):
        self.losses.append(loss)

    def log_step(self):
        self.steps += 1

    def get_average_reward(self, last_n=100):
        return np.mean(self.episode_rewards[-last_n:])

    def get_success_rate(self, last_n=100):
        return np.mean(self.successes[-last_n:])

    def get_entropy(self, last_n=100):
        return np.mean(self.entropies[-last_n:])

    def get_loss(self, last_n=100):
        return np.mean(self.losses[-last_n:])

    def summary(self):
        print(f"Episode {len(self.episode_rewards)} | "
              f"Avg Reward (last 100): {self.get_average_reward():.2f} | "
              f"Success Rate: {self.get_success_rate():.2f} | "
              f"Steps: {self.steps}")
