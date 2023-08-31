from typing import Callable

from rest_framework.exceptions import ValidationError

from inferred.sensors.utils import aware_timestamp


def generate_evenly_divided_timestamps(
    start_timestamp: str, end_timestamp: str, n: int
) -> list:
    start = aware_timestamp(start_timestamp)
    end = aware_timestamp(end_timestamp)

    delta = (end - start) / (n - 1)
    timestamps = [start + i * delta for i in range(n)]

    return [timestamp.strftime("%Y-%m-%d %H:%M:%S") for timestamp in timestamps]


class Granulation:
    METHOD_STARTSWITH = "granulation_"

    def __init__(self, data: list[float], method: str, extra_param: int = None):
        if method not in self.methods:
            raise ValidationError(f"Method {method} not supported")

        self.data_values = [float(value["value"]) for value in data]
        self.data_len = len(self.data_values)

        start_timestamp = data[0]["timestamp"]
        end_timestamp = data[-1]["timestamp"]

        method_name = self.METHOD_STARTSWITH + method
        granulated_values = getattr(self, method_name)(extra_param)
        timestamps = generate_evenly_divided_timestamps(
            start_timestamp, end_timestamp, len(granulated_values)
        )

        self.granulated_data = [
            {"timestamp": timestamp, "value": value}
            for timestamp, value in zip(timestamps, granulated_values)
        ]

    @classmethod
    @property
    def methods(cls):
        return [
            name.replace(cls.METHOD_STARTSWITH, "")
            for name in dir(cls)
            if name.startswith(cls.METHOD_STARTSWITH)
        ]

    def granulation_downsampling(self, factor: int) -> list[float]:
        """Apply granulation through downsampling to reduce data size."""
        if factor is None:
            factor = 2

        result = self.data_values[::factor]
        return result

    def granulation_moving_average(self, window_size: int) -> list[float]:
        """
        Apply granulation through moving averages to reduce data size.
        Computes moving averages over each window of data points.
        The resulting list contains the moving average granulated data points.

        len(output) == len(data) - window_size + 1
        """
        if window_size is None:
            window_size = 5

        result = []
        for i in range(self.data_len - window_size + 1):
            window = self.data_values[i : i + window_size]
            average = sum(window) / window_size
            result.append(average)
        return result

    def __apply_paa(
        self, segment_size: int, operation: Callable[[list[float]], float]
    ) -> list[float]:
        """
        Divides data into segments apply the provided operation within each segment.
        """
        if segment_size is None:
            segment_size = 3

        paa_data = [
            operation(self.data_values[i : i + segment_size])
            for i in range(0, self.data_len, segment_size)
        ]
        return paa_data

    def granulation_paa_min(self, segment_size: int) -> list[float]:
        return self.__apply_paa(segment_size, min)

    def granulation_paa_max(self, segment_size: int) -> list[float]:
        return self.__apply_paa(segment_size, max)

    def granulation_paa_avg(self, segment_size: int) -> list[float]:
        return self.__apply_paa(segment_size, lambda x: sum(x) / len(x))
