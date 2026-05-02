import { useState, useEffect, useCallback } from "react";
import { getQuizById } from "../../Quiz/services/quizService";
import { createQuestion, updateQuiz, createQuestionOption } from "../services/admin.api";

export default function useManageQuiz(quizId) {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [creatingQuestion, setCreatingQuestion] = useState(false);

    const fetchQuizDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getQuizById(quizId);
            const data = response.data?.data || response.data;
            setQuiz(data);
            setQuestions(data.questions || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch quiz details");
        } finally {
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => {
        if (quizId) {
            fetchQuizDetails();
        }
    }, [quizId, fetchQuizDetails]);

    const handleAddQuestion = async (questionData, options) => {
        try {
            setCreatingQuestion(true);
            
            // 1. Create the question
            const qPayload = {
                quiz_id: quizId,
                ...questionData,
            };
            const qResponse = await createQuestion(qPayload);
            const newQuestion = qResponse.data?.data || qResponse.data;
            const questionId = newQuestion.id;

            // 2. Create the options
            const optionPromises = options.map((opt, idx) => {
                return createQuestionOption({
                    question_id: questionId,
                    label: opt.label,
                    is_correct: opt.is_correct,
                    sort_order: idx + 1
                });
            });

            await Promise.all(optionPromises);

            // 3. Update local state
            setQuestions((prev) => [...prev, { ...newQuestion, options }]);
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || "Failed to add question or options" 
            };
        } finally {
            setCreatingQuestion(false);
        }
    };


    const handlePublishQuiz = async () => {
        try {
            setLoading(true);
            
            // PUT requests often require the full object
            const payload = {
                title: quiz.title,
                description: quiz.description,
                time_limit_minutes: quiz.time_limit_minutes,
                difficulty: quiz.difficulty,
                is_published: true
            };

            await updateQuiz(quizId, payload);
            setQuiz((prev) => ({ ...prev, is_published: true }));
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || "Failed to publish quiz" 
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        quiz,
        questions,
        loading,
        error,
        creatingQuestion,
        handleAddQuestion,
        handlePublishQuiz,
        refresh: fetchQuizDetails
    };
}
