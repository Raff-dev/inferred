import json
import time
from datetime import datetime, timedelta

import numpy as np
import requests

NOISE_MAGNITUDE = 0.2
API_URL = "http://backend:8000/api"
API_SENSORS = API_URL + "/sensor-reads/"
LOOKAHEAD = 100
PREDICTION_INTERVAL_MS = 3000  # milliseconds

CHANNEL_NAME = "sensors"
REDIS_HOST = "redis"
REDIS_PORT = 6379
REDIS_DB = 0


sensors = [
    lambda seed, date: 0.5 * np.sin(2 * np.pi * np.arange(1) / (6 * 60)) + 0.5,
    lambda seed, date: 0.9 * seed + NOISE_MAGNITUDE * np.random.randn(),
    lambda seed, date: np.random.randn() + 0.5 * seed,
    lambda seed, date: seed
    * np.exp((0.1 - 0.5 * 0.2**2) / 365 + np.sqrt(1 / 365) / 5 * np.random.randn()),
    lambda seed, date: 0.1 * seed + np.sin(2 * np.pi * date.second / 60),
    lambda seed, date: 0.1 * seed + np.linspace(0, 1, 1),
    lambda seed, date: np.random.poisson(1, size=1),
    lambda seed, date: np.random.binomial(4, 0.5, size=1),
]


def real_time_date(start_time=None):
    if not start_time:
        start_time = datetime.now()

    current_time = start_time
    while True:
        yield current_time
        current_time += timedelta(milliseconds=PREDICTION_INTERVAL_MS)
        time.sleep(PREDICTION_INTERVAL_MS / 1000)


def generate_data():
    data_seed = np.random.randn(LOOKAHEAD, len(sensors))
    sensor_data = np.zeros((LOOKAHEAD, len(sensors)))
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

            sensor_data[:, s] = np.append(sensor_data[1:, s], sensor_read)
            data_seed[:, s] = np.append(data_seed[1:, s], np.random.randn(1))

            noise = np.cumsum(np.random.randn(LOOKAHEAD))
            ratio = np.max(np.abs(sensor_data[:, s])) / np.max(np.abs(noise))
            prediction = sensor_data[:, s] + NOISE_MAGNITUDE * noise * ratio

            name = f"sensor_{s}"
            sensors_data[name] = {
                "value": sensor_read.tolist()[0],
                "prediction": prediction.tolist(),
            }

        yield current_timestamp, sensors_data


def main():
    for current_time, sensors_data in generate_data():
        payload = {
            "timestamp": current_time.isoformat(),
            "prediction_interval": PREDICTION_INTERVAL_MS,
            "sensors": sensors_data,
        }
        print(payload)
        requests.post(API_SENSORS, json=json.dumps(payload))


if __name__ == "__main__":
    main()
