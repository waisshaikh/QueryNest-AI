import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
  
});

export async function register(username,email,password) {
   const response = await api.post('api/auth/register', { username, email, password });
    return response.data;        
}

export async function login(email,password) {
   const response = await api.post('/auth/login', { email, password });
    return response.data;        

}

export async function getme() {
   const response = await api.post('api/auth/getme');
    return response.data;        
    
}