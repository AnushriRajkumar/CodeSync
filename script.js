let socket = null;
let currentRole = null;

const joinBtn = document.getElementById("joinBtn");
const editor = document.getElementById("editor");
const status = document.getElementById("status");
const roomInput = document.getElementById("roomId");
const passwordInput = document.getElementById("password");

editor.disabled = true;

joinBtn.addEventListener("click", () => {
    const roomId = roomInput.value.trim();
    const password = passwordInput.value.trim();

    if (!roomId || !password) {
        alert("Enter room ID and password");
        return;
    }

    if (socket) {
        socket.close();
    }

    status.innerText = "● Connecting...";
    status.style.color = "#facc15";

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    socket = new WebSocket(`${protocol}://127.0.0.1:8000/ws/${roomId}?password=${encodeURIComponent(password)}`);

    socket.onopen = () => {
        status.innerText = "● Connected: " + roomId;
        status.style.color = "#4ade80";
        joinBtn.disabled = true;
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "role") {
            currentRole = msg.role;

            if (currentRole === "viewer") {
                editor.disabled = true;
                status.innerText = `● Connected as viewer: ${roomId}`;
                status.style.color = "#f59e0b";
            } else {
                editor.disabled = false;
                editor.focus();
                status.innerText = `● Connected as editor: ${roomId}`;
                status.style.color = "#4ade80";
            }
        }

        if (msg.type === "code") {
            const cursorPos = editor.selectionStart;
            editor.value = msg.content;
            editor.setSelectionRange(cursorPos, cursorPos);
        }

        if (msg.type === "error") {
            alert(msg.message);
        }
    };

    socket.onerror = () => {
        status.innerText = "● Connection error";
        status.style.color = "#f87171";
    };

    socket.onclose = () => {
        status.innerText = "● Disconnected";
        status.style.color = "#f87171";
        editor.disabled = true;
        joinBtn.disabled = false;
        currentRole = null;
    };
});

editor.addEventListener("input", () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (currentRole === "viewer") return;
    socket.send(editor.value);
});



