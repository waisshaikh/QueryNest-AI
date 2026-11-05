import { Server } from "socket.io"

let io;

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    "https://query-nest-ai.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean);

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error(`Origin ${origin} is not allowed by CORS`));
            },
            credentials: true
        }
    })

    console.log("socket io server is runnig")

    io.on("connection", (socket) => {
        console.log("A User Connected" + socket.id)
    })
}

export function getIo() {
    if (!io) {
        throw new Error("Socket.io is not initialized")
    }

    return io
}
