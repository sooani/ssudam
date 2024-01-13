import axios from 'axios';

const instance = axios.create({
  // baseURL: "http://15.164.28.18:8080",
  withCredentials: true,
});

export default instance;
