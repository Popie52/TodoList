import axios from "axios";
const baseUrl = `/api`;

const login = async (detail) => {
  const response = await axios.post(`${baseUrl}/login`, detail);
  return response.data;
};

const signup = async (detail) => {
    const response = await axios.post(`${baseUrl}/register`, detail);
    return response.data;
}

export default { login, signup };