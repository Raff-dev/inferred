import datetime

from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from inferred.sensors.models import Dimension, Prediction, SimulationModel
from inferred.sensors.serializers import (
    DimensionSerializer,
    SimulationModelSerializer,
    TickSerializer,
)


class DimensionViewSet(viewsets.ModelViewSet):
    queryset = Dimension.objects.all()
    serializer_class = DimensionSerializer


class SimulationModelViewSet(viewsets.ModelViewSet):
    queryset = SimulationModel.objects.all()
    serializer_class = SimulationModelSerializer


class SensorPredictionsViewSet(viewsets.ViewSet):
    """
    A viewset that provides predictions for a given sensor and simulation model.
    """

    @action(detail=False, methods=["GET"])
    def sensor_predictions(self, request: Request):
        simulation_model_name = request.query_params.get("simulation_model")
        dimension_name = request.query_params.get("dimension")
        start_timestamp = request.query_params.get("start_timestamp")
        duration_s = int(request.query_params.get("duration_s"))

        simulation_model = get_object_or_404(
            SimulationModel, name=simulation_model_name
        )
        dimension = get_object_or_404(Dimension, name=dimension_name)
        start_timestamp = datetime.datetime.strptime(
            start_timestamp, "%Y-%m-%d %H:%M:%S"
        )
        delta_time = datetime.timedelta(seconds=duration_s)

        predictions = Prediction.objects.filter(
            simulation_model=simulation_model,
            dimension=dimension,
            start_timestamp__gte=start_timestamp,
            start_timestamp__lte=start_timestamp + delta_time,
        ).prefetch_related("ticks")

        ticks = [pred.ticks.first() for pred in predictions]
        result = TickSerializer(ticks, many=True).data
        return Response(result)
