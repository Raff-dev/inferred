# Register your models here.
from django.contrib import admin

from sensors.models import Dimension, Prediction, Tick

admin.site.register(Dimension)
admin.site.register(Prediction)
admin.site.register(Tick)
