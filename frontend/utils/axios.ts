import axios from "axios";
import { useAuth  } from "@/hooks/useAuth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true // มีส่วนนี้เพื่อให้มันส่งcookieข้ามกันได้
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuth.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config
})

axiosInstance.interceptors.response.use(async (response) => response, async (error) => {
  const originalRequest = error.config;
  
  if (!error.response) {
  return Promise.reject(error);
  }

  if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refreshToken")
    ) {
      return Promise.reject(error);
    }

  if (
      (error.response?.status === 401 ||
        error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`,
        );

        const newAccessToken = res.data.accessToken;
        useAuth.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch {
        useAuth.getState().clearAccessToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export {
  axiosInstance as axios
}
