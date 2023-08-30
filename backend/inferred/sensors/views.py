import datetime
from collections import defaultdict

from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
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
from inferred.sensors.serializers import (
    DimensionSerializer,
    SensorReadSerializer,
    SimulationModelSerializer,
)
from inferred.sensors.utils import ComparisonQueryParams


class DimensionViewSet(viewsets.ModelViewSet):
    queryset = Dimension.objects.all()
    serializer_class = DimensionSerializer


class SimulationModelViewSet(viewsets.ModelViewSet):
    queryset = SimulationModel.objects.all()
    serializer_class = SimulationModelSerializer


class SensorPredictionsViewSet(viewsets.ViewSet):
    OFFSET = 1

    @action(detail=False, methods=["GET"])
    def model_predictions_comparison(self, request: Request):
        params = ComparisonQueryParams(request)
        simulation_models = SimulationModel.objects.filter(
            name__in=params.sim_model_names
        )
        dimension = get_object_or_404(Dimension, name=params.dim_name)

        delta_time = datetime.timedelta(seconds=params.duration + self.OFFSET)
        reads = SensorRead.objects.filter(
            timestamp__gte=params.start_timestamp,
            timestamp__lte=params.start_timestamp + delta_time,
            dimension=dimension,
        ).order_by("timestamp")

        if not reads.exists():
            return Response({"reads": [], "timestamps": [], "models": {}})

        offset = min(self.OFFSET, len(reads) - 1)
        predictions = Prediction.objects.filter(
            read__in=reads[: len(reads) - offset],
            simulation_model__in=simulation_models,
        )

        read_data = reads.values("timestamp", "value")[offset:]
        prediction_reads = (
            PredictionRead.objects.filter(prediction__in=predictions, offset=offset)
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


class SensorReadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SensorRead.objects.all().order_by("timestamp")
    serializer_class = SensorReadSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "timestamp": ["gte", "lte"],
        "dimension__name": ["exact"],
    }
