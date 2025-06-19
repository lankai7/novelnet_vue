import axios from "axios";

let baseURL = "";
const host = window.location.hostname;

if (host === "localhost") {
    baseURL = "http://localhost:8081";
} else {
    baseURL = "http://192.168.1.136:8081";
}

let http = axios.create({
    baseURL: baseURL
});

// 请求拦截器
http.interceptors.request.use(config => {
    let token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 确保 token 格式正确
    }
    return config;
});

// 响应拦截器
http.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (error.response.status === 401) {
                alert("请先登录！");
                localStorage.removeItem("token"); // 清除 token
                window.location.href = "/login"; // 跳转到登录页
            } else if (error.response.status === 403) {
                alert("权限不足，无法访问该页面！");
                window.location.href = "/"; // 跳转到首页
            }
        }
        return Promise.reject(error);
    }
);

export default http;
