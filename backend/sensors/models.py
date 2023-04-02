from django.db import models


class Dimension(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"


class Prediction(models.Model):
    dimension = models.ForeignKey(Dimension, on_delete=models.CASCADE)
    start_timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.dimension.name} - {self.start_timestamp}"


class Tick(models.Model):
    timestamp = models.DateTimeField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    dimension = models.ForeignKey(Dimension, on_delete=models.CASCADE)
    prediction = models.ForeignKey(Prediction, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.timestamp} - {self.dimension.name}: {self.value}"
