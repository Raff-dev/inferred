import redis
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings

SENSORS_CHANNEL_NAME = "sensors"


class SensorDataConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = None
        self.pubsub = None

    async def connect(self):
        await self.accept()
        self.client = redis.Redis(
            host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0
        )
        self.pubsub = self.client.pubsub()
        self.pubsub.subscribe(SENSORS_CHANNEL_NAME)

        for message in self.pubsub.listen():
            if message["type"] == "message":
                await self.send_json(message["data"])

    async def disconnect(self, _):
        self.pubsub.unsubscribe("sensors")
        self.client.close()
