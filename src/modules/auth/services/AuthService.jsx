import api from "../../../API/axiosInstance.js";

export const registerUser = (data) => {
  return api.post("/users/signup", data);
};
export const loginUser = (data) => {
  return api.post("/users/signin", data);
};
