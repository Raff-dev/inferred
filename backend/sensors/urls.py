from django.urls import path

from sensors.views import sensor_reads

urlpatterns = [
    path("sensor-reads/", sensor_reads),
]
