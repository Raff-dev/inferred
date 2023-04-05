import redis
from django.conf import settings
from django.core.management.base import BaseCommand

from sensors.consumers import SENSORS_CHANNEL_NAME
from sensors.tasks import process_sensors_reads


class Command(BaseCommand):
    help = "Capture sensor data from redis."

    def handle(self, *_, **__):
        r = redis.Redis(
            host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB
        )
        p = r.pubsub()
        p.subscribe(SENSORS_CHANNEL_NAME)
        for message in p.listen():
            if message["type"] != "message":
                continue

            print(f"New message: {message}")
            data = message["data"].decode("utf-8")
            process_sensors_reads.delay(data)
