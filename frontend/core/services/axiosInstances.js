import axios from "axios";
import { setupInterceptorsTo } from "./interceptors";

export const createAxiosInstance = (options = {}, axiosConfig = {}) => {
  const baseUrl = "https://(backendnya)/api";

  const instance = axios.create({
    baseURL: `${baseUrl}`,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    ...axiosConfig,
  });

  setupInterceptorsTo(instance, {
    disableErrorToast: true,
    ...options,
  });

  return instance;
};
