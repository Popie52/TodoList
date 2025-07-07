import axios from 'axios';

const baseUrl = `/api/comments`;

let token = null;

const setToken = (value) => {
  if (value) token = value;
};
const clearToken = () => (token = null);


// export default {setToken, clearToken };
