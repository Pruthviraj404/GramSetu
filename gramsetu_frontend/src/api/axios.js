import axios from "axios";


const API = axios.create({
    baseURL:import.meta.env.VITE_API_URL || "http://localhost:8081",
    headers:{
        "Content-Type":"application/json",
    },
});


API.interceptors.request.use(
    (config)=>{
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


API.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if(error.response?.status===401){
            localStorage.clear();
            window.location.href="/login";
        }
        return Promise.reject(error);
    }
);

export default API;