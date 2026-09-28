import axios from 'axios';

const getAuthBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
    if (!url.endsWith('/api')) {
        url = url.replace(/\/$/, '') + '/api';
    }
    return url;
};

const api = axios.create({
    baseURL: getAuthBaseUrl(),
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({ username, email, password }) {
   const response = await api.post('/auth/register', { username, email, password });
    return response.data;        
}

export async function login({ email, password }) {
   const response = await api.post('/auth/login', { email, password });
    return response.data;        

}

export async function getme() {
   const response = await api.get('/auth/get-me');
    return response.data;        
}

export async function logout() {
   const response = await api.get('/auth/logout');
    return response.data;        
}



