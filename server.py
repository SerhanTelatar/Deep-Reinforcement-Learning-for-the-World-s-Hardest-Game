import asyncio
import websockets
import json
from model import get_action, observe
import numpy as np
from rllogger import RLLogger

logger = RLLogger()

WS_PORT = 8765

prev_player_pos = None

def distance(pos, end_zone):
    # pos = (x, y)
    # end_zone = (center_x, center_y)
    return np.linalg.norm(np.array(pos) - np.array(end_zone))

async def handler(websocket):
    global prev_player_pos
    print("RL-Agent: Connection established with JS.")
    
    cumulative_reward = 0
    episode_length = 0

    end_zone_center = (710, 250)
    while True:
        try:
            msg = await websocket.recv()
            data = json.loads(msg)
            state = data["state"]
            done = data.get("done", False)
            player_pos = (state[0], state[1])

            # --- reward shaping ---
            if prev_player_pos is None:
                prev_player_pos = player_pos
            prev_dist = distance(prev_player_pos, end_zone_center)
            new_dist = distance(player_pos, end_zone_center)
            delta = prev_dist - new_dist
            reward = -1
            if delta > 0:
                reward += 0.2
            else:
                reward -= 0.5
            if done:
                if data.get("reward", 0) >= 100:
                    reward = 100
                elif data.get("reward", 0) <= -100:
                    reward = -100
                prev_player_pos = None
            else:
                prev_player_pos = player_pos

            cumulative_reward += reward
            episode_length += 1

            observe(state, reward, done)
            action = get_action(state)
            await websocket.send(json.dumps(action))
            if done:
                success = 1 if reward >= 100 else 0
                logger.log_episode(cumulative_reward, episode_length, success)
                logger.summary()
                cumulative_reward = 0
                episode_length = 0
                print(f"Episods finished, waiting for new game.")
                
        except websockets.ConnectionClosed:
            print("Disconnected from RL-Agent")
            break

async def main():
    print(f"WebSocket RL server is running on: ws://localhost:{WS_PORT}")
    async with websockets.serve(handler, "localhost", WS_PORT):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
