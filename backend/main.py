from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json

app = FastAPI()

rooms = {}
room_code = {}
room_passwords = {}


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    password = websocket.query_params.get("password", "")

    await websocket.accept()

    if room_id not in rooms:
        rooms[room_id] = []
        room_code[room_id] = ""
        room_passwords[room_id] = password

    if room_passwords[room_id] != password:
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Invalid room password"
        }))
        await websocket.close()
        return

    rooms[room_id].append(websocket)

    role = "editor" if len(rooms[room_id]) == 1 else "viewer"

    await websocket.send_text(json.dumps({
        "type": "role",
        "role": role
    }))

    await websocket.send_text(json.dumps({
        "type": "code",
        "content": room_code[room_id]
    }))

    try:
        while True:
            data = await websocket.receive_text()

            if role == "viewer":
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Viewers cannot edit code"
                }))
                continue

            room_code[room_id] = data

            message = json.dumps({
                "type": "code",
                "content": data
            })

            for connection in rooms[room_id]:
                if connection != websocket:
                    await connection.send_text(message)

    except WebSocketDisconnect:
        if room_id in rooms and websocket in rooms[room_id]:
            rooms[room_id].remove(websocket)

        if room_id in rooms and len(rooms[room_id]) == 0:
            del rooms[room_id]
            del room_code[room_id]
            del room_passwords[room_id]

