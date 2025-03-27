import axios from "axios";

let baseURL = "";
const host = window.location.hostname;

if (host === "localhost") {
    baseURL = "http://localhost:8081/";
} else {
    baseURL = "http://192.168.31.146:8081/"; 
}

let http = axios.create({
    baseURL: baseURL
});

http.interceptors.request.use(config => {
    let token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
