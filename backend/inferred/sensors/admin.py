# Register your models here.
from django.contrib import admin

from inferred.sensors.models import (
    Dimension,
    Prediction,
    PredictionRead,
    SensorRead,
    SimulationModel,
)

admin.site.register(Dimension)
admin.site.register(Prediction)
admin.site.register(PredictionRead)
admin.site.register(SensorRead)
admin.site.register(SimulationModel)
