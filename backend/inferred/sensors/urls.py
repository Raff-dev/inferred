from django.urls import path

from inferred.sensors.views import sensor_reads

urlpatterns = [
    path("sensor-reads/", sensor_reads),
]
