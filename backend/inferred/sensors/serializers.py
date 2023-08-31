from rest_framework import serializers

from inferred.sensors.models import (
    Dimension,
    PredictionRead,
    SensorRead,
    SimulationModel,
)


class DimensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dimension
        fields = ["name"]


class SimulationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationModel
        fields = ["name"]


class PredictionReadSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source="prediction.read.timestamp")

    class Meta:
        model = PredictionRead
        fields = ["timestamp", "value"]


class SensorReadSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = SensorRead
        fields = ["timestamp", "value"]
