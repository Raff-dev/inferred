import json
from datetime import datetime, timedelta

import numpy as np
import redis

NOISE_MAGNITUDE = 0.2
API_URL = "http://backend:8000/api"
API_SENSORS = API_URL + "/sensor-reads/"
LOOKAHEAD = 100
PREDICTION_INTERVAL_MS = 1000  # milliseconds
SPEED_FACTOR = 1

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
        if current_time < datetime.now():
            yield current_time
            current_time += timedelta(milliseconds=PREDICTION_INTERVAL_MS)


class NoiseModel:
    name = "noise"

    def predict(
        self, n: int, sensor_data: np.array, sensor_read: float, data_seed: np.array
    ):
        sensor_data[:, n] = np.append(sensor_data[1:, n], sensor_read)
        data_seed[:, n] = np.append(data_seed[1:, n], np.random.randn(1))

        noise = np.cumsum(np.random.randn(LOOKAHEAD))
        ratio = np.max(np.abs(sensor_data[:, n])) / np.max(np.abs(noise))
        prediction = sensor_data[:, n] + NOISE_MAGNITUDE * noise * ratio
        return prediction.tolist()


class NaiveModel:
    name = "naive"

    def predict(
        self, n: int, sensor_data: np.array, sensor_read: float, data_seed: np.array
    ):
        # pylint: disable=unused-argument

        sensor_data[:, n] = np.append(sensor_data[1:, n], sensor_read)
        data_seed[:, n] = np.append(data_seed[1:, n], np.random.randn(1))

        predictions = []
        for _ in range(LOOKAHEAD):
            prediction = (
                sensor_data[-3:, n]
            ).mean()  # Predict next value as mean of previous 3 values
            predictions.append(prediction)
            sensor_data[:, n] = np.append(sensor_data[1:, n], prediction)

        return np.array(predictions).tolist()


class RandomWalkModel:
    name = "random_walk"

    def __init__(self):
        self.prev_value = None

    def predict(
        self, n: int, sensor_data: np.array, sensor_read: float, data_seed: np.array
    ):
        # pylint: disable=unused-argument
        if self.prev_value is None:
            self.prev_value = sensor_read

        predictions = []
        for _ in range(LOOKAHEAD):
            next_value = self.prev_value + np.random.randn() / 10
            predictions.append(next_value)
            self.prev_value = next_value

        return np.array(predictions).tolist()


class ExponentialSmoothingModel:
    name = "exponential_smoothing"

    def __init__(self, alpha: float = 0.1):
        self.alpha = alpha
        self.prev_value = None

    def predict(
        self, n: int, sensor_data: np.array, sensor_read: float, data_seed: np.array
    ):
        # pylint: disable=unused-argument
        if self.prev_value is None:
            self.prev_value = sensor_read

        predictions = []
        for _ in range(LOOKAHEAD):
            next_value = self.alpha * sensor_read + (1 - self.alpha) * self.prev_value
            predictions.append(next_value)
            self.prev_value = next_value

        return np.array(predictions).tolist()


def generate_data():
    n_sensors = len(sensors)
    data_seed = np.random.randn(LOOKAHEAD, n_sensors)
    sensor_data = np.zeros((LOOKAHEAD, n_sensors))
    start_timestamp = datetime.now()
    current_timestamp = start_timestamp

    # initialize the data, so we can mock predictions
    for n, sensor_fun in enumerate(sensors):
        for i in range(LOOKAHEAD):
            sensor_data[i, n] = sensor_fun(data_seed[i, n], current_timestamp)
            current_timestamp += timedelta(milliseconds=PREDICTION_INTERVAL_MS)

    for current_timestamp in real_time_date(start_timestamp):
        sensors_data = {"reads": {}, "models": {}}

        for model_class in [
            NoiseModel,
            NaiveModel,
            RandomWalkModel,
            ExponentialSmoothingModel,
        ]:
            model = model_class()
            sensors_data["models"][model.name] = {}

            for n, sensor_fun in enumerate(sensors):
                sensor_read = sensor_fun(data_seed[0, n], current_timestamp)
                if not isinstance(sensor_read, (int, float)):
                    sensor_read = sensor_read.item()

                prediction = model.predict(n, sensor_data, sensor_read, data_seed)
                sensor_name = f"sensor_{n}"
                sensors_data["reads"][sensor_name] = sensor_read
                sensors_data["models"][model.name][sensor_name] = prediction

        yield current_timestamp, sensors_data


def main():
    client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
    for current_time, sensors_data in generate_data():
        payload = {
            "timestamp": current_time.isoformat(),
            "reads": sensors_data["reads"],
            "models": sensors_data["models"],
        }
        print(f"Publishing: {current_time}")
        client.publish(CHANNEL_NAME, json.dumps(payload))


if __name__ == "__main__":
    main()
