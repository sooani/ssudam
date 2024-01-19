import { useEffect } from "react";
import axios from "axios";
import { logout } from "./features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const useAxiosInstance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const instance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
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

    const responseInterceptor = instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            dispatch(logout());
            navigate("/");
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // 컴포넌트가 언마운트될 때 인터셉터 정리
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, navigate]);

  return instance;
};

export default useAxiosInstance;
