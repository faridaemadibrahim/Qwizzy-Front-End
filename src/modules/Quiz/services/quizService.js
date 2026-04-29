import api from "../../../API/axiosInstance.js";

export const getAllQuizzes = () => {
    return api.get("/quizzes");
};
export const getUserStates = () => {
    return api.get(`/users/stats`);
};
export const getQuizById = (id) => {
    return api.get(`/quizzes/${id}`);
};