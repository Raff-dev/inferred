import datetime
from collections import defaultdict

from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from inferred.sensors.granulation import Granulation, NoGranulation
from inferred.sensors.models import (
    Prediction,
    PredictionRead,
    Sensor,
    SensorRead,
    SimulationModel,
)
from inferred.sensors.serializers import (
    SensorReadSerializer,
    SensorSerializer,
    SimulationModelSerializer,
)
from inferred.sensors.utils import ComparisonQueryParams, PredictionTimelineQueryParams


class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer


class SimulationModelViewSet(viewsets.ModelViewSet):
    queryset = SimulationModel.objects.all()
    serializer_class = SimulationModelSerializer


class SensorPredictionsViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["GET"])
    def model_predictions_comparison(self, request: Request):
        params = ComparisonQueryParams(request)
        simulation_models = SimulationModel.objects.filter(
            name__in=params.sim_model_names
        )
        sensor = get_object_or_404(Sensor, name=params.dim_name)

        delta_time = datetime.timedelta(seconds=params.duration + params.horizon)
        reads = SensorRead.objects.filter(
            timestamp__gte=params.start_timestamp,
            timestamp__lte=params.start_timestamp + delta_time,
            sensor=sensor,
        ).order_by("timestamp")

        if not reads.exists():
            return Response({"reads": [], "timestamps": [], "models": {}})

        offset = min(params.horizon, len(reads) - 1)
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

    @action(detail=False, methods=["GET"])
    def prediction_timeline(self, request: Request) -> Response:
        params = PredictionTimelineQueryParams(request)
        predictions = (
            Prediction.objects.filter(
                read__timestamp__gte=params.from_timestamp,
                read__timestamp__lte=params.to_timestamp,
                read__sensor__name=params.dim_name,
                simulation_model__name=params.sim_model_name,
            )
            .prefetch_related("prediction_reads")
            .order_by("read__timestamp")
        )

        result = [
            {
                "start_timestamp": prediction.read.timestamp,
                "predictions": [
                    read.value for read in prediction.prediction_reads.all()
                ],
            }
            for prediction in predictions
        ]
        return Response(result)


class SensorReadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SensorRead.objects.all().order_by("timestamp")
    serializer_class = SensorReadSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "timestamp": ["gte", "lte"],
        "sensor__name": ["exact"],
    }

    def list(self, request, *args, **kwargs):
        method_name = request.query_params.get("granulation_method")
        response = super().list(request, *args, **kwargs)

        if not response.data:
            return response

        if method_name and method_name != NoGranulation.name:
            param = request.query_params.get("param", None)
            if param is not None:
                param = int(param)
            granulation_cls = Granulation.subclasses[method_name]
            granulation_data = granulation_cls(response.data).compute(param)
            response.data = granulation_data

        return response

    @action(detail=False, methods=["GET"])
    def granulation_methods(self, request: Request):
        methods = Granulation.choices()
        return Response(methods)
