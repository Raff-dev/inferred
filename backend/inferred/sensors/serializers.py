from rest_framework import serializers

from inferred.sensors.models import Dimension, PredictionRead, SimulationModel


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
