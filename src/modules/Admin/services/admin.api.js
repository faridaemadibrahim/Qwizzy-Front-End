import api from "../../../API/axiosInstance";

export const createQuiz = (data) => {
    return api.post("quizzes", data);
};

export const createQuestion = (data) => {
    return api.post("questions", data);
};

export const updateQuiz = (id, data) => {
    return api.put(`quizzes/${id}`, data);
};
export const createQuestionOption = (data) => {
    return api.post("question-options", data);
};

export const getOptionsByQuestionId = (id) => {
    return api.get(`question-options/question/${id}`);
};

export const deleteQuestion = (id) => {
    return api.delete(`questions/${id}`);
};

export const deleteQuiz = (id) => {
    return api.delete(`quizzes/${id}`);
};


