import {io} from "socket.io-client"

let socket = null;

const getSocketUrl = () => {
    let url = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    if (url.endsWith('/api')) {
        url = url.replace(/\/api\/?$/, '');
    }
    return url;
};

export const initializeSocketConnection = ()=>{
    // Prevent duplicate connections
    if (socket?.connected) {
        return () => {};
    }

    socket = io(getSocketUrl(), {
        withCredentials: true
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