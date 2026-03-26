import axios from "axios";
import { setupInterceptorsTo } from "./interceptors";

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://easykosbackend-production.up.railway.app/api";

const ensureApiSuffix = (url = "") => {
  const trimmedUrl = url.trim().replace(/\/+$/, "");
  return /\/api$/i.test(trimmedUrl) ? trimmedUrl : `${trimmedUrl}/api`;
};

export const createAxiosInstance = (options = {}, axiosConfig = {}) => {
  const baseUrl = ensureApiSuffix(DEFAULT_API_URL);

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
