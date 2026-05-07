import api from "../../../API/axiosInstance.js";

export const getAllQuizzes = () => {
    return api.get("/quizzes");
};

export const getAllQuizzesWithQuestionCount = () => {
    return api.get("/quizzes/question_count/");
};

export const getUserStates = () => {
    return api.get(`/users/stats`);
};
export const getQuizById = (id) => {
    return api.get(`/quizzes/${id}`);
};

export const getCategories = () => {
    return api.get("/categories");
};

export const getQuestionsByQuizId = (id) => {
    return api.get(`/questions/quiz/${id}`);
};

export const submitQuizAttempt = (data) => {
    return api.post("/quiz-attempts/submit", data);
};

