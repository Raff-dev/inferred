import json
from typing import Generator

from django.core.management.base import BaseCommand

from inferred.sensors.consumers import SENSORS_CHANNEL_NAME
from inferred.sensors.tasks import process_sensors_reads
from inferred.sensors.utils import create_redis_client


def redis_queue(channel_name: str) -> Generator:
    client = create_redis_client()
    p = client.pubsub()
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
