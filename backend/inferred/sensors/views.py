import datetime
from collections import defaultdict

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

    @action(detail=False, methods=["GET"])
    def model_predictions_comparison(self, request: Request):
        params = ComparisonQueryParams(request)
        simulation_models = SimulationModel.objects.filter(
            name__in=params.sim_model_names
        )
        dimension = get_object_or_404(Dimension, name=params.dim_name)
        params.start_timestamp = aware_timestamp(params.start_timestamp)
        delta_time = datetime.timedelta(seconds=params.duration)

        reads = (
            SensorRead.objects.filter(
                timestamp__gte=params.start_timestamp,
                timestamp__lte=params.start_timestamp + delta_time,
                dimension=dimension,
            )
            .order_by("timestamp")
            .select_related("prediction")
        )

        predictions = Prediction.objects.filter(
            read__in=reads, simulation_model__in=simulation_models
        )

        read_data = reads.values("timestamp", "value")
        prediction_reads = (
            PredictionRead.objects.filter(prediction__in=predictions, offset=0)
            .select_related("prediction")
            .values("value", "prediction__simulation_model__name")
        )

        models = defaultdict(list)
        for value in prediction_reads:
            model_name = value["prediction__simulation_model__name"]
            models[model_name].append(value["value"])

        result = {
            "reads": [value["value"] for value in read_data],
            "timestamps": [value["timestamp"] for value in read_data],
            "models": models,
        }
        return Response(result)


class ComparisonQueryParams:
    def __init__(self, request: Request):
        self.sim_model_names = request.query_params.getlist("simulation_models[]", [])
        self.dim_name = request.query_params.get("dimension")
        self.start_timestamp = request.query_params.get("start_timestamp")
        self.duration = int(request.query_params.get("duration"))
