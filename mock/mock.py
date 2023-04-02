import time
from datetime import datetime, timedelta

import numpy as np

NOISE_MAGNITUDE = 0.2
API_URL = "http://localhost:8000/api"
API_TICK = API_URL + "/tick"
API_PREDICTION = API_URL + "/prediction"
LOOKAHEAD = 100


sensors = [
    lambda seed, date: 0.5 * np.sin(2 * np.pi * np.arange(1) / (6 * 60)) + 0.5,
    lambda seed, date: 0.9 * seed + NOISE_MAGNITUDE * np.random.randn(),
    lambda seed, date: np.random.randn() + 0.5 * seed,
    lambda seed, date: seed
    * np.exp(
        (0.1 - 0.5 * 0.2**2) * 1 / 365 + 0.2 * np.sqrt(1 / 365) * np.random.randn()
    ),
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
        current_time += timedelta(seconds=1)
        time.sleep(1)


def generate_data():
    data_seed = np.random.randn(LOOKAHEAD, len(sensors))
    sensor_data = np.zeros((LOOKAHEAD, len(sensors)))
    start_time = datetime.now()
    current_time = start_time

    # initialize the data, so we can mock predictions
    for s, sensor in enumerate(sensors):
        for i in range(LOOKAHEAD):
            sensor_data[i, s] = sensor(data_seed[i, s], current_time)
            current_time += timedelta(seconds=1)

    for current_time in real_time_date(current_time):
        sensor_reads = {}
        predictions = {}

        for s, sensor in enumerate(sensors):
            sensor_read = sensor(data_seed[0, s], current_time)

            sensor_data[:, s] = np.append(sensor_data[1:, s], sensor_read)
            data_seed[:, s] = np.append(data_seed[1:, s], np.random.randn(1))

            noise = np.cumsum(np.random.randn(LOOKAHEAD))
            ratio = np.max(np.abs(sensor_data[:, s])) / np.max(np.abs(noise))
            prediction = sensor_data[:, s] + NOISE_MAGNITUDE * noise * ratio

            name = f"sensor_{s}"
            sensor_reads[name] = sensor_read
            predictions[name] = prediction

        yield sensor_reads, predictions


def main():
    for sensor_reads, predictions in generate_data():
        print(f"{sensor_reads=}")
        print(f"{predictions=}")


if __name__ == "__main__":
    main()
