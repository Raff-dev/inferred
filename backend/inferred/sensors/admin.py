# Register your models here.
from django.contrib import admin

from inferred.sensors.models import (
    Prediction,
    PredictionRead,
    Sensor,
    SensorRead,
    SimulationModel,
)

admin.site.register(Sensor)
admin.site.register(Prediction)
admin.site.register(PredictionRead)
admin.site.register(SensorRead)
admin.site.register(SimulationModel)
