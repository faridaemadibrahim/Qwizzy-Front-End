import api from "../../../API/axiosInstance.js";

export const getAllQuizzes = () => {
    return api.get("/quizzes");
};
export const getUserStats = () => {
    return api.get(`/users/stats`);
};