import axios from "axios"

const getChatBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    if (url.endsWith('/api')) {
        url = url.replace(/\/api\/?$/, '');
    }
    return url;
};

const api = axios.create({
    baseURL: getChatBaseUrl(),
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const sendMessage = async ({ message, chatId }) => {
    const response = await api.post("/api/chats/message", { message, chat: chatId });
    return response.data;
}

export const getChats = async () => {
    const response = await api.get("/api/chats");
    return response.data;
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}/messages`);
    return response.data;
}


