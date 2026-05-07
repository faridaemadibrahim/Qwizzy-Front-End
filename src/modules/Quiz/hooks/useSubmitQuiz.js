import { useState, useCallback } from "react";
import { submitQuizAttempt } from "../services/quizService";

export default function useSubmitQuiz() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleSubmit = useCallback(async (quizId, answers) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = {
                quiz_id: quizId,
                answers,
            };

            const { data: response } = await submitQuizAttempt(payload);
            const resultData = response?.data || response;
            setResult(resultData);
            return { success: true, data: resultData };
        } catch (err) {
            const body = err?.response?.data;
            const msg = body?.message || err.message || "Failed to submit quiz.";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        handleSubmit,
        loading,
        error,
        result,
    };
}
