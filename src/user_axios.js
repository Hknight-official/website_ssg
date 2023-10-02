import axios from 'axios';
import config_website from "./config_website.json";

const user = axios.create({
    baseURL: config_website.url,
});

// Add a request interceptor
user.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // console.log(token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default user