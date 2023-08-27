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
        "reads": [],
        "models": {
            "model A": {
                "sensor_0": [0.5, 0.5, ...],
                "sensor_1": [0.5, 0.5, ...],
                ...
            },
            ...
        },
    }
    """
    timestamp_str = data["timestamp"]
    models = data["models"]
    timestamp = aware_timestamp(timestamp_str)
    sensor_names = data["reads"].keys()

    dimensions = {
        dimension.name: dimension
        for dimension in Dimension.objects.filter(name__in=sensor_names)
    }

    reads = {}
    for sensor_name, value in data["reads"].items():
        dimension = dimensions[sensor_name]
        reads[sensor_name] = SensorRead.objects.create(
            timestamp=timestamp,
            value=value,
            dimension=dimension,
        )

    prediction_reads = []
    model_names = models.keys()
    simulation_models = {
        simulation_model.name: simulation_model
        for simulation_model in SimulationModel.objects.filter(name__in=model_names)
    }

    for model_name, sensors in models.items():
        simulation_model = simulation_models[model_name]

        for sensor_name, sensor_data in sensors.items():
            read = reads[sensor_name]
            prediction = Prediction.objects.create(
                simulation_model=simulation_model,
                read=read,
            )

            for index, prediction_value in enumerate(sensor_data):
                prediction_reads.append(
                    PredictionRead(
                        value=prediction_value,
                        prediction=prediction,
                        offset=index,
                    )
                )

    PredictionRead.objects.bulk_create(prediction_reads)
