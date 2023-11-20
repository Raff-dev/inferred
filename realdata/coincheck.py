import asyncio
import json

import websockets

WS_URL = "wss://ws-feed-public.sandbox.exchange.coinbase.com"

SUBSCRIBE_MESSAGE = json.dumps(
    {
        "type": "subscribe",
        "channels": [
            "level2",
            "heartbeat",
            {
                "name": "ticker",
                "product_ids": [
                    "ETH-BTC",
                ],
            },
        ],
    }
)


async def connect_to_websocket():
    async with websockets.connect(WS_URL) as websocket:  # pylint: disable=no-member
        await websocket.send(str(SUBSCRIBE_MESSAGE))
        while True:
            response = await websocket.recv()
            print(response)


asyncio.get_event_loop().run_until_complete(connect_to_websocket())
