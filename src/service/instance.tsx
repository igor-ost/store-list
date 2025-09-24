import { API_URL } from '@/service/config';
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const axiosInstanceFormData = axios.create({
    baseURL: API_URL,
})