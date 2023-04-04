import json
import time
from datetime import datetime, timedelta

import numpy as np
import redis

NOISE_MAGNITUDE = 0.2
API_URL = "http://backend:8000/api"
API_SENSORS = API_URL + "/sensor-reads/"
LOOKAHEAD = 100
PREDICTION_INTERVAL_MS = 2000  # milliseconds
SPEED_FACTOR = 4

CHANNEL_NAME = "sensors"
REDIS_HOST = "redis"
REDIS_PORT = 6379
REDIS_DB = 0


sensors = [
    lambda seed, date: abs(0.9 * seed + 0.3 * np.random.randn()) + 5,
    lambda seed, date: date.second % 5 * seed + (date.second > 30) * 20,
    lambda seed, date: 0.9 * seed + 0.3 * np.random.randn(),
    lambda seed, date: 12 * (date.second % 30) + np.random.randn(),
    lambda seed, date: np.random.randn() + 0.5 * seed,
    lambda seed, date: seed + np.sqrt(date.second) * np.random.randn(),
    lambda seed, date: 0.25 * seed + np.sin(2 * np.pi * date.second / 60),
    lambda seed, date: 0.4 * seed + np.cos(2 * np.pi * date.second / 60),
    lambda seed, date: np.random.poisson(125),
    lambda seed, date: np.random.binomial(125, 0.5),
    lambda seed, date: np.random.normal(125, 10),
]


def real_time_date(start_time=None):
    if not start_time:
        start_time = datetime.now()

    current_time = start_time
    while True:
        yield current_time
        current_time += timedelta(milliseconds=PREDICTION_INTERVAL_MS)
        time.sleep(PREDICTION_INTERVAL_MS / 1000 / SPEED_FACTOR)


def generate_data():
    n_sensors = len(sensors)
    data_seed = np.random.randn(LOOKAHEAD, n_sensors)
    sensor_data = np.zeros((LOOKAHEAD, n_sensors))
    start_timestamp = datetime.now()
    current_timestamp = start_timestamp

    # initialize the data, so we can mock predictions
    for s, sensor in enumerate(sensors):
        for i in range(LOOKAHEAD):
            sensor_data[i, s] = sensor(data_seed[i, s], current_timestamp)
            current_timestamp += timedelta(milliseconds=PREDICTION_INTERVAL_MS)

    for current_timestamp in real_time_date(current_timestamp):
        sensors_data = {}

        for s, sensor in enumerate(sensors):
            sensor_read = sensor(data_seed[0, s], current_timestamp)

            if not isinstance(sensor_read, (int, float)):
                sensor_read = sensor_read.item()

            sensor_data[:, s] = np.append(sensor_data[1:, s], sensor_read)
            data_seed[:, s] = np.append(data_seed[1:, s], np.random.randn(1))

            noise = np.cumsum(np.random.randn(LOOKAHEAD))
            ratio = np.max(np.abs(sensor_data[:, s])) / np.max(np.abs(noise))
            prediction = sensor_data[:, s] + NOISE_MAGNITUDE * noise * ratio

            name = f"sensor_{s}"
            sensors_data[name] = {
                "value": sensor_read,
                "prediction": prediction.tolist(),
            }

        yield current_timestamp, sensors_data


def main():
    client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
    for current_time, sensors_data in generate_data():
        payload = {
            "timestamp": current_time.isoformat(),
            "prediction_interval": PREDICTION_INTERVAL_MS,
            "sensors": sensors_data,
        }
        print(f"Publishing: {current_time}")
        client.publish(CHANNEL_NAME, json.dumps(payload))


if __name__ == "__main__":
    main()
