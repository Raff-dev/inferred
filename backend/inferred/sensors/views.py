from rest_framework import viewsets

from inferred.sensors.models import Dimension, SimulationModel
from inferred.sensors.serializers import DimensionSerializer, SimulationModelSerializer


class DimensionViewSet(viewsets.ModelViewSet):
    queryset = Dimension.objects.all()
    serializer_class = DimensionSerializer


class SimulationModelViewSet(viewsets.ModelViewSet):
    queryset = SimulationModel.objects.all()
    serializer_class = SimulationModelSerializer
