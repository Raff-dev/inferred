import datetime
import json
from collections import defaultdict
from queue import Queue
from threading import Event, Thread
from typing import Any

from channels.generic.websocket import WebsocketConsumer

from inferred.sensors import utils
from inferred.sensors.models import SensorRead
from inferred.sensors.utils import create_redis_client

SENSORS_CHANNEL_NAME = "sensors"


def get_grouped_sensor_data() -> tuple[list[dict[str, Any]], list[str]]:
    two_hours_ago = utils.aware_now() - datetime.timedelta(hours=2)
    reads = SensorRead.objects.filter(timestamp__gte=two_hours_ago)
    sensor_data = reads.order_by("timestamp").values(
        "timestamp", "value", "sensor__name"
    )

    sensors = set()
    grouped_data = defaultdict(lambda: defaultdict(dict))
    for item in sensor_data:
        timestamp = item["timestamp"].isoformat()
        sensor = item["sensor__name"]
        sensors.add(sensor)
        value = float(item["value"])

        if "timestamp" not in grouped_data[timestamp]:
            grouped_data[timestamp]["timestamp"] = timestamp

        grouped_data[timestamp][sensor] = value

    sensors_sorted = sorted(sensors, key=lambda x: int(x.split("_")[1]))
    return list(grouped_data.values()), sensors_sorted


class SensorDataConsumer(WebsocketConsumer):
    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self.client = None
        self.pubsub = None

        self.queue = Queue()
        self.stop_event = Event()

    def connect(self):
        self.accept()
        self.client = create_redis_client()
        self.pubsub = self.client.pubsub()
        self.pubsub.subscribe(SENSORS_CHANNEL_NAME)

        thread = Thread(target=self.listen)
        thread.start()

    def disconnect(self, _):
        self.stop_event.set()
        self.pubsub.unsubscribe(SENSORS_CHANNEL_NAME)
        self.client.close()

    def listen(self):
        reads, sensors = get_grouped_sensor_data()
        past_data = {
            "reads": reads,
            "past": True,
            "sensors": sensors,
        }
        json_str_past_data = json.dumps(past_data)
        self.send(json_str_past_data)

        while self.pubsub.subscribed:
            response = self.pubsub.handle_message(
                self.pubsub.parse_response(block=True)
            )

            if self.stop_event.is_set():
                return

            if response is None:
                continue

            print(f"New message: {datetime.datetime.now()}")
            if response["type"] == "message":
                data = response["data"].decode("utf-8")
                self.send(data)
