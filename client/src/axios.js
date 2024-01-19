import axios from 'axios';
import { logout } from './features/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const instance = axios.create({
  // baseURL: 'http://3.36.145.103:8080',
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

const navigate = useNavigate();
const dispatch = useDispatch();

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Authorization');
  
    if (token) {
      config.headers.Authorization = token;
    }
  
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
  
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response ) {
      if (error.response.status === 401) {
        dispatch(logout());
        navigate('/');
      }
    }

    return Promise.reject(error);
  }
)
  

export default instance;

