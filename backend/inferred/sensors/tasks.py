from celery import shared_task

from inferred.sensors.models import (
    Dimension,
    Prediction,
    PredictionRead,
    SensorRead,
    SimulationModel,
)
from inferred.sensors.utils import aware_timestamp


@shared_task
def process_sensors_reads(data):
    # pylint: disable=too-many-locals
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
    simulation_model = SimulationModel.objects.get(name=simulation_model_name)

    prediction_reads = []
    for sensor_name, sensor_data in sensors.items():
        sensor_value = sensor_data["value"]
        prediction_values = sensor_data["prediction"]

        dimension = Dimension.objects.get(name=sensor_name)
        read = SensorRead.objects.create(
            timestamp=timestamp,
            value=sensor_value,
            dimension=dimension,
        )

        prediction = Prediction.objects.create(
            simulation_model=simulation_model,
            read=read,
            interval=prediction_interval,
        )

        for index, prediction_value in enumerate(prediction_values):
            prediction_reads.append(
                PredictionRead(
                    value=prediction_value,
                    prediction=prediction,
                    offset=index,
                )
            )

    PredictionRead.objects.bulk_create(prediction_reads)
