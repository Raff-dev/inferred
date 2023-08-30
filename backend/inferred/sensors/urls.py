from django.urls import include, path
from rest_framework.routers import DefaultRouter

from inferred.sensors.views import (
    DimensionViewSet,
    SensorPredictionsViewSet,
    SensorReadViewSet,
    SimulationModelViewSet,
)

router = DefaultRouter()
router.register("", SensorPredictionsViewSet, basename="sensor_predictions")
router.register("simulation_models", SimulationModelViewSet)
router.register("dimensions", DimensionViewSet)
router.register("sensor_reads", SensorReadViewSet, basename="sensor_reads")

urlpatterns = [
    path("", include(router.urls)),
]
