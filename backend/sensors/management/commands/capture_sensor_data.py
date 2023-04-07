import json
from typing import Generator

import redis
from django.conf import settings
from django.core.management.base import BaseCommand

from sensors.consumers import SENSORS_CHANNEL_NAME
from sensors.tasks import process_sensors_reads


def redis_queue(channel_name: str) -> Generator:
    r = redis.Redis(
        host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB
    )
    p = r.pubsub()
    p.subscribe(channel_name)
    for message in p.listen():
        if message["type"] != "message":
            continue

        data = message["data"].decode("utf-8")
        data = json.loads(data)
        yield data


class Command(BaseCommand):
    help = "Capture sensor data from redis."

    def handle(self, *_, **__):
        for data in redis_queue(SENSORS_CHANNEL_NAME):
            process_sensors_reads.delay(data)
