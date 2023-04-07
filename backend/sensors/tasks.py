from datetime import datetime, timedelta

from celery import shared_task

from sensors.models import Dimension, Prediction, SimulationModel, Tick


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
    timestamp = data["timestamp"]
    sensors = data["sensors"]
    prediction_interval = data["prediction_interval"]
    simulation_model_name = data["simulation_model"]

    simulation_model, _ = SimulationModel.objects.get_or_create(
        name=simulation_model_name
    )

    ticks = []
    for sensor_name, sensor_data in sensors.items():
        sensor_value = sensor_data["value"]
        prediction_values = sensor_data["prediction"]

        dimension, _ = Dimension.objects.get_or_create(name=sensor_name)
        ticks.append(Tick(timestamp=timestamp, value=sensor_value, dimension=dimension))

        prediction = Prediction.objects.create(
            simulation_model=simulation_model,
            dimension=dimension,
            start_timestamp=timestamp,
        )

        current_timestamp = datetime.fromisoformat(timestamp)
        for prediction_value in prediction_values:
            current_timestamp += timedelta(milliseconds=prediction_interval)
            ticks.append(
                Tick(
                    timestamp=current_timestamp,
                    value=prediction_value,
                    dimension=dimension,
                    prediction=prediction,
                )
            )

    Tick.objects.bulk_create(ticks)
