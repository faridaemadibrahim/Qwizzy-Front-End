import { useState, useCallback } from "react";
import { deleteQuiz } from "../services/admin.api";

export default function useDeleteQuiz() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDeleteQuiz = useCallback(async (id, onSuccess) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await deleteQuiz(id);
            setSuccess(true);
            
            if (onSuccess) {
                onSuccess(id);
            }
            
            return { success: true };
        } catch (err) {
            const body = err?.response?.data;
            const msg = body?.message || err.message || "Failed to delete quiz.";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        handleDeleteQuiz, 
        loading, 
        error, 
        success,
        setError,
        setSuccess
    };
}
