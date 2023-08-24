from datetime import timedelta

from celery import shared_task

from inferred.sensors.models import Dimension, Prediction, SimulationModel, Tick
from inferred.sensors.utils import aware_timestamp


@shared_task
def process_sensors_reads(data):
    """
    {
        "timestamp": "2021-09-01T00:00:00Z",
        "prediction_interval": 1000, # milliseconds
        "sensors": {
            "sensor_0": {
                "value" 0.5,
                "prediction": [0.5, 0.5, ...]
            }
            "sensor_1": {
                "value" 0.5,
                "prediction": [0.5, 0.5, ...]
            }
            ...
        },
    }
    """
    timestamp_str = data["timestamp"]
    sensors = data["sensors"]
    prediction_interval = data["prediction_interval"]
    simulation_model_name = data["simulation_model"]
    timestamp = aware_timestamp(timestamp_str)

    simulation_model, _ = SimulationModel.objects.get_or_create(
        name=simulation_model_name
    )

    ticks = []
    for sensor_name, sensor_data in sensors.items():
        sensor_value = sensor_data["value"]
        prediction_values = sensor_data["prediction"]

        dimension, _ = Dimension.objects.get_or_create(name=sensor_name)
        ticks.append(
            Tick(
                timestamp=timestamp,
                value=sensor_value,
                dimension=dimension,
            )
        )

        prediction = Prediction.objects.create(
            simulation_model=simulation_model,
            dimension=dimension,
            start_timestamp=timestamp,
        )

        for prediction_value in prediction_values:
            timestamp += timedelta(milliseconds=prediction_interval)
            ticks.append(
                Tick(
                    timestamp=timestamp,
                    value=prediction_value,
                    dimension=dimension,
                    prediction=prediction,
                )
            )

    Tick.objects.bulk_create(ticks)
