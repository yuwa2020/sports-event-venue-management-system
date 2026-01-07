import axios from 'axios';

const GATEWAY_URL = 'https://gateway-service-latest-zbc3.onrender.com';

interface AuthPayload {
  email: string;
  password: string;
  role?: string;
  captchaToken: string;
}

interface RegisterPayload extends AuthPayload {
  username: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  requires2FA?: boolean;
  authUrl?: string; 
}

export const registerUser = async (userData: RegisterPayload) => {
  return axios.post(`${GATEWAY_URL}/register`, userData, {
    withCredentials: true,
  });
};

export const loginUser = async (userData: AuthPayload) => {
  return axios.post<LoginResponse>(`${GATEWAY_URL}/login`, userData, {
    withCredentials: true,
  });
};

export const verifyDuo = (payload: {
  code: string | null;
  state: string | null;
}) => {
  return axios.post(`${GATEWAY_URL}/duo/callback`, payload, {
    withCredentials: true,
  });
};
