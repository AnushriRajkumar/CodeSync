CodeSync
A secure real-time collaborative code editor with role-based access control.

Overview
SecureCode Sync enables multiple users to collaborate on code in real time within shared rooms. It incorporates password-protected access and role-based permissions to ensure controlled collaboration.

Features
Real-time code synchronization using WebSockets

Multi-user collaboration in shared rooms

Password-protected room access

Role-based permissions (editor and viewer)

Lightweight architecture with in-memory state management

Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: FastAPI, WebSockets

How It Works
Users create or join a room using a room ID and password. Each user connects via WebSockets, allowing instant synchronization of code changes across all participants. Editing privileges are controlled through assigned roles.

Setup
git clone https://github.com/your-username/securecode-sync.git
cd securecode-sync
pip install fastapi uvicorn
uvicorn main:app --reload
Open the frontend in a browser to start collaborating.

Outcome
Developed a real-time collaborative system with secure access control, demonstrating WebSocket-based communication, state management, and role-based authorization.

Contributors
Anushri Rajkumar
Sara Yoganantham
