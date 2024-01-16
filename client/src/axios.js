import axios from "axios";

const instance = axios.create({
  // baseURL: "http://15.164.28.18:8080",
  withCredentials: true,
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
