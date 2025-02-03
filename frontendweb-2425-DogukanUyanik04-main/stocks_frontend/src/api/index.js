import axiosRoot from 'axios';
import { JWT_TOKEN_KEY } from '../contexts/Auth.context';

const baseUrl = import.meta.env.VITE_API_URL;

export const axios = axiosRoot.create({
  baseURL: baseUrl,
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export async function getAll(url) {
  const { data } = await axios.get(url); 
  return data.items;
}

export const post = async (url, {arg}) => {
  const {data} = await axios.post(`${baseUrl}/${url}`, arg);

  return data;
};
