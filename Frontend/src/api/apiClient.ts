import axios from 'axios';



export const BASE_URL = 'https://gateway-service-latest-zbc3.onrender.com';

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/main/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApiClient = axios.create({
  baseURL: `${BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const emailApiClient = axios.create({
  baseURL: `${BASE_URL}/email/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const paymentApiClient = axios.create({
  baseURL: `${BASE_URL}/payments/create-checkout-session`,
  headers: {
    'Content-Type': 'application/json',
  },
});

