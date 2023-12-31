# select timestamp, some sensor read and its predictions
# timestamp1, sensor1, prediction1
"""
SELECT
    sm.name as "Model",
    sr.id as "Sensor Read Id",
    to_char(sr.timestamp, 'HH24:MI:SS') as "Read Timestamp",
    sr.value as "Sensor Read Value",
    to_char(sr.timestamp + ((sm.interval * pr.offset) || ' milliseconds')::INTERVAL, 'HH24:MI:SS') as "Prediction Timestamp",
    pr.id as "Prediction Id",
    pr.value as "Prediction Value"
FROM sensors_prediction p
INNER JOIN sensors_simulationmodel sm on p.simulation_model_id = sm.id
INNER JOIN sensors_sensorread sr on p.read_id = sr.id
INNER JOIN sensors_predictionread pr on p.id = pr.prediction_id
WHERE sm.name='naive'
ORDER BY sr.timestamp ASC
LIMIT 10;
"""
from django.db import models


class Sensor(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:
        return f"{self.name}"


class SensorRead(models.Model):
    timestamp = models.DateTimeField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.timestamp} - {self.sensor.name}: {self.value}"

    class Meta:
        ordering = ["timestamp", "sensor"]
        indexes = [
            models.Index(fields=["timestamp", "sensor"]),
        ]


class SimulationModel(models.Model):
    name = models.CharField(max_length=255, unique=True)
    interval = models.IntegerField(default=1000)

    def __str__(self) -> str:
        return f"{self.name}"


class Prediction(models.Model):
    simulation_model = models.ForeignKey(SimulationModel, on_delete=models.CASCADE)
    read = models.ForeignKey(SensorRead, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.simulation_model.name} - {self.read.sensor.name}: {self.read.timestamp} prediction"

    class Meta:
        ordering = ["simulation_model", "read"]
        constraints = [
            models.UniqueConstraint(
                fields=["simulation_model", "read"],
                name="unique_simulation_prediction",
            )
        ]
        indexes = [
            models.Index(fields=["read"]),
        ]


class PredictionRead(models.Model):
    value = models.DecimalField(max_digits=10, decimal_places=2)
    offset = models.IntegerField()
    prediction = models.ForeignKey(
        Prediction, on_delete=models.CASCADE, related_name="prediction_reads"
    )

    def __str__(self) -> str:
        return f"{self.prediction.simulation_model.name} - {self.prediction.read.sensor.name}: {self.offset}"

    class Meta:
        ordering = ["offset", "prediction"]
        constraints = [
            models.UniqueConstraint(
                fields=["prediction", "offset"],
                name="unique_prediction_read",
            )
        ]
        indexes = [
            models.Index(fields=["prediction", "offset"]),
        ]
