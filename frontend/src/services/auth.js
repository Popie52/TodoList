import axios from "axios";
// const baseUrl = '/api/'
const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const login = async (details) => {
    const result = await axios.post(`${baseUrl}/login`, details);
    return result.data; 
}

const signup = async (details) => {
    const result = await axios.post(`${baseUrl}/register`, details);
    return result.data;
}

export default {login, signup };