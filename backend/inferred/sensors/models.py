from django.db import models


class Dimension(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:
        return f"{self.name}"


class SensorRead(models.Model):
    timestamp = models.DateTimeField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    dimension = models.ForeignKey(Dimension, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.timestamp} - {self.dimension.name}: {self.value}"

    class Meta:
        ordering = ["timestamp", "dimension"]
        indexes = [
            models.Index(fields=["timestamp", "dimension"]),
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
        return f"{self.simulation_model.name} - {self.read.dimension.name}: {self.read.timestamp} prediction"

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
    prediction = models.ForeignKey(Prediction, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.prediction.simulation_model.name} - {self.prediction.read.dimension.name}: {self.offset}"

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
