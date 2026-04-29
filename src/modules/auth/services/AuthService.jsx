import api from "../../../API/axiosInstance.js";

export const registerUser = (data) => {
  return api.post("/users/signup", data);
};
export const loginUser = (data) => {
  return api.post("/users/signin", data);
};
export const verifyEmail = (payload) => {
  return api.post("/users/verify-email", payload);
};
export const forgotPassword = (email) => {
  return api.post("/users/forgot-password", { email });
};
