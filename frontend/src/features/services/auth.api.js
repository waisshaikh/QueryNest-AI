import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
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
