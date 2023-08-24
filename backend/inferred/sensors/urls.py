from django.urls import include, path
from rest_framework.routers import DefaultRouter

from inferred.sensors.views import SensorPredictionsViewSet, SimulationModelViewSet

router = DefaultRouter()
router.register("", SensorPredictionsViewSet, basename="sensor_predictions")
router.register("simulation_models", SimulationModelViewSet)
router.register("dimensions", SimulationModelViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
