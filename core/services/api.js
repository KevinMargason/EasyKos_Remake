import { createAxiosInstance } from "./axiosInstances";
import { createHandleRequest } from "./interceptors";

const handleRequest = createHandleRequest();
const axiosInstance = createAxiosInstance();

export const auth = {

  login: (data) => handleRequest(axiosInstance.post("/login", data)),

  register: (data) => handleRequest(axiosInstance.post("/register", data)),
};

export const user = {

  // contoh getUserInfo: () => handleRequest(axiosInstance.get("/api/user/get-user-info")),
};

export const tenant = {
  
};

export const admin = {
  
};
