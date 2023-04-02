from channels.generic.websocket import AsyncJsonWebsocketConsumer

from sensors.tasks import get_redis_connection


class SensorDataConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = None
        self.pubsub = None

    async def connect(self):
        await self.accept()
        self.client, self.pubsub = get_redis_connection()

        for message in self.pubsub.listen():
            if message["type"] == "message":
                await self.send_json(message["data"])

    async def disconnect(self, _):
        self.pubsub.unsubscribe("sensors")
        self.client.close()
