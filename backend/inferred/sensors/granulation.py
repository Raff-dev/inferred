from abc import ABCMeta, abstractmethod
from typing import Any, Callable, TypedDict

from inferred.sensors.utils import aware_timestamp


class ReadsData(TypedDict):
    timestamp: str
    value: str


class Granulation(metaclass=ABCMeta):
    subclasses = {}
    name: str = None
    label: str = None
    param: str = None
    param_choices: list = None
    param_default: int = None

    def __init_subclass__(cls, **kwargs: Any):
        super().__init_subclass__(**kwargs)

        for attr in ["name", "label", "param", "param_choices"]:
            message = f"{cls.__name__}: '{attr}' is required in Granulation subclass"
            assert getattr(cls, attr) is not None, message

        if cls.name in Granulation.subclasses:
            raise ValueError(f"GranulationBase subclass '{cls.name}' already exists")

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
            {
                "name": sub.name,
                "label": sub.label,
                "param": sub.param,
                "param_default": sub.param_default,
                "param_choices": sub.param_choices,
            }
            for sub in Granulation.subclasses.values()
        ]

    def compute(self, param: int):
        granulated_values = self.granulation(param or self.param_default)
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
    def granulation(self, param: int) -> list[float]:
        ...


class NoGranulation(Granulation):
    name = "none"
    label = "None"
    param = "None"
    param_choices = []
    param_default = ""

    def compute(self, param: int):
        return self.data

    def granulation(self, param: int) -> list[float]:
        ...


class DownsamplingGranulation(Granulation):
    name = "downsampling"
    label = "Downsampling"
    param = "Factor"
    param_choices = [2, 3, 4, 5, 6, 7, 8, 9, 10]
    param_default = 2

    def granulation(self, param: int) -> list[float]:
        factor = param
        result = self.data_values[::factor]
        return result


class MovingAverageGranulation(Granulation):
    name = "moving_average"
    label = "Moving Average"
    param = "Window Size"
    param_choices = [2, 3, 5, 8, 13, 21, 34, 55]
    param_default = 5

    def granulation(self, param: int) -> list[float]:
        window_size = param

        result = []
        for i in range(self.data_len - window_size + 1):
            window = self.data_values[i : i + window_size]
            average = sum(window) / window_size
            result.append(average)

        return result


class PAAGranulationMixin:
    param = "Segment Size"
    param_choices = [2, 3, 4, 5, 6, 7, 8, 9, 10]
    param_default = 3

    def _paa(
        self, param: int, operation: Callable[[list[float]], float]
    ) -> list[float]:
        segment_size = param

        result = []
        for i in range(0, self.data_len, segment_size):
            segment_data = self.data_values[i : i + segment_size]
            aggregate = operation(segment_data)
            result.append(aggregate)

        return result


class PAAminGranulation(PAAGranulationMixin, Granulation):
    name = "paa_min"
    label = "Piecewise Aggregate Approximation - MIN"

    def granulation(self, param: int) -> list[float]:
        segment_size = param
        return self._paa(segment_size, min)


class PAAmaxGranulation(PAAGranulationMixin, Granulation):
    name = "paa_max"
    label = "Piecewise Aggregate Approximation - MAX"

    def granulation(self, param: int) -> list[float]:
        segment_size = param
        return self._paa(segment_size, max)


class PAAavgGranulation(PAAGranulationMixin, Granulation):
    name = "paa_avg"
    label = "Piecewise Aggregate Approximation - AVG"

    def granulation(self, param: int) -> list[float]:
        segment_size = param
        return self._paa(segment_size, lambda x: sum(x) / len(x))
