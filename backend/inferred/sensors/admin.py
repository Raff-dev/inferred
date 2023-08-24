# Register your models here.
from django.contrib import admin

from inferred.sensors.models import (
    Dimension,
    Prediction,
    PredictionRead,
    SimulationModel,
)

admin.site.register(SimulationModel)
admin.site.register(Dimension)
admin.site.register(Prediction)
admin.site.register(PredictionRead)
