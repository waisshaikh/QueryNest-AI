import {io} from "socket.io-client"

let socket = null;

export const initializeSocketConnection = ()=>{
    // Prevent duplicate connections
    if (socket?.connected) {
        return () => {};
    }

    socket = io("http://localhost:3000",{
        withCredentials:true
    })

    socket.on("connect",()=>{
        console.log("connected to socket.io server")
    })

    // Return cleanup function for useEffect
    return () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    }
}

export const getSocket = () => socket;