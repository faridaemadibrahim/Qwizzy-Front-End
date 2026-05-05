import api from "../../API/axiosInstance";

export const getAllUsers = () => {
    return api.get("users");
}