from django.db import models


class Dimension(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.name}"


class SimulationModel(models.Model):
    name = models.CharField(max_length=255, unique=True)


class Prediction(models.Model):
    simulation_model = models.ForeignKey(SimulationModel, on_delete=models.CASCADE)
    dimension = models.ForeignKey(Dimension, on_delete=models.CASCADE)
    start_timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.dimension.name} - {self.start_timestamp}"

    class Meta:
        ordering = ["start_timestamp", "dimension"]
        constraints = [
            models.UniqueConstraint(
                "simulation_model",
                "dimension",
                "start_timestamp",
                name="unique_simulation_prediction",
            )
        ]


class Tick(models.Model):
    timestamp = models.DateTimeField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    dimension = models.ForeignKey(
        Dimension, on_delete=models.CASCADE, related_name="ticks"
    )
    prediction = models.ForeignKey(
        Prediction, on_delete=models.CASCADE, null=True, related_name="ticks"
    )

    def __str__(self):
        return f"{self.timestamp} - {self.dimension.name}: {self.value}"

    class Meta:
        ordering = ["timestamp", "dimension"]
