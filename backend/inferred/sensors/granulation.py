from abc import ABCMeta, abstractmethod
from typing import Any, Callable, List, TypedDict

from inferred.sensors.utils import aware_timestamp

# pylint: disable=arguments-renamed


class ReadsData(TypedDict):
    timestamp: str
    value: str


class Granulation(metaclass=ABCMeta):
    subclasses = {}
    name: str = "Hehe"
    label: str = None
    param: str = None

    def __init_subclass__(cls, **kwargs: Any):
        super().__init_subclass__(**kwargs)

        for attr in ["name", "label", "param"]:
            assert hasattr(cls, attr), f"GranulationBase subclasses must have a {attr}"

        if cls.name in Granulation.subclasses:
            raise ValueError(f"GranulationBase subclass {cls.name} already exists")

        Granulation.subclasses[cls.name] = cls

    def __init__(self, data: ReadsData):
        self.data = data
        self.data_values = [float(read["value"]) for read in data]
        self.data_len = len(self.data_values)
        self.start_timestamp = data[0]["timestamp"]
        self.end_timestamp = data[-1]["timestamp"]

    def _generate_evenly_divided_timestamps(self, n: int) -> list:
        start = aware_timestamp(self.start_timestamp)
        end = aware_timestamp(self.end_timestamp)

        delta = (end - start) / (n - 1)
        timestamps = [start + i * delta for i in range(n)]

        return [timestamp.strftime("%Y-%m-%d %H:%M:%S") for timestamp in timestamps]

    @classmethod
    def choices(cls):
        return [
            {"name": sub.name, "label": sub.label}
            for sub in Granulation.subclasses.values()
        ]

    def compute(self, extra_param: int = None):
        granulated_values = self.granulation(extra_param)
        if len(granulated_values) < 2:
            raise ValueError("Granulation resulted in no values")

        len_granulated_values = len(granulated_values)
        timestamps = self._generate_evenly_divided_timestamps(len_granulated_values)
        granulated_data = [
            {"timestamp": timestamp, "value": value}
            for timestamp, value in zip(timestamps, granulated_values)
        ]

        return granulated_data

    @abstractmethod
    def granulation(self, extra_param: int = None) -> List[float]:
        ...


class NoGranulation(Granulation):
    name = "none"
    label = "None"
    param = "none"

    def compute(self, extra_param: int = None):
        return self.data

    def granulation(self, extra_param: int = None) -> List[float]:
        ...


class DownsamplingGranulation(Granulation):
    name = "downsampling"
    label = "Downsampling"
    param = "factor"

    def granulation(self, factor: int) -> List[float]:
        if factor is None:
            factor = 2

        result = self.data_values[::factor]
        return result


class MovingAverageGranulation(Granulation):
    name = "moving_average"
    label = "Moving Average"

    def granulation(self, window_size: int) -> List[float]:
        if window_size is None:
            window_size = 5

        result = []
        for i in range(self.data_len - window_size + 1):
            window = self.data_values[i : i + window_size]
            average = sum(window) / window_size
            result.append(average)

        return result


class PAAGranulationMixin:
    param = "segment_size"

    def _paa(
        self, segment_size: int, operation: Callable[[List[float]], float]
    ) -> List[float]:
        if segment_size is None:
            segment_size = 3

        paa_data = [
            operation(self.data_values[i : i + segment_size])
            for i in range(0, self.data_len, segment_size)
        ]
        return paa_data


class PAAminGranulation(PAAGranulationMixin, Granulation):
    name = "paa_min"
    label = "Piecewise Aggregate Approximation - MIN"

    def granulation(self, segment_size: int) -> List[float]:
        return self._paa(segment_size, min)


class PAAmaxGranulation(PAAGranulationMixin, Granulation):
    name = "paa_max"
    label = "Piecewise Aggregate Approximation - MAX"

    def granulation(self, segment_size: int) -> List[float]:
        return self._paa(segment_size, max)


class PAAavgGranulation(PAAGranulationMixin, Granulation):
    name = "paa_avg"
    label = "Piecewise Aggregate Approximation - AVG"

    def granulation(self, segment_size: int) -> List[float]:
        return self._paa(segment_size, lambda x: sum(x) / len(x))
