from rest_framework import serializers

from inferred.sensors.models import Dimension, SimulationModel, Tick


class DimensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dimension
        fields = ["name"]


class SimulationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationModel
        fields = ["name"]


class TickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tick
        fields = ["timestamp", "value"]
