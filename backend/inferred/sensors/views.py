import datetime

from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from inferred.sensors.models import (
    Dimension,
    Prediction,
    PredictionRead,
    SensorRead,
    SimulationModel,
)
from inferred.sensors.serializers import DimensionSerializer, SimulationModelSerializer
from inferred.sensors.utils import aware_timestamp


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
        sim_model_name = request.query_params.get("simulation_model")
        dim_name = request.query_params.get("dimension")
        start_timestamp = request.query_params.get("start_timestamp")
        duration = int(request.query_params.get("duration"))

        simulation_model = get_object_or_404(SimulationModel, name=sim_model_name)
        dimension = get_object_or_404(Dimension, name=dim_name)
        start_timestamp = aware_timestamp(start_timestamp)
        delta_time = datetime.timedelta(seconds=duration)

        reads = (
            SensorRead.objects.filter(
                timestamp__gte=start_timestamp,
                timestamp__lte=start_timestamp + delta_time,
                dimension=dimension,
            )
            .order_by("timestamp")
            .select_related("prediction")
        )

        predictions = Prediction.objects.filter(
            read__in=reads, simulation_model=simulation_model
        )

        prediction_reads = PredictionRead.objects.filter(
            prediction__in=predictions, offset=0
        ).values("prediction__read__timestamp", "value")
        return Response(prediction_reads)
