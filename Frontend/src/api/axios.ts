import axios from 'axios';

const GATEWAY_URL = 'https://gateway-service-latest-zbc3.onrender.com'; // ✅ Your gateway service

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  return axios.post(`${GATEWAY_URL}/register`, userData, {
    withCredentials: true,
  });
};
