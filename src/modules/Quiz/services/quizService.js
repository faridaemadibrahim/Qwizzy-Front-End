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

export const getQuestionsByQuizId = (id) => {
    // Nested route: get all questions belonging to a specific quiz
    return api.get(`/quizzes/${id}/questions`);
};