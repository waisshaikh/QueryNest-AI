import { Server } from "socket.io"

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
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