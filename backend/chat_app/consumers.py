# myapp/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "notifications_group"

        # Add this socket to the notifications group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Remove from group when disconnected
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # When a message is received from WebSocket client
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "Popup notification")

        # Broadcast to everyone in the group
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "broadcast_message",
                "message": message,
            }
        )

    # Send message to WebSocket
    async def broadcast_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({
            "message": message
        }))
