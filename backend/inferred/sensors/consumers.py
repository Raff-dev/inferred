from datetime import datetime
from queue import Queue
from threading import Event, Thread
from typing import Any

import redis
from channels.generic.websocket import WebsocketConsumer
from django.conf import settings

SENSORS_CHANNEL_NAME = "sensors"


class SensorDataConsumer(WebsocketConsumer):
    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self.client = None
        self.pubsub = None

        self.queue = Queue()
        self.stop_event = Event()

    def connect(self):
        self.accept()
        self.client = redis.Redis(
            host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0
        )
        self.pubsub = self.client.pubsub()
        self.pubsub.subscribe(SENSORS_CHANNEL_NAME)

        thread = Thread(target=self.listen)
        thread.start()

    def disconnect(self, _):
        self.stop_event.set()
        self.pubsub.unsubscribe(SENSORS_CHANNEL_NAME)
        self.client.close()

    def listen(self):
        while self.pubsub.subscribed:
            response = self.pubsub.handle_message(
                self.pubsub.parse_response(block=True)
            )

            if self.stop_event.is_set():
                return

            if response is None:
                continue

            print(f"New message: {datetime.now()}")
            if response["type"] == "message":
                data = response["data"].decode("utf-8")
                self.send(data)
