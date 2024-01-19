import axios from "axios";
import { logout } from "./features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// const instance = axios.create({
//   baseURL: "http://localhost:8080",
//   withCredentials: true,
// });

// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("Authorization");

//     if (token) {
//       config.headers.Authorization = token;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//       }
//     }

//     return Promise.reject(error);
//   }
// );

const useAxiosInterceptors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const instance = axios.create({
    baseURL: "http://localhost:8080",
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

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          alert("세션이 만료되어 로그아웃 되었습니다!");
          localStorage.removeItem("Authorization");
          dispatch(logout());
          navigate("/");
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
export { useAxiosInterceptors };
// export default instance;
