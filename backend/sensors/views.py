# Create your views here.

import json

import redis
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from sensors.consumers import SENSORS_CHANNEL_NAME
from sensors.tasks import process_sensors_reads


@csrf_exempt
def sensor_reads(request):
    if request.method == "POST":
        client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
        data = json.loads(request.body)
        client.publish(SENSORS_CHANNEL_NAME, data)
        client.close()
        process_sensors_reads.delay(data)
        return HttpResponse(status=HTTP_200_OK)
    return HttpResponse(status=HTTP_400_BAD_REQUEST)
