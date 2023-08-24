from rest_framework import serializers

from inferred.sensors.models import Dimension, SimulationModel


class DimensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dimension
        fields = ["name"]


class SimulationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationModel
        fields = ["name"]
